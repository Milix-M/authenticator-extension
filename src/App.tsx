import Header from "./component/header/Header";
import AccountView from "./component/accountview/AccountView";

function App() {
  return (
    <>
      <div id="app" className="w-full flex justify-center">
        <div className="max-w-xs w-full bg-base-200 flex flex-col">
          {/* debug */}
          {/* <p>{code}</p> */}

          <Header />

          {/* main */}
          <div className="p-2 space-y-2 flex-grow h-96 overflow-y-scroll scrollbar-thin">
            <AccountView />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
