import jsQR from "jsqr";
import { PNG } from "pngjs";
import parseURI from "otpauth-uri-parser";
import { Account } from "./models/account";
import { v4 as uuidv4 } from "uuid";

export async function readQRtoAccount() {
  let account: Account | undefined;

  // タブ情報取得
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url !== undefined && !/chrome:\/\//.test(tab.url)) {
    chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (result) => {
      const png = PNG.sync.read(
        Buffer.from(result.slice("data:image/png;base64,".length), "base64")
      );
      const code = jsQR(
        Uint8ClampedArray.from(png.data),
        png.width,
        png.height
      );

      if (code !== null) {
        const parsed = parseURI(code.data);

        // Accountクラスに戻す
        account = Object.assign(
          new Account(
            uuidv4(),
            parsed.query.secret,
            parsed.type,
            parsed.label.issuer + parsed.label.account,
            new Date().getTime(),
            parsed.query.period,
            parsed.query.counter,
            parsed.query.issuer
          )
        );
      }
    });
  }
  return account;
}
