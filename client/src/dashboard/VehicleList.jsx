import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchVehiclesList } from "../reducers/vehiclesSlice";

import { DASH_PATH } from "../appconstants"

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

    const vehicleTemplate = ({id, make, model, odometer, type, year})=>{
        return (
            <div key={`vehicle-list-${id}`} onClick={()=>handleVehicleClick(id)}>
                {id} - {year} {make} {model} {odometer}
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