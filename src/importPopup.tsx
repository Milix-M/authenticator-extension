import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { importAccounts } from "./backup";
import { setThemeToDaisyui } from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ImportPopup />
  </React.StrictMode>
);

function ImportPopup() {
  // テーマを設定
  setThemeToDaisyui(localStorage.getItem("selectedTheme"));

  const [importMsg, setImportMsg] = useState<string>("バックアップファイルを選択してください");
  const [closeBtnText, setCloseBtnText] = useState<string>("キャンセル");
  const [importBtnFlag, setImportBtnFlag] = useState<boolean>(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget?.files && e.currentTarget.files[0]) {
      const targetFile = e.currentTarget.files[0];
      importAccounts(targetFile)
        .then(async () => {
          setImportMsg("アカウントのインポートに成功しました")
          setCloseBtnText("ウィンドウを閉じる")
          setImportBtnFlag(false)
        })
        .catch(() => {
        });
    }
  };

  return (
    <>
      <div id="app" className="w-full h-screen flex justify-center items-center">
        <div>
          <p className="text-center mb-3">{importMsg}</p>
          {importBtnFlag && (
            <button
              className="btn btn-sm btn-primary w-full mb-2"
              onClick={() => {
                const filePickInput = document.createElement("input");
                filePickInput.type = "file";
                filePickInput.accept = ".json";
                filePickInput.addEventListener("change", (e) =>
                  handleFileChange(e as any)
                );
                filePickInput.click();
              }}
            >
              ファイルを選択...
            </button>
          )}
          <button
            className="btn btn-sm w-full"
            onClick={() => {
              window.close()
            }}
          >
            {closeBtnText}
          </button>
        </div>
      </div>
    </>
  );
}