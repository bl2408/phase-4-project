import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ISODate } from "../appFns";


export default function VehicleHistoryForm({closeMe, setVehicleHistoryObj, items, categories}){

    const { vehicleId } = useParams()

    const form = useRef()

    useEffect(()=>{
        form.current.odometer.value = items.odometer || ""
        form.current.description.value = items.description || ""
        form.current.itemDate.value = ISODate(items.date) || ""
        form.current.category.value = items.category || ""
    },[]);

    const handleSubmit= async e=>{
        e.preventDefault();

        try{

            const cat = categories.find(c=>c.name === form.current.category.value);

            const response = await fetch(`/api/vehicles/${vehicleId}/history/${items.id}`,{
                method: "PATCH",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    category_id: cat.id,
                    date: form.current.itemDate.value,
                    description: form.current.description.value,
                    odometer: form.current.odometer.value
                })
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error("Server Error",{
                    cause: data.errors
                });
            }

            setVehicleHistoryObj(state=>state.map(h=>h.id===items.id ? { ...data.data} : h));
            handleClose();

        }catch(err){
            console.log(err.cause)
        }
    };

    const handleClose=()=>closeMe(state=>"");

    return (
        <div style={{ width:"100%", backgroundColor:"rgba(0,0,0,0.6)", padding: "10px", boxSizing:"border-box"}}>
            <form ref={form} onSubmit={handleSubmit} autoComplete="off">

                <label>
                    Category
                    <select name="category">

                        {
                            categories?.map(cat=><option key={cat.id} value={cat.name}>{cat.name}</option>)
                        }

                    </select>
                </label>

                <label>
                    Odometer
                    <input type="text" name="odometer"/>
                </label>

                <label>
                    Description
                    <textarea name="description">
                    </textarea>
                </label>

                <label>
                    Date
                    <input type="datetime-local" name="itemDate" />
                </label>

                <div className="section-buttons">
                    <input className='btn-hi' type="submit" value="Save" />
                    <button type="button" onClick={handleClose}>Cancel</button>
                </div>
            </form>
        </div>
    );

}