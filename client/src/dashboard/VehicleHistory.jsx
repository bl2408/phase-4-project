import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VehicleHistory(){

    const { vehicleId } = useParams();
    const [ vehicleObj, setVehicleObj ] = useState({});
    const [ vehicleHistoryObj, setVehicleHistoryObj ] = useState([]);
    const [ historyMeta, setHistoryMeta ] = useState();

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
                const {make, model, year, odometer, body, other, type } = responseData.data.attributes
                return {make, model, year, odometer, body, other, type }
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

        return()=>{};

    },[]);

    return (
        <div>
            <header>
                {vehicleObj.make} {vehicleObj.model} {vehicleObj.year} 
            </header>
            <div className="vehicle-history">
                {vehicleHistoryObj.map(history=>{
                    const { id } = history
                    const { category, date, description, odometer } = history.attributes
                    return <div key={`history-item-${id}`}>
                        {id}, {category}, {date}, {description}, {odometer}
                    </div>
                })}
            </div>
            <div>
                {console.log(historyMeta)}
                {
                    historyMeta?.nextLimit 
                    ? <button onClick={()=>handleMoreHistory(historyMeta)}>More</button>
                    : null
                }
                
                Showing {vehicleHistoryObj.length} out of {historyMeta?.total}
            </div>
        </div>
    );

}