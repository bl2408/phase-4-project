import './index.css'
export default function LoginForm(){

    const handleSubmit =e=>{
        e.preventDefault();
    };

    return (
        <>
            <div className="window shadow bg sh7">
                <h1>Login</h1>
                <h2>Login</h2>
                <div>Some random text</div>
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input type="text" name="input_username" />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="input_username" />
                    </label>
                    <div>
                        <input className='btn-hi' type="submit" value="Login" />
                        <input type="reset" value="Clear" />
                    </div>
                </form>
            </div>
        </>
    );

}