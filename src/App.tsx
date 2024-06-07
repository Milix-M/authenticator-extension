import Header from "./component/header/Header";
import AccountView from "./component/accountview/AccountView";
import { useState } from "react";

function App() {
  const [accountName, setAccountName] = useState("");
  const [secret, setSecret] = useState("");
  const [otpType, setOtpType] = useState("totp");

  const printValue = (a: string, s: string, t: string) => {
    console.log(a);
    console.log(s);
    console.log(t);
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

            <div className="mt-2 flex justify-center">
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

            <div className="mt-2 flex justify-center">
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

            <div className="mt-2 flex justify-center">
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
                    setAccountName("");
                    setSecret("");
                    setOtpType("totp");
                  }}
                >
                  閉じる
                </button>
                <button
                  className="btn btn-primary ml-2"
                  onClick={() => {
                    printValue(accountName, secret, otpType)
                    setAccountName("");
                    setSecret("");
                    setOtpType("totp");
                  }}
                >
                  追加
                </button>
              </form>
            </div>
          </div>
        </dialog>

        <div className="max-w-xs w-full bg-base-200 flex flex-col">
          {/* debug */}
          {/* <p>{code}</p> */}

          <Header />

          {/* main */}
          <div className="p-2 space-y-2 flex-grow h-96 overflow-y-scroll scrollbar-thin">
            <AccountView />
            <AccountView />
            <AccountView />
            <AccountView />
            <AccountView />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
