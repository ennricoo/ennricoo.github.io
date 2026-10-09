// Genera favicon e icone app ritagliando la "E" blu di ROLEPLAY dal logo originale
import sharp from 'sharp'

const SRC = 'screenshots/logo.png'
const NAVY = { r: 11, g: 24, b: 52 }

// Ritaglio della lettera, ingrandita prima di scontornarla per avere bordi netti
const SCALE = 8
const { data, info } = await sharp(SRC)
  .extract({ left: 428, top: 512, width: 86, height: 92 })
  .resize({ width: 86 * SCALE, kernel: 'lanczos3' })
  .ensureAlpha().raw().toBuffer({ resolveWithObject: true })
// Maschera della lettera: solo il riempimento blu, poi filtro mediano per eliminare il rumore
const mask = Buffer.alloc(info.width * info.height)
for (let i = 0, p = 0; i < data.length; i += 4, p++) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
  mask[p] = b > 150 && r < 90 && b - g > 70 ? 255 : 0
}
const cleanMask = await sharp(mask, { raw: { width: info.width, height: info.height, channels: 1 } })
  .median(21).png().toBuffer()
// Tiene solo la componente connessa più grande (la lettera), scarta i residui d'ombra
const { data: raw, info: ri } = await sharp(cleanMask).extractChannel(0).raw().toBuffer({ resolveWithObject: true })
const W = ri.width, H = ri.height
const label = new Int32Array(W * H)
let best = 0, bestSize = 0, next = 0
for (let start = 0; start < W * H; start++) {
  if (raw[start] < 128 || label[start]) continue
  const id = ++next
  const stack = [start]
  label[start] = id
  let size = 0
  while (stack.length) {
    const p = stack.pop(); size++
    const x = p % W, y = (p / W) | 0
    for (const q of [x > 0 && p - 1, x < W - 1 && p + 1, y > 0 && p - W, y < H - 1 && p + W]) {
      if (q !== false && raw[q] >= 128 && !label[q]) { label[q] = id; stack.push(q) }
    }
  }
  if (size > bestSize) { bestSize = size; best = id }
}
const only = Buffer.alloc(W * H)
for (let p = 0; p < W * H; p++) only[p] = label[p] === best ? 255 : 0
const { data: m, info: mi } = await sharp(only, { raw: { width: W, height: H, channels: 1 } })
  .blur(1.2).trim().raw().toBuffer({ resolveWithObject: true })

// Riempimento con il gradiente blu del logo (#3f7fff -> #1d4fd8)
const rgba = Buffer.alloc(mi.width * mi.height * 4)
for (let y = 0; y < mi.height; y++) {
  const t = y / (mi.height - 1)
  const col = [0x3f + (0x1d - 0x3f) * t, 0x7f + (0x4f - 0x7f) * t, 0xff + (0xd8 - 0xff) * t]
  for (let x = 0; x < mi.width; x++) {
    const p = y * mi.width + x
    rgba.set([col[0], col[1], col[2], m[p * mi.channels]], p * 4)
  }
}
const letter = await sharp(rgba, { raw: { width: mi.width, height: mi.height, channels: 4 } }).png().toBuffer()

async function icon(size, file, radius = 0.22) {
  const r = Math.round(size * radius)
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="rgb(${NAVY.r},${NAVY.g},${NAVY.b})"/></svg>`)
  const inner = await sharp(letter).resize({ width: Math.round(size * 0.56), height: Math.round(size * 0.6), fit: 'inside' }).toBuffer()
  await sharp(bg).composite([{ input: inner, gravity: 'center' }]).png().toFile(file)
}

await icon(32, 'public/favicon-32.png')
await icon(180, 'public/apple-touch-icon.png', 0)
await icon(512, 'public/icon-512.png')
console.log('icone generate')
