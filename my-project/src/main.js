import './style.css'
import { Navbar } from './components/Navbar.js'

document.querySelector('#app').innerHTML = `
  ${Navbar()}
`