// Converte gli screenshot in WebP responsive (960w + 1920w) dentro public/img
import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import { join, parse } from 'node:path'

const SRC = 'screenshots'
const OUT = 'public/img'
const map = {
  'image-14.png': 'pitlane',
  'image-32.png': 'garage',
  'image-46.png': 'notte',
  'image.png': 'soccorso',
  'image22.png': 'ospedale',
  'imagee.png': 'polizia',
  'SPOILER_image3.png': 'centrale',
}

await mkdir(OUT, { recursive: true })
for (const file of await readdir(SRC)) {
  const name = map[file]
  if (!name) continue
  for (const w of [960, 1920]) {
    await sharp(join(SRC, file)).resize({ width: w }).webp({ quality: 78 }).toFile(join(OUT, `${name}-${w}.webp`))
  }
  console.log('ok', file, '->', name)
}

