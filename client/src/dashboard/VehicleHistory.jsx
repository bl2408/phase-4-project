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
                const {make, model, year, odometer, body, other, vehicle_type, history_types_list } = responseData.data.attributes
                return {make, model, year, odometer, body, other, vehicle_type, history_types_list }
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
            console.log(err)
            console.log(err.cause)
        }

    };

    const handleHistoryOrderChange =async(order)=>{

        const queryParams = new URLSearchParams({
            offset:0,
            limit: 10,
            order,
        });

        try{
            const response = await fetch(`/api/vehicles/${vehicleId}/history${queryParams ? `?${queryParams.toString()}` : ""}`);

            const responseData = await response.json();

            if(!response.ok){
                throw new Error("Server error", {
                    cause: responseData.errors
                });
            }


            setVehicleHistoryObj(state=>[...responseData.data]);

            setHistoryMeta(state=>({
                ...responseData.meta,
                ...calculateHistoryMeta(responseData.meta)
            }))
        }catch(err){
            console.log(err)
            console.log(err.cause)
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

    const handleDeleteHistory = async (id, description)=>{

        const newTitle = description.length > 50 ? `${description.substring(0, 50)}...` : description

        if(!window.confirm(`Deleting history:\n"${newTitle}."\nAre you sure?`)){ return; }

        try{
            const response = await fetch(`/api/vehicles/${vehicleId}/history/${id}`,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            if(!response.ok){
                const responseData = await response.json();
                throw new Error("Server error", {
                    cause: responseData.errors
                });
            }

            setVehicleHistoryObj(state=>state.filter(h=>h.id !== id));

            setHistoryMeta(state=>{
                state = {
                    ...state,
                    count: state.count - 1,
                    total: state.total - 1
                }

                return { ...state, ...calculateHistoryMeta(state) }

            })

        }catch(err){
            console.log(err)
            console.log(err.cause)
        }
    }

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
                            <button className="btnDelete" onClick={()=>handleDeleteHistory(id, description)}><i className="fa fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    const sortList =()=>{

        if(!historyMeta || !vehicleHistoryObj){ return [];}

        const { order } = historyMeta

        return vehicleHistoryObj.sort((a,b)=>{

            const newA = new Date(a.attributes.date).getTime();
            const newB = new Date(b.attributes.date).getTime();

            if(order.toUpperCase() === "DESC"){
                return newB - newA
            }

            return newA - newB

        });

    };

    return (
        <div className="window bg sh7 shadow">
            <header>
                <h1>{vehicleObj.year} {vehicleObj.make} {vehicleObj.model} </h1>
                <h2></h2>
                <div className="section-buttons">
                    <div>
                        Date: &ensp;
                        <select onChange={e=>handleHistoryOrderChange(e.target.value)}>
                            <option value="DESC">Descending</option>
                            <option value="ASC">Ascending</option>
                        </select>
                    </div>
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
                            setHistoryMeta={setHistoryMeta}
                            calculateHistoryMeta={calculateHistoryMeta}
                        />
                    </Suspense>
                    : null
                }
                
            </div>

            <div>
                {
                    sortList().map(history=>vehicleHistoryItemTemplate(history))
                }
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