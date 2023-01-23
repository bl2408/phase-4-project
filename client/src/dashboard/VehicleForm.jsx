import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { DASH_PATH } from "../appconstants";
import "./index.css"

export default function VehicleForm(){

    const history = useHistory()
    const form = useRef();

    const handleSubmit = async e=>{

        e.preventDefault();

        try{

            const vehicleObj = {
                make: form.current.make.value,
                model: form.current.model.value,
                body: form.current.body.value,
                vehicle_type: form.current.type.value,
                year: form.current.year.value,
                odometer: form.current.odometer.value,
            }

            const response = await fetch("/api/vehicles",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(vehicleObj)
            });

            const data = await response.json();

            if(!response.ok){

                throw new Error("Server error",{
                    cause: data.errors
                })

            }

            if(data.success){
                history.push(DASH_PATH);
            }else{
                throw new Error("Server error") 
            }

        }catch(err){
            console.log(err)
            console.log(err.cause)
        }

    };

    return (
        <>
            <div className="window bg sh7 shadow">
                <header>
                    <h1>New</h1>
                </header>
                <form ref={form} onSubmit={handleSubmit}>

                    <label>
                        Type:
                        <input type="text" name="type" />
                    </label>

                    <label>
                        Make:
                        <input type="text" name="make" />
                    </label>

                    <label>
                        Model:
                        <input type="text" name="model" />
                    </label>

                    <label>
                        Year:
                        <input type="text" name="year" />
                    </label>

                    <label>
                        Body:
                        <input type="text" name="body" />
                    </label>

                    <label>
                        Odometer:
                        <input type="text" name="odometer" />
                    </label>
                    <div className="section-buttons">
                        <input className='btn-hi' type="submit" value="Create" />
                        <input type="reset" value="Clear" />
                    </div>
                </form>
            </div>
        </>
    );

}