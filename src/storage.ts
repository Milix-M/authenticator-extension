import { Account } from "./models/account";
import crypto from "crypto-js";
import CryptoJS from "crypto-js";
import { getBucket } from "@extend-chrome/storage";

/**
 * シークレット, カウンタなどの情報をinput, outputするクラス
 */
export class StorageProvider {
  public setSecret(account: Account) {
    const encryptedAccount = this.genSavingEncryptString(account);

    const bucket = getBucket("acc-bucket", "sync");

    bucket.set({
      [account.dbId]: encryptedAccount,
    });
  }

  /**
   * シークレットをDBからgetします
   */
  public async getSecret() {
    const bucket = getBucket("acc-bucket", "sync");

    const secrets = await bucket.get();

    for (let [_, v] of Object.entries(secrets)) {
      this.decodeEncryptAccount(v);
    }

  }

  /**
   * Accountクラスの属性を元にパスワードにより暗号化された文字列を生成します
   * TODO: JSONで扱う
   *
   * @param account
   * @returns
   */
  private genSavingEncryptString(account: Account): string {
    let buildString = "";

    // まずtype(totp or hotp)格納
    buildString += account.type + ":";
    // secret格納
    buildString += account.secret + ":";
    // 次にlabel
    buildString += account.label;
    // あればcounter
    if (account.counter !== undefined) {
      buildString += ":" + account.counter;
    }
    //　あればissuer
    if (account.issuer !== undefined) {
      buildString += ":" + account.issuer;
    }

    // 暗号化して返却
    return crypto.AES.encrypt(buildString, this.readPassword()).toString();
  }

  /**
   * パスワードを読み込みます
   * @returns パスワード
   */
  private readPassword(): string {
    // 暗号化するパスワード
    let password = "password";

    if (import.meta.env.VITE_ENCRYPT_PASSWORD !== undefined) {
      password = import.meta.env.VITE_ENCRYPT_PASSWORD;
    }

    return password;
  }

  /**
   * 暗号化されたAccountクラスを復号化します
   * @param encryptStr 暗号化されたAccount
   */
  private decodeEncryptAccount(encryptStr: string) {
    const decodedAccount = crypto.AES.decrypt(encryptStr, this.readPassword()).toString(CryptoJS.enc.Utf8);

    console.log(decodedAccount)
  }
}
