import { v4 as uuidv4 } from "uuid";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "injectTwoFaCode",
    title: "二段階認証コードを挿入...",
    contexts: ["editable"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const classNameUUID = uuidv4();

  if (tab !== undefined && tab.id !== undefined) {
    // chrome内蔵のページで動作させるとエラー発生する
    if (tab.url?.startsWith("chrome://")) return;

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (classNameUUID) => {
        const activeEl = document.activeElement as HTMLInputElement;

        if (activeEl !== null) {
          // ポップアップ側でアクティブだった要素を特定するためにuuidをクラス名に追加する
          activeEl.classList.add(classNameUUID);
        }
      },
      args: [classNameUUID],
    });

    switch (info.menuItemId) {
      case "injectTwoFaCode":
        chrome.windows.create({
          url: `../popup.html?uuid=${classNameUUID}&tabid=${tab?.id}`,
          type: "popup",
          width: 340,
          height: 520,
          focused: true,
        });
        console.log(tab);
    }
  }
});
