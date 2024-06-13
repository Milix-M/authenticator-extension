import { Account } from "./models/account";
import crypto from "crypto-js";
import CryptoJS from "crypto-js";
import { getBucket } from "@extend-chrome/storage";
import { v4 as uuidv4 } from "uuid";

/**
 * シークレット, カウンタなどの情報をinput, outputするクラス
 */
export class StorageProvider {
  private readonly bucket = getBucket("acc-bucket", "sync");

  public async setSecret(account: Account) {
    const encryptedAccount = this.genSavingEncryptString(account);

    await this.bucket.set({
      [account.accountUUID]: encryptedAccount,
    });
  }

  public async getSecrets() {
    const secrets = await this.bucket.get();

    // Accountの配列に入れてあげる
    const accounts: Account[] = [];
    // Mapにすべき？
    for (const [_, v] of Object.entries(secrets)) {
      accounts.push(this.decodeEncryptAccount(v));
    }

    // 降順ソート
    return [...accounts].sort((a, b) => b.addedAt - a.addedAt);
  }

  /**
   * シークレットを削除します
   * @param accountUUID アカウントのuuid
   */
  public async removeSecret(accountUUID: string) {
    // const secrets = await this.bucket.get();

    await this.bucket.remove(accountUUID);
  }

  /**
   * Accountクラスの属性を元にパスワードにより暗号化された文字列を生成します
   *
   * @param account
   * @returns 暗号化されたAcccountクラス文字列
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
      new Account(uuidv4(), "", "totp", "", 0),
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
