import {Route, Routes} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext";
import {Permissions} from "cerberus-reactjs";
import {ProjectContext} from "../projects/ProjectContext";

export default function Settings() {
    const authCtx = useContext(AuthContext)

    return <>
        <Routes>
            <Route exact path="permissions" element={<Permissions
                cerberusUrl={"http://localhost:8000/api/"}
                cerberusToken={authCtx.user.cerberusToken}
                resourceId={authCtx.user.accountId}
            />}/>
            <Route exact path="/" element={<SettingsDashboard/>}/>
        </Routes>
    </>
}

function SettingsDashboard() {

    return <>
        Settings
    </>
}