import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { Totp } from './totp.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
    <p id="twofacode"></p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const genTwoFaCode = () => {
  const totp = new Totp(6, 30);
  const key = totp.decodeB32Code("thisisasecretkey");

  const code = totp.totp(key, new Date);
  
  const twofacode = document.getElementById("twofacode");

  if (twofacode) {
    twofacode.innerHTML = code;
  }
}

genTwoFaCode();