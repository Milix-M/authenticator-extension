import { Totp } from "./totp.ts";

/**
 * 二段階認証コードをシークレットに基づき計算します
 * @param secret 共有されたシークレット
 * @param type 二段階認証のタイプ
 * @param counter HOTPのカウンタ
 * @returns 6桁の計算結果
 */
export const genTwoFaCode = (
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

// const stp = new StorageProvider();
// stp.setSecret(new Account(0, "thisisasecretkey", "totp", "テスト", 12, "osa"));
// stp.getSecrets();