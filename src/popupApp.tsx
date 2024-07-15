import AccountView from "./component/accountview/AccountView";
import { useEffect, useState } from "react";
import { StorageProvider } from "./storage";
import { Account } from "./models/account";
import { setThemeToDaisyui } from "./theme";

function App() {
  // ウィンドウへのフォーカス外れたら
  // window.addEventListener("blur", () => window.close());

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
              <AccountView account={account} setAccounts={setAccounts} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
