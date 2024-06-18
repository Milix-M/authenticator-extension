import { Account } from "./models/account";
import { StorageProvider } from "./storage";
import { v4 as uuidv4 } from "uuid";

/**
 * アカウントをエクスポートしてダウンロードさせます.
 */
export const exportAccounts = () => {
  const storageProvider = new StorageProvider();
  storageProvider.getSecrets().then((values) => {
    const blob = new Blob([JSON.stringify(values)], { type: "text/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "exportedAccount.json";
    link.click();
  });
};

/**
 * 引数に渡されたFileオブジェクトからアカウントをstorageに格納します
 * @param e アカウント情報が格納されたFile型 オブジェクト.
 * @returns Promise
 */
export const importAccounts = async (e: File): Promise<void> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      try {
        const parsedJson = JSON.parse(reader.result as string);
        const storageProvider = new StorageProvider();

        for (const [_, v] of Object.entries(parsedJson)) {
          await storageProvider.setSecret(
            Object.assign(new Account(uuidv4(), "", "totp", "", 0), v)
          );
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject; // ファイル読み込みエラーを処理
    reader.readAsText(e);
  });
};
