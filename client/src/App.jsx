import { useEffect } from "react";
import { useState } from "react";
import LoginForm from "./login/LoginForm";
import Temp from "./Temp";

function App() {

	const [ theme, setTheme ] = useState("light");

	const toggleTheme =()=>{
		setTheme(state=> state==="light" ? "dark" : "light");
	};

	useEffect(()=>{
		document.documentElement.dataset.theme = theme;
	},[theme])

	return (
		<div className="App" style={{justifyContent: "center"}}>
			<button onClick={toggleTheme}>+</button>
			<LoginForm />
		</div>
	)
}

export default App
