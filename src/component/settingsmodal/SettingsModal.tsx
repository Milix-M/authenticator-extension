import { useState } from "react";

import { supportedTheme } from "../../supportedTheme";
import { setThemeToDaisyui } from "../../theme";
import { exportAccounts, importAccounts } from "../../backup";

interface settingsModalProps {
  modalRef: React.RefObject<HTMLDialogElement>;
}

const SettingsModal: React.FC<settingsModalProps> = ({ modalRef }) => {
  const savedTheme = localStorage.getItem("selectedTheme");
  const [theme, setTheme] = useState(localStorage.getItem("selectedTheme"));

  const saveTheme = (theme: string | null) => {
    if (theme !== null) {
      localStorage.setItem("selectedTheme", theme);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget?.files && e.currentTarget.files[0]) {
      const targetFile = e.currentTarget.files[0];
      importAccounts(targetFile);
    }
  };

  return (
    <>
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Authenticatorの設定</h3>

          <div className="mt-1 flex justify-center">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">テーマ</span>
              </div>
              <select
                className="select select-bordered select-sm"
                onChange={(e) => {
                  setTheme(e.target.value);
                  setThemeToDaisyui(e.target.value);
                }}
                value={theme !== null ? theme : "light"}
              >
                {supportedTheme.map((theme) => (
                  <option value={theme}>{theme}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-1 flex justify-center">
            <div className="w-full max-w-xs">
              <div className="label">
                <span className="label-text">アカウント引き継ぎ</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="btn btn-sm btn-primary w-full"
                  onClick={() => exportAccounts()}
                >
                  エクスポート
                </button>
                <button
                  className="btn btn-sm btn-primary w-full"
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
                  インポート
                </button>
              </div>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn"
                onClick={() => {
                  setTheme(savedTheme);
                  setThemeToDaisyui(savedTheme);
                }}
              >
                キャンセル
              </button>
              <button
                className="btn btn-primary ml-2"
                onClick={() => {
                  saveTheme(theme);
                  setThemeToDaisyui(theme);
                }}
              >
                保存
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default SettingsModal;
