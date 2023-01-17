import './index.css'
export default function LoginForm(){

    const handleSubmit =e=>{
        e.preventDefault();
    };

    return (
        <>
            <div className="window shadow bg sh7">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input type="text" name="input_username" />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="input_username" />
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