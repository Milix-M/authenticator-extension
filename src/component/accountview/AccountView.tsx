import { FiTrash } from "react-icons/fi";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { MdContentCopy } from "react-icons/md";
import { StorageProvider } from "../../storage";
import { Account } from "../../models/account";
import { useRef, useState } from "react";
import useInterval from "use-interval";
import { TbReload } from "react-icons/tb";

interface accountProps {
  account: Account;
  setAccounts: React.Dispatch<React.SetStateAction<Account[] | undefined>>;
}

const AccountView: React.FC<accountProps> = ({ account, setAccounts }) => {
  // コピー完了toast管理state
  const [showCopiedMsg, setShowCopiedMsg] = useState<boolean>(false);
  const [persentage, setParsentage] = useState<number>(0);
  const [editedName, setEditedName] = useState<string>(account.label);
  const [hotpCode, setHotpCode] = useState<string>("******");
  const [isHotpCooldown, setIsHotpCooldown] = useState<boolean>(false);
  const storageProvider = new StorageProvider();

  const delConfirmModalRef = useRef<HTMLDialogElement>(null);
  /** 削除確認モーダルを表示します */
  const showDeleteConfirmModal = () => {
    if (delConfirmModalRef.current !== null) {
      delConfirmModalRef.current.showModal();
    }
  };

  const modalRef = useRef<HTMLDialogElement>(null);
  /** アカウント編集モーダルを表示します */
  const showAccountEditModal = () => {
    setEditedName(account.label);

    if (modalRef.current !== null) {
      modalRef.current.showModal();
    }
  };

  /**
   * クリップボードに二段階認証をコピーして、コピー完了toastを表示します
   */
  const copyToClipboard = async () => {
    await global.navigator.clipboard.writeText(account.genTwoFaCode());
    setShowCopiedMsg(true);
    setTimeout(() => {
      setShowCopiedMsg(false);
    }, 2000);
  };

  /**
   * 残り秒数カウンターのパーセンテージを計算して表示します
   * @returns コード更新までのパーセント
   */
  const counterPercentage = () => {
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = account.timeStep - (now % account.timeStep);

    // パーセンテージに変換
    const percentage = Math.floor((remainingSeconds / account.timeStep) * 100);

    return percentage;
  };

  /** 1000ms事に秒数更新 */
  useInterval(() => {
    setParsentage(counterPercentage());
  }, 1000);

  return (
    <>
      <dialog
        ref={delConfirmModalRef}
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

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">アカウント編集</h3>
          <p className="break-words text-sm mt-2"></p>

          <div className="mt-1 flex justify-center">
            <label className="form-control w-full max-w-xs ">
              <div className="label py-1">
                <span className="label-text">アカウント名</span>
                <span className="label-text-alt">必須</span>
              </div>
              <input
                type="text"
                placeholder="Account Name"
                className="input input-sm input-bordered w-full max-w-xs"
                onChange={(e) => {
                  setEditedName(e.target.value);
                }}
                value={editedName}
              />
            </label>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">キャンセル</button>
              <button
                className="btn btn-primary ml-2"
                onClick={async () => {
                  if (editedName.length >= 1) {
                    account.label = editedName;
                    await storageProvider.setSecret(account).then(async () => {
                      setAccounts(await storageProvider.getSecrets());
                    });
                  }
                }}
              >
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
            {account.type === "totp" ? account.genTwoFaCode() : hotpCode}
          </p>
          {/* copy icon */}
          <div className="flex space-x-1">
            <MdContentCopy
              className="w-4 h-4 ml-1 hover:cursor-pointer"
              onClick={() => copyToClipboard()}
            />
          </div>

          {/* time counter */}
          {account.type === "totp" ? (
            <div
              className="radial-progress bg-base-300 ml-auto"
              style={{
                ["--value" as string]: persentage,
                ["--size" as string]: "1.8em",
              }}
              role="progressbar"
            ></div>
          ) : (
            <TbReload
              className="w-[1.8em] h-[1.8em] ml-auto hover:cursor-pointer"
              onClick={async () => {
                if (!isHotpCooldown) {
                  setHotpCode(account.genTwoFaCode());

                  storageProvider.setSecret(account).then(async () => {
                    setAccounts(await storageProvider.getSecrets());
                  });

                  //連続で押せなくする
                  setIsHotpCooldown(true);
                  setTimeout(() => {
                    setIsHotpCooldown(false);
                  }, 5000);
                }
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AccountView;
