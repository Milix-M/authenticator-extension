import { FiTrash } from "react-icons/fi";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { MdContentCopy } from "react-icons/md";
import { StorageProvider } from "../../storage";
import { Account } from "../../models/account";

interface accountProps {
  label: string;
  code: number;
  accountUUID: string;
  setAccounts: React.Dispatch<React.SetStateAction<Account[] | undefined>>;
}

const AccountView: React.FC<accountProps> = ({
  label,
  code,
  accountUUID,
  setAccounts,
}) => {
  const storageProvider = new StorageProvider();

  const showDeleteConfirmModal = () => {
    const modal = document.getElementById(
      "delteAccountModal"
    ) as HTMLDialogElement;

    if (modal !== null) {
      modal.showModal();
    }
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
                    .removeSecret(accountUUID)
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

      <div className="group bg-base-100 border p-2 rounded">
        <div className="flex items-center">
          <p className="text-sm">{label}</p>
          <div className="ml-auto flex items-center">
            <HiOutlinePencilAlt className="w-4 h-4 mr-1 hidden group-hover:block" />
            <FiTrash
              className="w-4 h-4 hidden group-hover:block hover:cursor-pointer"
              onClick={() => {
                showDeleteConfirmModal();
              }}
            />
          </div>
        </div>
        <div className="flex items-baseline">
          <p className="text-4xl mt-1">{code}</p>
          {/* copy icon */}
          <MdContentCopy className="w-4 h-4 ml-1" />

          {/* time counter */}
          <div
            className="radial-progress bg-base-300 ml-auto"
            style={{ ["--value" as any]: 70, ["--size" as any]: "1.8em" }}
            role="progressbar"
          ></div>
        </div>
      </div>
    </>
  );
};

export default AccountView;
