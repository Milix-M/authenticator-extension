import { Account } from "./models/account";

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
