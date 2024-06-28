chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "insertTwoFactorCodeMenu",
    title: "二段階認証コードを挿入",
    contexts: ["editable"],
  });
});
