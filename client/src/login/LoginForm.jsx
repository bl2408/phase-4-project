import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLogin } from '../reducers/userSlice';

import './index.css'
export default function LoginForm() {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user);

    const [errors, setErrors] = useState([]);

    const handleSubmit = async e => {
        e.preventDefault();

        const form = e.target;
        const login_name = form.input_username.value;
        const password = form.input_password.value;

        if (login_name.length <= 0 || password.length <= 0) {
            return;
        }

        const formObj = { login_name, password }

        try {
            await dispatch(fetchLogin(formObj)).unwrap()
        } catch (err) {
            setErrors(state => err)
        }

    };

    return (
        <>
            <div className="window shadow bg sh7">
                <h1>Login</h1>
                {
                    !!errors
                        ? errors.map((error, i) => <div className='txt hi1' key={`err-${i}`}>{error}</div>)
                        : null
                }
                <form onSubmit={handleSubmit} autoComplete="off">
                    <label>
                        Username:
                        <input type="text" name="input_username" />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="input_password" />
                    </label>
                    <div className='section-buttons'>
                        <input className='btn-hi' type="submit" value="Login" />
                        <input type="reset" value="Clear" />
                    </div>
                </form>
            </div>
        </>
    );

}