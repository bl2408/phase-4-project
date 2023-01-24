import { lazy, Suspense } from "react";
import { Link, Route, Switch } from "react-router-dom";

import { DASH_PATH } from "../appconstants"


const VehicleList = lazy(()=>import("./VehicleList"))
const VehicleHistory = lazy(()=>import("./VehicleHistory"));
const VehicleForm = lazy(()=>import("./VehicleForm"));

export default function Dashboard(){

    return (
        <main>
            <Switch>
                <Route exact path={`${DASH_PATH}/vehicles/new`}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <VehicleForm />
                    </Suspense>
                </Route>
                <Route exact path={[`${DASH_PATH}/vehicles`, `${DASH_PATH}/`]}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <VehicleList />
                    </Suspense>
                </Route>

                <Route exact path={`${DASH_PATH}/vehicles/:vehicleId`}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <VehicleHistory />
                    </Suspense>
                </Route>

                <Route exact path={`${DASH_PATH}/vehicles/:vehicleId/edit`}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <VehicleForm />
                    </Suspense>
                </Route>

            </Switch>
            
  
        </main>
    );

}