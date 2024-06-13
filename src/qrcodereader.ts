export async function getImage() {
  // タブ情報取得
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url !== undefined && !/chrome:\/\//.test(tab.url)) {
    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, (result) => {
        const child = document.createElement('img');
        child.setAttribute('src', result)

        document.body.appendChild(child)
    });
  }
}
