import Header from "./component/header/Header";
import AccountView from "./component/accountview/AccountView";
import { useEffect, useState } from "react";
import { StorageProvider } from "./storage";
import { Account } from "./models/account";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [accountName, setAccountName] = useState("");
  const [secret, setSecret] = useState("");
  const [otpType, setOtpType] = useState("totp");
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);

  const storageProvider = new StorageProvider();

  // アカウント取ってくる
  const [accounts, setAccounts] = useState<Account[]>();
  useEffect(() => {
    const getAccounts = async () => {
      const res = await storageProvider.getSecrets();
      setAccounts(res);
    };

    getAccounts();
    console.log("実行");
  }, []);

  useEffect(() => {
    if (checkInputValue(accountName, secret, otpType)) {
      setIsBtnDisabled(false);
    } else {
      setIsBtnDisabled(true);
    }
  }, [accountName, secret, otpType]);

  /** アカウント追加フォームの入力値を検証します */
  const checkInputValue = (
    accountName: string,
    secret: string,
    otpType: string
  ) => {
    if (accountName.length >= 1 && secret.length >= 1 && otpType.length >= 1) {
      if (secret.length >= 16 && (otpType === "totp" || otpType === "hotp")) {
        /** 各引数のlengthの長さが1以上 & secretが16文字, otpTypeがtotp or hotpの時のみ成功 */
        return true;
      }
    }

    return false;
  };

  /** アカウント追加フォームをリセットします */
  const resetInputForm = () => {
    setAccountName("");
    setSecret("");
    setOtpType("totp");
  };

  return (
    <>
      <div id="app" className="w-full flex justify-center">
        <dialog
          id="addAccountModal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <h3 className="font-bold text-base">コードを追加</h3>

            <div className="mt-1 flex justify-center">
              <label className="form-control w-full max-w-xs ">
                <div className="label py-1">
                  <span className="label-text">アカウント名</span>
                  <span className="label-text-alt">必須</span>
                </div>
                <input
                  id="account"
                  type="text"
                  placeholder="Account Name"
                  className="input input-sm input-bordered w-full max-w-xs"
                  onChange={(e) => setAccountName(e.target.value)}
                  value={accountName}
                />
              </label>
            </div>

            <div className="mt-1 flex justify-center">
              <label className="form-control w-full max-w-xs ">
                <div className="label py-1">
                  <span className="label-text">キー</span>
                  <span className="label-text-alt">必須</span>
                </div>
                <input
                  type="text"
                  placeholder="Key"
                  className="input input-sm input-bordered w-full max-w-xs"
                  onChange={(e) => setSecret(e.target.value)}
                  value={secret}
                />
              </label>
            </div>

            <div className="mt-1 flex justify-center">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">タイプ</span>
                  <span className="label-text-alt">必須</span>
                </div>
                <select
                  className="select select-bordered select-sm"
                  onChange={(e) => setOtpType(e.target.value)}
                  value={otpType}
                >
                  <option value="totp">TOTP</option>
                  <option value="hotp">HOTP</option>
                </select>
              </label>
            </div>

            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button
                  className="btn"
                  onClick={() => {
                    resetInputForm();
                  }}
                >
                  閉じる
                </button>
                <button
                  className="btn btn-primary ml-2"
                  onClick={() => {
                    if (checkInputValue(accountName, secret, otpType)) {
                      const newAccount = new Account(uuidv4(), secret, otpType, accountName);

                      storageProvider
                      .setSecret(
                        newAccount
                      )
                      .then(function() {
                        setAccounts([...accounts as Account[], newAccount])
                        resetInputForm();
                      });
                    }
                  }}
                  disabled={isBtnDisabled}
                >
                  追加
                </button>
              </form>
            </div>
          </div>
        </dialog>

        <div className="max-w-xs w-full bg-base-200 flex flex-col">
          <Header />

          {/* main */}
          <div className="p-2 space-y-2 flex-grow h-96 overflow-y-scroll scrollbar-thin">
            {accounts?.map((account) => (
              <AccountView label={account.label} code={123456} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
