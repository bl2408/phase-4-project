import './index.css'
export default function LoginForm(){

    const handleSubmit = async e=>{
        e.preventDefault();

        const form = e.target;
        const login_name = form.input_username.value;
        const password = form.input_password.value;

        if(login_name.length <= 0 || password.length <= 0){
            return;
        }

        const request = await fetch("/api/login",{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                login_name,
                password
            })
        });

        const response = await request.then(res=>res.ok).then(data=>data.json())
        console.log(response);
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