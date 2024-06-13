import React, { useCallback, useRef, useState } from "react";
import { FiPlusSquare } from "react-icons/fi";
import { LuQrCode, LuSettings } from "react-icons/lu";
import SettingsModal from "../settingsmodal/SettingsModal";
import { readQRtoAccount } from "../../qrcodereader";
import { StorageProvider } from "../../storage";
import { Account } from "../../models/account";

interface headerProps {
  setAccounts: React.Dispatch<React.SetStateAction<Account[] | undefined>>;
}

const Header: React.FC<headerProps> = ({ setAccounts }) => {
  // メッセージ表示toast管理state
  const [showNotifyToast, setShowNotifyToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");

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

  const notifyToast = (msg: string) => {
    setToastMsg(msg);
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
        notifyToast("アカウントを追加しました");
      } else {
        notifyToast("アカウントを追加できませんでした");
      }
    } catch (error) {
      console.error("Failed to read QR code and set account:", error);
    }
  }, [setAccounts]);

  return (
    <>
      <SettingsModal modalRef={settingsModalRef} />

      {showNotifyToast && (
        <div className="toast toast-center toast-middle z-[100] select-none">
          <div className="alert alert-success">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

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
