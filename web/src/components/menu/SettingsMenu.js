
import {Link} from "react-router-dom";

export default function SettingsMenu() {

    return <>
        <div className="navmenu">
            <ul>
                <li className="nav-item">
                    <Link to={`/settings/permissions`}>Account Permissions</Link>
                </li>
            </ul>

        </div>

    </>

}