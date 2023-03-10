import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchVehiclesList, deleteVehicleById } from "../reducers/vehiclesSlice";

import { DASH_PATH } from "../appconstants"

import { v4 as uuid } from 'uuid';

import './index.css'
import { formatOdometer } from "../appFns";

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

        if(!window.confirm(`Deleting vehicle:\n"${vehicleTitle}."\nAre you sure?`)){ return; }

        try{
            dispatch(deleteVehicleById(id)).unwrap()
        }catch(err){
            console.log(err)
            console.log(err.cause)
        }

    };

    const handleEdit=(e, id)=>{
        e.stopPropagation();

        history.push(`${DASH_PATH}/vehicles/${id}/edit`)
    };


    const vehicleTemplate = ({id, make, model, vehicle_type, year, calculated_odometer})=>{
        return (
            <div className="bg sh7 shadow vehicle-item vehicle-list-item" key={uuid()} onClick={()=>handleVehicleClick(id)}>
                <div>{vehicle_type}</div>
                <div>{year} {make} {model}</div>
                <div>{formatOdometer(calculated_odometer)}</div>
                <div></div>
                <div className="vehicle-list-buttons">
                    <a onClick={e=>handleEdit(e,id)}><i className="fa fa-edit"></i></a>
                    <a href="#/" onClick={e=>handleDelete(e, id, `${year} ${make} ${model}`)}><i className="fa fa-trash"></i></a>
                </div>
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