import { lazy, Suspense } from "react";
import { Link, Route, Switch } from "react-router-dom";

import { DASH_PATH } from "../appconstants"

const VehicleList = lazy(()=>import("./VehicleList"))
const VehicleHistory = lazy(()=>import("./VehicleHistory"))

export default function Dashboard(){

    return (
        <main>
            {/* <nav>
                <Link to={`${DASH_PATH}/vehicles`}>Vehicles</Link>
                <Link to={`${DASH_PATH}/settings`}>Settings</Link>
            </nav> */}
            <Switch>
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

                <Route exact path={`${DASH_PATH}/che`}>
                    chee
                </Route>
            </Switch>
            
  
        </main>
    );

}