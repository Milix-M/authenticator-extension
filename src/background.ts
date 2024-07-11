chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "injectTwoFaCode",
    title: "二段階認証コードを挿入...",
    contexts: ["editable"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "injectTwoFaCode":
      chrome.windows.create({
        url: "../popup.html",
        type: "popup",
        width: 350,
        height: 500,
        focused: true,
      });
      console.log(tab);
  }
});
