import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchVehiclesList, deleteVehicleById } from "../reducers/vehiclesSlice";

import { DASH_PATH } from "../appconstants"

import { v4 as uuid } from 'uuid';

import './index.css'

export default function VehicleList(){

    const vehicles = useSelector(state=>state.vehicles);
    const dispatch = useDispatch();

    const history = useHistory();

    const handleVehicleFetch= async ()=>{
        try{
            dispatch(fetchVehiclesList()).unwrap()
        }catch(err){
            console.log(err)
        }
    };

    useEffect(()=>{
        
        handleVehicleFetch();

        return()=>{};

    },[]);

    const handleVehicleClick= id =>{
        history.push(`${DASH_PATH}/vehicles/${id}`);
    };

    const handleDelete = async (e, id, vehicleTitle)=>{
        e.stopPropagation();
        console.log(id)

        if(!window.confirm(`Deleting vehicle:\n"${vehicleTitle}."\nAre you sure?`)){ return; }

        try{
            dispatch(deleteVehicleById(id)).unwrap()
        }catch(err){
            console.log(err)
            console.log(err.cause)
        }

    };


    const vehicleTemplate = ({id, make, model, odometer, type, year})=>{
        return (
            <div className="bg sh7 shadow vehicle-item vehicle-list-item" key={uuid()} onClick={()=>handleVehicleClick(id)}>
                
                <div>{year}</div>
                <div>{make} {model}</div>
                <div>
                    <a href="#/" onClick={(e)=>handleDelete(e, id, `${year} ${make} ${model}`)}><i className="fa fa-trash"></i></a>
                </div>
                

                {/* {id} -   {odometer} */}
            </div>
        )
    };

    return (
        <>
            {
                vehicles.items.map(vehicle=>vehicleTemplate({id:vehicle.id, ...vehicle.attributes}))
            }
        </>
    );

}