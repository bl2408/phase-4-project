import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchLogin } from '../reducers/userSlice';

export default function LoginForm() {

    const dispatch = useDispatch()
    const history = useHistory()

    const [errors, setErrors] = useState([]);

    const handleSubmit = async e => {
        e.preventDefault();

        const form = e.target;
        const login_name = form.input_username.value;
        const password = form.input_password.value;

        const errors = [];
        if (login_name.length <= 0 || password.length <= 0) {
            errors.push("Username must be filled in.");  
        }

        if (password.length <= 0) {
            errors.push("Password must be filled in.");  
        }

        if(errors.length > 0){
            setErrors(state=>errors);
            return;
        }

        const formObj = { login_name, password }

        try {
            await dispatch(fetchLogin(formObj)).unwrap()
            history.push("/dashboard");
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