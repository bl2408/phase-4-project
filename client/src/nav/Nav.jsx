import "./index.css";
import { toggleTheme } from "../reducers/themeSlice";
import { useSelector, useDispatch } from 'react-redux'
import { fetchLogout } from "../reducers/userSlice";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { DASH_PATH } from "../appconstants";
import { useState } from "react";

export default function Nav(){

    const theme = useSelector((state) => state.theme.value)
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const history = useHistory();

    const [ showDashButtons, setShowDashButtons ] = useState(false);

    const handleLogout = async ()=>{
        try {
            await dispatch(fetchLogout());
            history.push("/login")
        } catch (err) {
        }
    };

    useEffect(()=>{

        setShowDashButtons(state=>location.pathname === DASH_PATH || location.pathname === `${DASH_PATH}/`)

        return ()=>{};

    }, []);

    useEffect(()=>{

        history.listen((location) => {
            setShowDashButtons(state=>location.pathname === DASH_PATH || location.pathname === `${DASH_PATH}/`)
        })

        return ()=>{};

    },[history]);
    
    return(
        <nav className="bodyItem navMain">
            <div>
                {
                    showDashButtons 
                    ? <>
                        <button onClick={()=>history.push(`${DASH_PATH}/vehicles/new`)} className="btn-hi"><i className="fa fa-plus "></i></button>
                    </> 
                    : null
                }
                
                <button onClick={()=>history.push(DASH_PATH)}>DASHBOARD</button>
                { 
                    user.loggedIn 
                    ? <button onClick={handleLogout}><i className="fa fa-sign-out"></i></button>
                    : null
                }
                <button onClick={()=>dispatch(toggleTheme())}><i className={`fa ${theme ==="light" ? "fa-moon-o" : "fa-sun-o"}`}></i></button>
            
            </div>
        </nav>
    );

}