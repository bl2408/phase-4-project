import "./index.css";
export default function Nav({setTheme, theme}){

    const toggleTheme =()=>{
		setTheme(state=> state==="light" ? "dark" : "light");
	};

    return(
        <nav className="bodyItem">
            <div>
                <button onClick={toggleTheme}><i className={`fa ${theme ==="light" ? "fa-moon-o" : "fa-sun-o"}`}></i></button>
            </div>
        </nav>
    );

}