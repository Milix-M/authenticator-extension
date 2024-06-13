import { useRef } from "react";
import { FiPlusSquare } from "react-icons/fi";
import { LuQrCode, LuSettings } from "react-icons/lu";
import SettingsModal from "../settingsmodal/SettingsModal";
import { readQRtoAccount } from "../../qrcodereader";

const Header = () => {
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

  return (
    <>
      <SettingsModal modalRef={settingsModalRef} />

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
          <LuQrCode className="w-5 h-5 hover:cursor-pointer" onClick={() => {
            readQRtoAccount();
          }}/>
        </div>
      </div>
    </>
  );
};

export default Header;
