import { StorageProvider } from "./storage";

/**
 * アカウントをエクスポートしてダウンロードさせます.
 */
export const exportAccounts = () => {
  const storageProvider = new StorageProvider();
  storageProvider.getSecrets().then((values) => {
    const blob = new Blob([JSON.stringify(values)], { type: "text/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "exportedAccount.txt";
    link.click();
  });
};
