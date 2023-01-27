import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ISODate } from "../appFns";

import { v4 as uuid } from "uuid";


export default function VehicleHistoryForm({setHistoryMeta, calculateHistoryMeta, mode, closeMe, setVehicleHistoryObj, items, categories, historyList, setVehicleObj, vehicleObj}){
    const { vehicleId } = useParams()

    const form = useRef()
    const [ categorySelect, setCategorySelect ] = useState("")

    useEffect(()=>{

        const firstCat = categories[0].name;

        if(mode === "add") {
            setCategorySelect(state=>firstCat)
            return;
        }else{
            setCategorySelect(state=>items.category || firstCat)
        }

        form.current.odometer.value = items.odometer || ""
        form.current.description.value = items.description || ""
        form.current.itemDate.value = ISODate(items.date) || ""
        

        form.current.tags.value = items.tags.map(tag=>tag.name).join(" ")


        if(items.category === "Other"){
            form.current.otherName.value = items.extras?.other?.name || ""
        }

    },[]);

    const handleSubmit= async e=>{
        e.preventDefault();

        try{

            const cat = categories.find(c=>c.name === categorySelect);
            let otherNameValue = ""

            

            const historySendData={
                category_id: cat.id,
                date: form.current.itemDate.value,
                description: form.current.description.value,
                odometer: form.current.odometer.value
            };

            if(form.current.tags.value.length > 0){
                historySendData.tags = form.current.tags.value.split(" ");
            }

            if(categorySelect==="Other"){

                otherNameValue = form.current.otherName.value;
                if(otherNameValue.length > 0){
                    otherNameValue = otherNameValue.toLowerCase();
                    otherNameValue = `${otherNameValue[0].toUpperCase()}${otherNameValue.slice(1)}`
                    
                    historySendData.extras = {
                        other: {
                            name: otherNameValue,
                        }
                    }
                }
            }

            const response = await fetch(`/api/vehicles/${vehicleId}/history/${mode==="edit" ? items.id : ""}`,{
                method: mode==="edit" ? "PATCH" : "POST",
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

            if (mode==="edit"){
                setVehicleHistoryObj(state=>state.map(h=>h.id===items.id ? { ...data.data} : h));
            }else{
                setVehicleHistoryObj(state=>[...state, data.data])
                setHistoryMeta(state=>{
                    state = {
                        ...state,
                        count: state.count + 1,
                        total: state.total + 1
                    }
    
                    return { ...state, ...calculateHistoryMeta(state) }
    
                });
            }

            const veObj = {}

            if(categorySelect==="Other"){
                if(!!vehicleObj?.history_types_list){
                    veObj.history_types_list =[...new Set([...vehicleObj.history_types_list, otherNameValue])] 
                }else{
                    veObj.history_types_list = [ otherNameValue ] 
                }
                // veObj.history_types_list = 
                //     vehicleObj?.history_types_list === null 
                //         ? [ otherNameValue ] 
                //         : [...new Set([...vehicleObj.history_types_list, otherNameValue])] 
            }

            const updatedTagsResponse = await fetch(`/api/vehicles/${vehicleId}/tags`);
            let updatedTags = {};
            if(updatedTagsResponse.ok){
                updatedTags = await updatedTagsResponse.json()
            }

            const updatedOdoResponse = await fetch(`/api/vehicles/${vehicleId}/odo`);
            let updatedOdo = {};
            if(updatedOdoResponse.ok){
                updatedOdo = await updatedOdoResponse.json()
            }
            
            setVehicleObj(state=>({...state, ...veObj, ...updatedOdo, tags_list: { ...updatedTags } }))
            

            handleClose();

        }catch(err){
            console.log(err)
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

                <label>
                    Tags (Seperated by spaces)
                    <input type="text" name="tags" />
                </label>

                <div className="section-buttons">
                    <input className='btn-hi' type="submit" value="Save" />
                    <button type="button" onClick={handleClose}>Cancel</button>
                </div>
            </form>
        </div>
    );

}