import { useState } from "react";

import { supportedTheme } from "../../supportedTheme";
import { setThemeToDaisyui } from "../../theme";

interface settingsModalProps {
  modalRef: React.RefObject<HTMLDialogElement>;
}

const SettingsModal: React.FC<settingsModalProps> = ({ modalRef }) => {
  const [theme, setTheme] = useState(localStorage.getItem("selectedTheme"));

  const saveTheme = (theme: string | null) => {
    console.log("do");
    if (theme !== null) {
      localStorage.setItem("selectedTheme", theme);
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
                onChange={(e) => setTheme(e.target.value)}
                value={theme !== null ? theme : "light"}
              >
                {supportedTheme.map((theme) => (
                  <option value={theme}>{theme}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn"
                onClick={() => {
                  setTheme(localStorage.getItem("selectedTheme"));
                }}
              >
                キャンセル
              </button>
              <button
                className="btn btn-primary ml-2"
                onClick={() => {
                  saveTheme(theme);
                  setThemeToDaisyui(localStorage.getItem("selectedTheme"));
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
