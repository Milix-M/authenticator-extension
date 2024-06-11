import { FiTrash } from "react-icons/fi";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { MdContentCopy } from "react-icons/md";
import { StorageProvider } from "../../storage";
import { Account } from "../../models/account";
import { useRef, useState } from "react";

interface accountProps {
  account: Account;
  setAccounts: React.Dispatch<React.SetStateAction<Account[] | undefined>>;
  timeCounter: number;
}

const AccountView: React.FC<accountProps> = ({
  account,
  setAccounts,
  timeCounter,
}) => {
  const [showCopiedMsg, setShowCopiedMsg] = useState<boolean>(false);

  const storageProvider = new StorageProvider();

  const showDeleteConfirmModal = () => {
    const modal = document.getElementById(
      "delteAccountModal"
    ) as HTMLDialogElement;

    if (modal !== null) {
      modal.showModal();
    }
  };


  const modalRef = useRef<HTMLDialogElement>(null);
  const showAccountEditModal = () => {

    if (modalRef.current !== null) {
      modalRef.current.showModal();
    }
  };


  const copyToClipboard = async () => {
    await global.navigator.clipboard.writeText(account.genTwoFaCode());
    setShowCopiedMsg(true);
    setTimeout(() => {
      setShowCopiedMsg(false);
    }, 2000);
  };

  return (
    <>
      <dialog
        id="delteAccountModal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">アカウントを削除</h3>
          <p className="break-words text-sm mt-2">
            アカウントを削除すると復元することはできません。よろしいですか？
          </p>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">キャンセル</button>
              <button
                className="btn btn-primary ml-2"
                onClick={async () => {
                  await storageProvider
                    .removeSecret(account.accountUUID)
                    .then(async () =>
                      setAccounts(await storageProvider.getSecrets())
                    );
                }}
              >
                実行
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog
        ref={modalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">アカウント編集</h3>
          <p className="break-words text-sm mt-2"></p>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">キャンセル</button>
              <button className="btn btn-primary ml-2" onClick={() => {}}>
                保存
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="group bg-base-100 border p-2 rounded">
        {showCopiedMsg && (
          <div className="toast toast-center toast-middle z-[100] select-none">
            <div className="alert alert-info">
              <span className="text-sm">クリップボードにコピーしました</span>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <p className="text-sm">{account.label}</p>
          <div className="ml-auto flex items-center">
            <HiOutlinePencilAlt
              className="w-4 h-4 mr-1 hidden group-hover:block hover:cursor-pointer"
              onClick={() => {
                showAccountEditModal();
              }}
            />
            <FiTrash
              className="w-4 h-4 hidden group-hover:block hover:cursor-pointer"
              onClick={() => {
                showDeleteConfirmModal();
              }}
            />
          </div>
        </div>
        <div className="flex items-baseline">
          <p className="text-4xl mt-1 tracking-wider">
            {account.genTwoFaCode()}
          </p>
          {/* copy icon */}
          <div className="flex space-x-1">
            <MdContentCopy
              className="w-4 h-4 ml-1 hover:cursor-pointer"
              onClick={() => copyToClipboard()}
            />
          </div>

          {/* time counter */}
          <div
            className="radial-progress bg-base-300 ml-auto"
            style={{
              ["--value" as string]: timeCounter,
              ["--size" as string]: "1.8em",
            }}
            role="progressbar"
          ></div>
        </div>
      </div>
    </>
  );
};

export default AccountView;
