import AccountView from "./component/accountview/AccountView";
import { useEffect, useState } from "react";
import { StorageProvider } from "./storage";
import { Account } from "./models/account";
import { setThemeToDaisyui } from "./theme";

function App() {
  // ウィンドウへのフォーカス外れたら
  window.addEventListener("blur", () => window.close());

  setThemeToDaisyui(localStorage.getItem("selectedTheme"));
  const storageProvider = new StorageProvider();

  // アカウント取ってくる
  const [accounts, setAccounts] = useState<Account[]>();
  useEffect(() => {
    const getAccounts = async () => {
      const res = await storageProvider.getSecrets();
      setAccounts(res);
    };

    getAccounts();
  }, []);

  return (
    <>
      <div id="app" className="w-full flex justify-center">
        <div className="w-full bg-base-200 flex flex-col">
          <div className="py-3 px-4 w-full flex justify-center items-center bg-base-100 border-b">
            <p className="text-sm font-bold">
              クリックして二段階認証コードを挿入...
            </p>
          </div>

          {/* main */}
          <div className="p-2 space-y-2">
            {accounts?.map((account) => (
              <div
                onClick={() => insertTwoFaCode(account)}
                className="hover:cursor-pointer"
              >
                <AccountView
                  account={account}
                  setAccounts={setAccounts}
                  isPopupMode={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function insertTwoFaCode(account: Account) {
  const params = new URLSearchParams(window.location.search);
  // backgroundでアクティブだったinput要素を特定するために付与したクラス名をURLクエリから取得
  const uuid = params.get("uuid");
  // 対象のtabを特定するidをURLクエリから取得
  const tabid = params.get("tabid");

  if (tabid !== undefined) {
    chrome.scripting
      .executeScript({
        target: { tabId: Number(tabid) },

        // 先程取得したクラス名でinput要素を特定して二段階認証コードを挿入する
        func: (uuid, twoFaCode) => {
          const input = document.getElementsByClassName(
            uuid as string
          )[0] as HTMLInputElement;
          input.value = twoFaCode as string;
        },
        args: [uuid, account.genTwoFaCode()],
      })
      // 成功したらウィンドウ閉じる
      .then(() => {
        // アカウントタイプがHOTPだったらちゃんと保存してあげる
        if (account.type === "hotp") {
          const storageProvider = new StorageProvider();
          storageProvider.setSecret(account).then(() => {
            window.close();
          });
        } else {
          window.close();
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
}

export default App;
