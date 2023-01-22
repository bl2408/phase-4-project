import { lazy, Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { displayDate } from "../appFns";
import { v4 as uuid } from 'uuid';

import "./index.css"

import { CATEGORIES } from "../appconstants";
import { fetchCategoriesList } from "../reducers/categorySlice";
import { useDispatch, useSelector } from "react-redux";

const VehicleHistoryForm =  lazy(()=>import("./VehicleHistoryForm"));

export default function VehicleHistory(){

    const { vehicleId } = useParams();
    const [ vehicleObj, setVehicleObj ] = useState({});
    const [ vehicleHistoryObj, setVehicleHistoryObj ] = useState([]);
    const [ historyMeta, setHistoryMeta ] = useState();

    const categories = useSelector(state=>state.categories.items);
    const dispatch = useDispatch();
    
    const [ formSelect, setFormSelect ] = useState("");
    const getVehicleById = async()=>{
        try{
            const response = await fetch(`/api/vehicles/${vehicleId}`);

            const responseData = await response.json();

            if(!response.ok){
                throw new Error("Server error", {
                    cause: responseData.errors
                });
            }

            setVehicleObj(state=>{
                const {make, model, year, odometer, body, other, type, history_types_list } = responseData.data.attributes
                return {make, model, year, odometer, body, other, type, history_types_list }
            });

            const historyData = responseData.data.attributes.history;

            setVehicleHistoryObj(state=>historyData.data);

            setHistoryMeta(state=>({
                ...historyData.meta,
                ...calculateHistoryMeta(historyData.meta)
            }))
            
        }catch(err){

        }
    };

    const getCategories = async()=>{

        try{
            dispatch(fetchCategoriesList()).unwrap()
        }catch(err){
            console.log(err)
        }

    };

    const calculateHistoryMeta =({offset, count, total, limit})=>{

        const nextOffset = offset + count
        const nextLimit = (total - nextOffset) > limit ? limit : (total - nextOffset);

        if(nextLimit <= 0){ return {} }

        return {
            nextOffset,
            nextLimit
        }
    };

    const handleMoreHistory =async({nextOffset:offset, nextLimit:limit, order})=>{

        const queryParams = new URLSearchParams({
            offset, limit, order
        });

        try{
            const response = await fetch(`/api/vehicles/${vehicleId}/history${queryParams ? `?${queryParams.toString()}` : ""}`);

            const responseData = await response.json();

            if(!response.ok){
                throw new Error("Server error", {
                    cause: responseData.errors
                });
            }


            setVehicleHistoryObj(state=>[...state, ...responseData.data]);

            setHistoryMeta(state=>({
                ...responseData.meta,
                ...calculateHistoryMeta(responseData.meta)
            }))
        }catch(err){

        }

    };

    useEffect(()=>{

        getVehicleById();
        getCategories();

        return()=>{};

    },[]);

    const handleHistoryItemOpen =(e, elId)=>{
        e.stopPropagation()
        const el = document.querySelector(`#${elId}`);
        el.classList.toggle("open");
        let description = el.children[el.children.length-1]
        description.style.maxHeight = !!description.style.maxHeight ? null : '1000px' ;

        if(formSelect === elId){
            setFormSelect(state=>"");
        }
    };

    const handleOpenCloseForm = (id)=>{
        setFormSelect(state=>state === id ? "" : id);
    };

    const vehicleHistoryItemTemplate = (history)=>{
        const { id } = history
        const { category, date, description, odometer, updated_at, extras } = history.attributes
        const elementId = `vhi-${id}`
        return (
            <div id={elementId} key={elementId} className="vehicle-history-box" style={formSelect ===  elementId ? {maxHeight: "1000px"}  : null}>
                <div onClick={(e)=>handleHistoryItemOpen(e, elementId)} className="vehicle-item vehicle-history-item">
                    <div className="icon"><i className={CATEGORIES[category].icon}></i></div>
                    <div>{displayDate(date)}</div>
                    <div>
                        {
                            category === "Other" && !!extras
                            ? extras?.other?.name 
                            : category
                        }
                    </div>
                    <div>{odometer}</div>
                </div>
                <div>
                    <div>
                        {description}   
                        {
                            formSelect ===  elementId 
                            ?<Suspense fallback={<div>Loading...</div>}>
                                <VehicleHistoryForm
                                    mode="edit"
                                    closeMe={setFormSelect} 
                                    setVehicleHistoryObj={setVehicleHistoryObj} 
                                    items={{id, category, date, description, odometer, extras}} 
                                    categories={categories}
                                    historyList={vehicleObj.history_types_list}
                                    setVehicleObj={setVehicleObj}
                                />
                            </Suspense>
                            : null
                        }                     
                    </div>
                    
                    <div className="vehicle-history-nav">
                        <div>Last updated: {displayDate(updated_at)}</div>
                        <div>
                            <button><i className="fa fa-edit" onClick={()=>handleOpenCloseForm(elementId)}></i></button>
                            <button className="btnDelete"><i className="fa fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="window bg sh7 shadow">
            <header>
                <h1>{vehicleObj.year} {vehicleObj.make} {vehicleObj.model} </h1>
                <h2></h2>
                <div className="section-buttons">
                    <button onClick={(e)=>handleOpenCloseForm("add-form")} className="btn-hi"><i className="fa fa-plus "></i></button>
                </div>
            </header>
            <div id="add-form">
                {
                    formSelect ===  "add-form"
                    ? <Suspense fallback={<div>Loading...</div>}>
                        <VehicleHistoryForm 
                            mode="add"
                            closeMe={setFormSelect} 
                            setVehicleHistoryObj={setVehicleHistoryObj} 
                            categories={categories}
                            historyList={vehicleObj.history_types_list}
                            setVehicleObj={setVehicleObj}
                        />
                    </Suspense>
                    : null
                }
                
            </div>
            <div>
                {vehicleHistoryObj.map(history=>vehicleHistoryItemTemplate(history))}
            </div>
            <div>
                <div style={{textAlign:"center", marginBottom:"10px"}}>
                    Showing {vehicleHistoryObj.length} out of {historyMeta?.total}
                </div>

                {
                    historyMeta?.nextLimit 
                    ? <div style={{textAlign:"center"}}>
                        <button onClick={()=>handleMoreHistory(historyMeta)}>More</button>
                    </div>
                    : null
                }
                
                
            </div>
        </div>
    );

}