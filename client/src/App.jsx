import { useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "./reducers/themeSlice";

import Nav from "./nav/Nav";
import Temp from "./Temp";
import { Redirect, Route, Switch } from "react-router-dom";

const LoginForm = lazy(()=>import("./login/LoginForm"));

function App() {

	const theme = useSelector(state => state.theme.value);
	const user = useSelector(state=>state.user);
	const dispatch = useDispatch();

	// check if user has theme preferences, else check current theme of user then set theme
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

	// update theme changes and save user prefs
	useEffect(()=>{
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('themePref', theme);
	},[theme])

	console.log(user.loggedIn )

	return (
		<>
			<Nav />
			<div className="App bodyItem" style={{justifyContent: "center"}}>

				{ 
					user.loggedIn 
					? <Redirect to={"/dashboard"}/>
					: <Redirect to={"/login"}/>
				}

				
				<Switch>

					<Route exact path={"/dashboard"}>
						dashboard yo
					</Route>

					<Route exact path={"/login"}>
						<Suspense fallback={<div>Loading...</div>}>
							<LoginForm />
						</Suspense>
					</Route>

				</Switch>

				
			</div>
		</>
	)
}

export default App
