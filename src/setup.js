// Font, stili e direttive comuni a tutte le pagine
import '@fontsource-variable/inter'
import '@fontsource/michroma'
import './styles.css'
import { reveal } from './composables/reveal'

export const setup = (app) => app.directive('reveal', reveal)
