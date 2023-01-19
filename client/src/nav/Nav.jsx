import "./index.css";
import { toggleTheme } from "../reducers/themeSlice";
import { useSelector, useDispatch } from 'react-redux'
import { fetchLogout } from "../reducers/userSlice";
import { useHistory } from "react-router-dom";

export default function Nav(){

    const theme = useSelector((state) => state.theme.value)
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = async ()=>{
        try {
            await dispatch(fetchLogout());
            history.push("/login")
        } catch (err) {
        }
    };

    return(
        <nav className="bodyItem navMain">
            <div>
                { 
                    user.loggedIn 
                    ? <button onClick={handleLogout}>Logout</button>
                    : null
                }
                <button onClick={()=>dispatch(toggleTheme())}><i className={`fa ${theme ==="light" ? "fa-moon-o" : "fa-sun-o"}`}></i></button>
            </div>
        </nav>
    );

}