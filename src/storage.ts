import { Account } from "./models/account";
import crypto from 'crypto-js';

/**
 * シークレット, カウンタなどの情報をinput, outputするクラス
 */
export class StorageProvider {
  public setSecret(account: Account) {
    const encryptedAccount = this.genSavingEncryptString(account);
  }

  public getSecret() {}

  /**
   * Accountクラスの属性を元にパスワードにより暗号化された文字列を生成します
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

    // 暗号化するパスワード
    let password = "password";

    if (import.meta.env.VITE_ENCRYPT_PASSWORD !== undefined) {
      password = import.meta.env.VITE_ENCRYPT_PASSWORD;
    }

    // 暗号化して返却
    return crypto.AES.encrypt(buildString, password).toString();
  }
}
