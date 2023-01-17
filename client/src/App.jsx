import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "./reducers/themeSlice";
import LoginForm from "./login/LoginForm";
import Nav from "./nav/Nav";
import Temp from "./Temp";

function App() {

	const theme = useSelector((state) => state.theme.value)
	const dispatch = useDispatch();

	useEffect(()=>{

		const themeUserStore = localStorage.getItem('themePref');
		let useTheme = 'light';

		if(themeUserStore === null || themeUserStore === undefined){
			console.log(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				useTheme = 'dark';
			}else{
				useTheme = "light"
			}
		}else{
			useTheme = themeUserStore
		}

		dispatch(setTheme(useTheme));

	}, []);

	useEffect(()=>{
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('themePref', theme);
	},[theme])

	return (
		<>
			<Nav />
			<div className="App bodyItem" style={{justifyContent: "center"}}>
				<LoginForm />
			</div>
		</>
	)
}

export default App
