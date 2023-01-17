import "./index.css";
import { toggleTheme } from "../reducers/themeSlice";
import { useSelector, useDispatch } from 'react-redux'

export default function Nav(){

    const theme = useSelector((state) => state.theme.value)
    const dispatch = useDispatch()

    return(
        <nav className="bodyItem">
            <div>
                <button onClick={()=>dispatch(toggleTheme())}><i className={`fa ${theme ==="light" ? "fa-moon-o" : "fa-sun-o"}`}></i></button>
            </div>
        </nav>
    );

}