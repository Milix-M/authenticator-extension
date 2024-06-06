import { Totp } from './totp.ts'

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