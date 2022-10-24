import {Route, Routes} from "react-router-dom";
import App from "../projects/Project";
import Permissions from "../permissions/Permissions";
import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext";

export default function Settings() {
    const authCtx = useContext(AuthContext)

    return <>
        <Routes>
            <Route exact path="permissions" element={<Permissions
                cerberusUrl={"http://localhost:8080/api/"}
                cerberusToken={authCtx.cerberusToken}
                accountId={authCtx.user.accountId}
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