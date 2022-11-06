
import {useContext} from "react";
import {Link, NavLink, Route, Routes} from "react-router-dom";
import SprintMenu from "./SprintMenu";
import {SprintProvider} from "../projects/sprints/SprintContext";
import {ProjectContext} from "../projects/ProjectContext";

export default function ProjectMenu() {
    const projectCtx = useContext(ProjectContext)

    if (!projectCtx.project) {
        return <></>
    }

    return <>
        <Routes>
            <Route path="sprints/:id/*" element={<SprintMenu/>}/>
            <Route exact path="/*" element={<Menu project={projectCtx.project}/>}/>
        </Routes>
    </>

}

function Menu(props) {
    const {project} = props

    return (
        <div className="navmenu">
            <Link to={`/projects`}>Projects</Link>
            <p>{project.name}</p>
            <ul>
                <li className="nav-item">
                    <NavLink end to={`/projects/${project.id}/permissions`}>Permissions</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink end to={`/projects/${project.id}/sprints`}>Sprints</NavLink>
                </li>
            </ul>
        </div>
    )
}