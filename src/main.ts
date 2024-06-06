import { Account } from "./models/account.ts";
import { StorageProvider } from "./storage.ts";
import { Totp } from "./totp.ts";

/**
 * 二段階認証コードをシークレットに基づき計算します
 * @param secret 共有されたシークレット
 * @param type 二段階認証のタイプ
 * @param counter HOTPのカウンタ
 * @returns 6桁の計算結果
 */
const genTwoFaCode = (
  secret: string,
  type: "totp" | "hotp",
  counter?: number
): string => {
  let code = "";

  if (type === "totp") {
    const totp = new Totp(6, 30);
    const key = totp.decodeB32Code(secret);
    code = totp.totp(key, new Date());
  } else if (type === "hotp") {
    const hotp = new Totp(6, 30);
    const key = hotp.decodeB32Code(secret);
    // counterが入ってなければデフォルトで0いれる
    if (!counter) {
      counter = 0;
    }
    code = hotp.hotp(key, counter);
  }

  return code;
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

const p = document.getElementById("code");
if (p !== null) {
  p.textContent = genTwoFaCode("thisisasecretkey", "totp");
}

const stp = new StorageProvider();
stp.setSecret(new Account(0, "thisisasecretkey", "totp", "テスト"));
stp.getSecret();

