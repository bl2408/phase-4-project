import { useEffect } from "react";
import { useState } from "react";
import LoginForm from "./login/LoginForm";
import Nav from "./nav/Nav";
import Temp from "./Temp";

function App() {

	const [ theme, setTheme ] = useState("light");

	useEffect(()=>{
		document.documentElement.dataset.theme = theme;
	},[theme])

	return (
		<>
			<Nav setTheme={setTheme} theme={theme}/>
			<div className="App bodyItem" style={{justifyContent: "center"}}>
				<LoginForm />
			</div>
		</>
	)
}

export default App
