import React, { useCallback, useRef, useState } from "react";
import { FiPlusSquare } from "react-icons/fi";
import { LuQrCode, LuSettings } from "react-icons/lu";
import SettingsModal from "../settingsmodal/SettingsModal";
import { readQRtoAccount } from "../../qrcodereader";
import { StorageProvider } from "../../storage";
import { Account } from "../../models/account";
import Toast from "../toast/Toast";
import { useTranslation } from "react-i18next";

interface headerProps {
  setAccounts: React.Dispatch<React.SetStateAction<Account[] | undefined>>;
}

const Header: React.FC<headerProps> = ({ setAccounts }) => {
  // i18n
  const { t } = useTranslation();

  // メッセージ表示toast管理state
  const [showNotifyToast, setShowNotifyToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [notifyType, setNotifyType] = useState<"alert-info" | "alert-warning">(
    "alert-info"
  );

  const settingsModalRef = useRef<HTMLDialogElement>(null);
  const showSettingsModal = () => {
    if (settingsModalRef.current !== null) {
      settingsModalRef.current.showModal();
    }
  };

  const showAccModal = () => {
    const modal = document.getElementById(
      "addAccountModal"
    ) as HTMLDialogElement;

    if (modal !== null) {
      modal.showModal();
    }
  };

  const notifyToast = (msg: string, type: "info" | "warning") => {
    setToastMsg(msg);

    if (type === "info") {
      setNotifyType("alert-info");
    } else if (type === "warning") {
      setNotifyType("alert-warning");
    }

    setShowNotifyToast(true);

    setTimeout(() => {
      setShowNotifyToast(false);
    }, 3000);
  };

  const handleQRCodeClick = useCallback(async () => {
    try {
      let newAccount: Account | undefined;

      await readQRtoAccount().then((account) => {
        newAccount = account;
      });

      if (newAccount) {
        const storageProvider = new StorageProvider();
        await storageProvider.setSecret(newAccount);
        const values = await storageProvider.getSecrets();
        setAccounts(values);
        notifyToast(t("notify.success_add_account"), "info");
      } else {
        notifyToast(t("notify.failed_add_acount"), "warning");
      }
    } catch (error) {
      console.error("Failed to read QR code and set account:", error);
    }
  }, [setAccounts]);

  return (
    <>
      <SettingsModal modalRef={settingsModalRef} setAccounts={setAccounts} />

      {showNotifyToast && <Toast toastText={toastMsg} toastType={notifyType} />}

      <div className="py-3 px-4 w-full flex items-center justify-between bg-base-100 border-b">
        <div className="flex space-x-2">
          {/* gear icon */}
          <LuSettings
            className="w-5 h-5 hover:cursor-pointer"
            onClick={() => showSettingsModal()}
          />
          <div className="w-5 h-5"></div>
        </div>
        <p className="text-center text-base font-bold">Authenticator</p>
        <div className="flex space-x-2">
          {/* Add icon */}
          <FiPlusSquare
            className="w-5 h-5 hover:cursor-pointer"
            onClick={() => showAccModal()}
          />
          {/* QRCode icon */}
          <LuQrCode
            className="w-5 h-5 hover:cursor-pointer"
            onClick={handleQRCodeClick}
          />
        </div>
      </div>
    </>
  );
};

export default Header;
