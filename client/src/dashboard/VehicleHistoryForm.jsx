import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ISODate } from "../appFns";

import { v4 as uuid } from "uuid";


export default function VehicleHistoryForm({closeMe, setVehicleHistoryObj, items, categories, historyList, setVehicleObj}){
    const { vehicleId } = useParams()

    const form = useRef()
    const [ categorySelect, setCategorySelect ] = useState("")

    useEffect(()=>{
        form.current.odometer.value = items.odometer || ""
        form.current.description.value = items.description || ""
        form.current.itemDate.value = ISODate(items.date) || ""
        setCategorySelect(state=>items.category || "")

        if(items.category === "Other"){
            form.current.otherName.value = items.extras.other.name || ""
        }

    },[]);



    const handleSubmit= async e=>{
        e.preventDefault();

        try{

            const cat = categories.find(c=>c.name === categorySelect);

            const historySendData={
                category_id: cat.id,
                date: form.current.itemDate.value,
                description: form.current.description.value,
                odometer: form.current.odometer.value
            };

            if(categorySelect==="Other"){
                historySendData.extras = {
                    other: {
                        name: form.current.otherName.value,
                    }
                }
            }
            

            const response = await fetch(`/api/vehicles/${vehicleId}/history/${items.id}`,{
                method: "PATCH",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(historySendData)
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error("Server Error",{
                    cause: data.errors
                });
            }

            setVehicleHistoryObj(state=>state.map(h=>h.id===items.id ? { ...data.data} : h));
            if(categorySelect==="Other"){
                setVehicleObj(state=>({...state, history_types_list: [...new Set([... state.history_types_list, form.current.otherName.value])]}))
            }

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
                    <select name="category" onChange={e=>setCategorySelect(state=>e.target.value)} value={categorySelect}>

                        {
                            categories?.map(cat=><option key={cat.id} value={cat.name}>{cat.name}</option>)
                        }

                    </select>
                </label>

                <input list="otherNameList" type={categorySelect === "Other" ? "text" : "hidden"} name="otherName" placeholder="Category name"/>
                <datalist id="otherNameList">
                    {historyList?.map(item => <option key={uuid()} value={item}>{item}</option>)}
                </datalist>

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