import { useEffect } from "react";
import { useState } from "react";

function App() {

  const [ theme, setTheme ] = useState("light");

  const toggleTheme =()=>{
    setTheme(state=> state==="light" ? "dark" : "light");
  };

  useEffect(()=>{
    document.documentElement.dataset.theme = theme;
  },[theme])

  return (
    <div className="App">
      <div className="window1">
        <div className="w1 bg hi1">text is here <button>+</button></div>
        <div className="w1 bg hi2">text is here <button>+</button></div>
        <div className="w1 bg hi3">text is here <button>+</button></div>
        <h1>text is here</h1>
        <h2>text is here</h2>
        text is here

        <h1 className="txt hi1">text is here</h1>
        <h2 className="txt hi2">text is here</h2>
        <span className="txt hi3">text is here</span>
        <br />
        <input type="text" name="" id="" />
        <button>OK</button>
      </div>
      <button onClick={toggleTheme}>TEST</button>
    </div>
  )
}

export default App
