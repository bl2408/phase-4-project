import { lazy, Suspense, useEffect, useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { displayDate, formatOdometer } from "../appFns";
import { v4 as uuid } from 'uuid';

import "./index.css"

import { CATEGORIES } from "../appconstants";
import { fetchCategoriesList } from "../reducers/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import Tag from "./Tag";

const VehicleHistoryForm =  lazy(()=>import("./VehicleHistoryForm"));

export default function VehicleHistory(){

    const { vehicleId } = useParams();
    const [ vehicleObj, setVehicleObj ] = useState({});
    const [ vehicleHistoryObj, setVehicleHistoryObj ] = useState([]);
    const [ historyMeta, setHistoryMeta ] = useState();

    const categories = useSelector(state=>state.categories.items);
    const dispatch = useDispatch();
    
    const [ formSelect, setFormSelect ] = useState("");
    const sortDateSelect = useRef()

    const history = useHistory();

    const getVehicleById = async()=>{
        try{

            const response = await fetch(`/api/vehicles/${vehicleId}`);

            const responseData = await response.json();

            if(response.status === 404){
                history.push("/404")
            }   

            if(!response.ok){
                throw new Error("Server error", {
                    cause: responseData.errors
                });
            }

            setVehicleObj(state=>{
                const {make, model, year, odometer, body, other, vehicle_type, history_types_list, tags_list, calculated_odometer } = responseData.data.attributes
                return {make, model, year, odometer, body, other, vehicle_type, history_types_list, tags_list, calculated_odometer }
            });

            const historyData = responseData.data.attributes.history;

            setVehicleHistoryObj(state=>historyData.data);

            updateHistoryMeta(historyData)
            
        }catch(err){

            console.log(err)

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
        try{
            const responseData = await fetchHistoryWithParams({offset, limit, order})
            setVehicleHistoryObj(state=>[...state, ...responseData.data]);
            updateHistoryMeta(responseData)
        }catch(err){
            console.log(err)
            console.log(err.cause)
        }

    };

    const handleHistoryOrderChange =async()=>{

        const order = sortDateSelect.current.value

        try{
            const responseData = await fetchHistoryWithParams({order})

            setVehicleHistoryObj(state=>[...responseData.data]);

            updateHistoryMeta(responseData)
        }catch(err){
            console.log(err)
            console.log(err.cause)
        }

    };

    const updateHistoryMeta=({meta})=>{
        setHistoryMeta(state=>({
            ...meta,
            ...calculateHistoryMeta(meta)
        }))
    };

    const fetchHistoryWithParams = async ({offset, limit, order, tag=null})=>{

        const queryObj = {
            offset: offset ? offset : 0,
            limit: limit ? limit : 10,
            order: order ? order : "DESC",
        }

        if(tag){
            queryObj.tag = tag
        }else{
            if(historyMeta.tag){
                queryObj.tag = historyMeta.tag
            }
        }

        const queryParams = new URLSearchParams(queryObj);

        const response = await fetch(`/api/vehicles/${vehicleId}/history${queryParams ? `?${queryParams.toString()}` : ""}`);

        const responseData = await response.json();

        if(!response.ok){
            throw new Error("Server error", {
                cause: responseData.errors
            });
        }

        return responseData

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

            setVehicleObj(state=>({...state, ...updatedOdo, tags_list: { ...updatedTags } }))

        }catch(err){
            console.log(err)
            console.log(err.cause)
        }
    }

    const vehicleHistoryItemTemplate = (history)=>{
        const { id } = history
        const { category, date, description, odometer, updated_at, extras, tags } = history.attributes
        const elementId = `vhi-${id}`
        return (
            <div id={elementId} key={elementId} className="vehicle-history-box" style={formSelect ===  elementId ? {maxHeight: "1000px"}  : null}>
                <div onClick={(e)=>handleHistoryItemOpen(e, elementId)} className="vehicle-item vehicle-history-item">
                    <div className="icon"><i className={CATEGORIES[category].icon}></i></div>
                    <div>
                        {
                            category === "Other" && !!extras
                            ? extras?.other?.name 
                            : category
                        }
                    </div>
                    <div>{displayDate(date)}</div>
                    <div>{formatOdometer(odometer)}</div>
                </div>
                <div>
                    <div>
                        {description}

                        {
                            tags.length > 0 
                            ? <div className="tags-view">
                                {tags.map(tag=>(
                                    <Tag onClick={()=>handleTagClick(tag.name)} key={`tag-${uuid()}`} name={tag.name}/>
                                    
                                ))}
                            </div>
                            : null
                        }

                        {
                            formSelect ===  elementId 
                            ?<Suspense fallback={<div>Loading...</div>}>
                                <VehicleHistoryForm
                                    mode="edit"
                                    closeMe={setFormSelect} 
                                    setVehicleHistoryObj={setVehicleHistoryObj}
                                    items={{id, category, date, description, odometer, extras, tags}} 
                                    categories={categories}
                                    historyList={vehicleObj.history_types_list}
                                    setVehicleObj={setVehicleObj}
                                    vehicleObj={vehicleObj}
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

    const displayTagsList = ()=>{
        if (!vehicleObj.tags_list || JSON.stringify(vehicleObj.tags_list) === '{}'){ return null;}

        const tags = [];


        for(const [tag, count] of Object.entries(vehicleObj.tags_list)){
            tags.push(<Tag onClick={()=>handleTagClick(tag)} key={`tag-${uuid()}`} name={`${tag} (${count})`}/>)
        }

        return tags
 
    };

    const handleTagClick = async (tag)=>{

        try{
            const responseData = await fetchHistoryWithParams({tag: tag})
            setVehicleHistoryObj(state=>[...responseData.data]);
            updateHistoryMeta(responseData)

        }catch(err){
            console.log(err)
            console.log(err.cause)
        }

    }

    const handleResetHistory = ()=>{

        getVehicleById();
        sortDateSelect.current.value = "DESC"

    };

    return (
        <div className="window bg sh7 shadow">
            <header>
                <h1>{vehicleObj.year} {vehicleObj.make} {vehicleObj.model} </h1>
                <h2>{vehicleObj?.body ? `${vehicleObj.body} ` : ""} </h2>
                <h2>Odometer:</h2>
                <span style={{fontWeight:"bold"}}>{formatOdometer(vehicleObj?.odometer)}</span> (start)&nbsp;|&nbsp; 
                <span style={{fontWeight:"bold"}}>{formatOdometer(vehicleObj?.calculated_odometer)}</span> (calculated)
                <div className="tags-view">
                    {
                        displayTagsList()
                    }
                </div>
                <div className="section-buttons">
                    <div>
                        Date: &ensp;
                        <select ref={sortDateSelect} onChange={e=>handleHistoryOrderChange(e)}>
                            <option value="DESC">Descending</option>
                            <option value="ASC">Ascending</option>
                        </select>
                    </div>
                    <button onClick={(e)=>handleOpenCloseForm("add-form")} className="btn-hi"><i className="fa fa-plus "></i></button>
                    <button onClick={handleResetHistory}>Reset</button>
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