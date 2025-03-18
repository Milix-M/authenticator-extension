import { useState } from "react";

import { supportedTheme } from "../../supportedTheme";
import { setThemeToDaisyui } from "../../theme";
import { exportAccounts, importAccounts } from "../../backup";
import { Account } from "../../models/account";
import { StorageProvider } from "../../storage";
import { useTranslation } from "react-i18next";

interface settingsModalProps {
  modalRef: React.RefObject<HTMLDialogElement>;
  setAccounts: React.Dispatch<React.SetStateAction<Account[] | undefined>>;
}

const SettingsModal: React.FC<settingsModalProps> = ({
  modalRef,
  setAccounts,
}) => {
  // i18n
  const { t } = useTranslation();

  const savedTheme = localStorage.getItem("selectedTheme");
  const [theme, setTheme] = useState(localStorage.getItem("selectedTheme"));
  const [importSuccessNotify, setImportSuccessNotify] = useState(false);
  const [importErrorNotify, setImportErrorNotify] = useState(false);

  const saveTheme = (theme: string | null) => {
    if (theme !== null) {
      localStorage.setItem("selectedTheme", theme);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget?.files && e.currentTarget.files[0]) {
      const targetFile = e.currentTarget.files[0];
      importAccounts(targetFile)
        .then(async () => {
          setImportErrorNotify(false);
          setImportSuccessNotify(true);

          const storageProvider = new StorageProvider();
          await storageProvider.getSecrets().then((values) => {
            setAccounts(values);
          });
        })
        .catch(() => {
          setImportSuccessNotify(false);
          setImportErrorNotify(true);
        });
    }
  };

  return (
    <>
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{t("settings_modal.title")}</h3>

          <div className="mt-1 flex justify-center">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">{t("settings_modal.theme")}</span>
              </div>
              <select
                className="select select-bordered select-sm"
                onChange={(e) => {
                  setTheme(e.target.value);
                  setThemeToDaisyui(e.target.value);
                }}
                value={theme !== null ? theme : "system"}
              >
                <option value={"syncSystem"}>system</option>
                {supportedTheme.map((theme) => (
                  <option value={theme}>{theme}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-1 flex justify-center">
            <div className="w-full max-w-xs">
              <div className="label">
                <span className="label-text">{t("settings_modal.account_transfer")}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="btn btn-sm btn-primary w-full"
                  onClick={() => exportAccounts()}
                >
                  {t("settings_modal.export")}
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
                  {t("settings_modal.import")}
                </button>
              </div>
              {importErrorNotify && (
                <p className="mt-1 text-center font-bold text-error">
                  {t("import_failed")}
                </p>
              )}
              {importSuccessNotify && (
                <p className="mt-1 text-center font-bold text-success">
                  {t("import_success")}
                </p>
              )}
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
                  setImportErrorNotify(false);
                  setImportSuccessNotify(false);
                }}
              >
                {t("common.cancel")}
              </button>
              <button
                className="btn btn-primary ml-2"
                onClick={() => {
                  saveTheme(theme);
                  setThemeToDaisyui(theme);
                  setImportErrorNotify(false);
                  setImportSuccessNotify(false);
                }}
              >
                {t("common.save")}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default SettingsModal;
