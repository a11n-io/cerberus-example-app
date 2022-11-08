import {Route, Routes, useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import Sprints from "./sprints/Sprints";
import {ProjectContext} from "./ProjectContext";
import {Permissions} from "cerberus-reactjs";
import {AuthContext} from "../../context/AuthContext";

export default function Project() {
    const params = useParams()
    const projectCtx = useContext(ProjectContext)
    const authCtx = useContext(AuthContext)
    const {get, loading} = useFetch("/api/")

    useEffect(() => {
        get("projects/"+params.id)
            .then(d => {
                projectCtx.setProject(d);
            })
            .catch(e => console.log(e))
    }, [])

    if (loading) {
        return <Loader/>
    }

    if (!projectCtx.project) {
        return <>Could not get project</>
    }

    return <>
        <Routes>
            <Route path="sprints/*" element={<Sprints/>}/>
            <Route exact path="/" element={<ProjectDashboard/>}/>
            <Route exact path="permissions" element={<Permissions
                cerberusUrl={"http://localhost:8000/api/"}
                cerberusToken={authCtx.user.cerberusToken}
                resourceId={projectCtx.project.id}
            />}/>
        </Routes>
    </>
}


function ProjectDashboard() {
    const projectCtx = useContext(ProjectContext)
    return <>
        <h1>Project Name</h1>
        <p>{projectCtx.project.name}</p>
        <h1>Description</h1>
        <p>{projectCtx.project.description}</p>
    </>
}
