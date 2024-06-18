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

export const importAccounts = (e: File) => {
  const reader = new FileReader();
  const storageProvider = new StorageProvider();

  reader.onloadend = async () => {
    const parsedJson = JSON.parse(reader.result as string);
    for (const [_, v] of Object.entries(parsedJson)) {
      await storageProvider.setSecret(
        Object.assign(new Account(uuidv4(), "", "totp", "", 0), v)
      );
    }
  };

  reader.readAsText(e);
};
