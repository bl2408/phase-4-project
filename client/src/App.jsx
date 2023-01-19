import { useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setTheme } from "./reducers/themeSlice";
import { fetchCheck } from "./reducers/userSlice";

import Nav from "./nav/Nav";

import { Redirect, Route, Switch, useHistory } from "react-router-dom";

const LoginForm = lazy(() => import("./login/LoginForm"));
const Dashboard = lazy(() => import("./dashboard/Dashboard"));

function App() {

	const theme = useSelector(state => state.theme.value);
	const user = useSelector(state => state.user);
	const dispatch = useDispatch();

	const history = useHistory();

	const checkLogin = async () => {
		try {
			await dispatch(fetchCheck()).unwrap()
		} catch (err) {
			if (!user.loggedIn) {
				history.push("/login");
			}
		}
	}

	// check if user has theme preferences, else check current theme of user then set theme
	//if url path is anything but login, perform a login check using the session id provided by api
	useEffect(() => {

		const themeUserStore = localStorage.getItem('themePref');
		let useTheme = 'light';

		if (themeUserStore === null || themeUserStore === undefined) {
			console.log(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				useTheme = 'dark';
			} else {
				useTheme = "light"
			}
		} else {
			useTheme = themeUserStore
		}

		dispatch(setTheme(useTheme));

		checkLogin();
		
		return()=>{};

	}, []);


	// update theme changes and save user prefs
	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('themePref', theme);
		return()=>{};
	}, [theme])

	return (
		<>
			<Nav />
			<div className="App bodyItem" style={user.loggedIn ? {} : { justifyContent: "center" }}>

				<Switch>

					<Route path={["/dashboard"]}>
						<Suspense fallback={<div>Loading...</div>}>
							<Dashboard />
						</Suspense>
					</Route>

					<Route exact path={"/login"}>
						{ user.loggedIn ? <Redirect to="/dashboard" /> : null}
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
