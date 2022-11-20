
import {useContext, useEffect, useState} from "react";
import {Link, NavLink, Route, Routes, useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import StoryMenu from "./StoryMenu";
import {ProjectContext} from "../projects/ProjectContext";
import {SprintContext} from "../projects/sprints/SprintContext";
import {AccessGuard} from "cerberus-reactjs";

export default function SprintMenu() {
    const projectCtx = useContext(ProjectContext)
    const sprintCtx = useContext(SprintContext)

    if (!projectCtx.project || !sprintCtx.sprint) {
        return <></>
    }

    return <>
        <Routes>
            <Route path="stories/:id/*" element={<StoryMenu/>}/>
            <Route exact path="/*" element={<Menu project={projectCtx.project} sprint={sprintCtx.sprint}/>}/>
        </Routes>
    </>

}


function Menu(props) {
    const {project, sprint} = props

    return <>
        <div className="navmenu">
            <Link to={`/projects/${project.id}/sprints`}>
                <i className="mr-1">&#8592;</i>
                <i>{project.name} Sprints</i>
            </Link>
            <p>{sprint.number}</p>
            <ul>
                <AccessGuard resourceId={sprint.id} action="ReadSprintPermissions">
                    <li className="nav-item">
                        <NavLink end to={`permissions`}>Permissions</NavLink>
                    </li>
                </AccessGuard>

                <li className="nav-item">
                    <NavLink end to={`stories`}>Stories</NavLink>
                </li>
            </ul>
        </div>
    </>
}