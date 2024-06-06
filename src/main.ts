import { Totp } from "./totp.ts";

const genTwoFaCode = () => {
  const totp = new Totp(6, 30);
  const key = totp.decodeB32Code("thisisasecretkey");

  const code = totp.totp(key, new Date());

  const twofacode = document.getElementById("twofacode");

  if (twofacode) {
    twofacode.innerHTML = code;
  }
};

/**
 * daisyuiのテーマを設定します.
 */
const setTheme = () => {
  const htmltag = document.querySelector("html");
  let theme = "dark";

  // 環境変数にテーマが設定してあれば読み込む
  if (import.meta.env.VITE_DAISYUI_THEME !== undefined) {
    theme = import.meta.env.VITE_DAISYUI_THEME;
  }

  // htmlタグにテーマ設定
  if (htmltag !== null) {
    htmltag.setAttribute("data-theme", theme);
  }
};

setTheme();
