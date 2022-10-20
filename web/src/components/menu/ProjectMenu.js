
import {useEffect, useState} from "react";
import {Link, NavLink, Route, Routes, useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import SprintMenu from "./SprintMenu";

export default function ProjectMenu() {
    const [project, setProject] = useState()
    const params = useParams()
    const {get, loading} = useFetch("/api/")

    useEffect(() => {
        if (params.id) {
            get("projects/" + params.id)
                .then(d => setProject(d))
                .catch(e => console.log(e))
        }
    }, [])

    if (loading) {
        return <Loader/>
    }

    if (!project) {
        return <></>
    }

    return <>
        <Routes>
            <Route path="sprints/:id/*" element={<SprintMenu project={project}/>}/>
            <Route exact path="/*" element={<Menu project={project}/>}/>
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
                    <NavLink end to={`/apps/${project.id}/resourcetypes`}>Sprints</NavLink>
                </li>
            </ul>
        </div>
    )
}