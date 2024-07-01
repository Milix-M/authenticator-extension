import { Account } from "./models/account";
import { StorageProvider } from "./storage";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "insertTwoFactorCodeMenu",
    title: "二段階認証コードを挿入",
    contexts: ["editable"],
  });
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.addAccount) {
    insertAccountMenuToParent(request.addAccount);
  } else if (request.deleteAccount) {
    removeAccountMenu(request.deleteAccount);
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const storageProvider = new StorageProvider();

  storageProvider.getSecrets().then((values) => {
    let twofaCode: string | undefined;

    //該当するアカウント取ってくる
    for (const value of values) {
      if (value.accountUUID === info.menuItemId) {
        twofaCode = value.genTwoFaCode();
      }
    }

    if (tab !== undefined && tab.id !== undefined) {
      // chrome内蔵のページで動作させるとエラー発生する
      if (tab.url?.startsWith("chrome://")) return;

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (twofaCode) => {
          const activeEl = document.activeElement as HTMLInputElement;

          // アクティブな要素アリ & acc 存在確認
          if (activeEl !== null && twofaCode !== undefined) {
            activeEl.value = twofaCode;
          }
        },
        args: [twofaCode],
      });
    }
  });
});

function insertAccountMenuToParent(account: Account) {
  chrome.contextMenus.create({
    id: account.accountUUID,
    parentId: "insertTwoFactorCodeMenu",
    title: account.label,
    contexts: ["editable"],
  });
}

function removeAccountMenu(accountUUID: string) {
  chrome.contextMenus.remove(accountUUID);
}
