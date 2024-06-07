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

  public async getSecrets() {
    const bucket = getBucket("acc-bucket", "sync");
    const secrets = await bucket.get();

    // Accountの配列に入れてあげる
    let accounts: Account[] = [];
    for (let [_, v] of Object.entries(secrets)) {
      accounts.push(this.decodeEncryptAccount(v));
    }

    return accounts;
  }

  /**
   * Accountクラスの属性を元にパスワードにより暗号化された文字列を生成します
   *
   * @param account
   * @returns 暗号化されたAcccountクラス　文字列
   */
  private genSavingEncryptString(account: Account): string {
    const accountJson = JSON.stringify(account);

    // 暗号化して返却
    return crypto.AES.encrypt(accountJson, this.readPassword()).toString();
  }

  /**
   * 暗号化されたAccountクラスを復号化します
   * @param encryptStr 暗号化されたAccount
   * @returns 復号化されたAccount
   */
  private decodeEncryptAccount(encryptStr: string): Account {
    const decodedAccount = crypto.AES.decrypt(
      encryptStr,
      this.readPassword()
    ).toString(CryptoJS.enc.Utf8);

    // Accountクラスに戻す
    const account: Account = Object.assign(
      new Account(0, "", "totp", ""),
      JSON.parse(decodedAccount)
    );

    return account;
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
}
