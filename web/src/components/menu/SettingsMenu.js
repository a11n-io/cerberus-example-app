
import {Link} from "react-router-dom";
import {AccessGuard, Permissions} from "cerberus-reactjs";
import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext";

export default function SettingsMenu() {
    const authCtx = useContext(AuthContext)

    return <>
        <div className="navmenu">
            <ul>
                <AccessGuard resourceId={authCtx.user.accountId} action="ManageAccountPermissions">
                    <li className="nav-item">
                        <Link to={`/settings/permissions`}>Account Permissions</Link>
                    </li>
                </AccessGuard>
            </ul>
        </div>

    </>

}