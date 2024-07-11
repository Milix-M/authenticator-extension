import { setThemeToDaisyui } from "./theme";

function App() {
  setThemeToDaisyui(localStorage.getItem("selectedTheme"));

  return (
    <>
      <div id="app" className="w-full flex justify-center">
        <h1>popup</h1>
      </div>
    </>
  );
}

export default App;
