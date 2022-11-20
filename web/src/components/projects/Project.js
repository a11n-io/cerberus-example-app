import {Link, Route, Routes, useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import Sprints from "./sprints/Sprints";
import {ProjectContext} from "./ProjectContext";
import {AccessGuard, Permissions} from "cerberus-reactjs";
import {Button} from "react-bootstrap";

export default function Project() {
    const params = useParams()
    const projectCtx = useContext(ProjectContext)
    const {get, loading} = useFetch("/api/")

    useEffect(() => {
        get("projects/"+params.id)
            .then(d => {
                projectCtx.setProject(d);
            })
            .catch(e => console.error(e))
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
            <Route exact path="permissions" element={<ProjectPermissions/>}/>
        </Routes>
    </>
}


function ProjectDashboard() {
    const projectCtx = useContext(ProjectContext)
    const {del, loading} = useFetch("/api/")
    const navigate = useNavigate()

    function handleDeleteClicked() {
        del(`projects/${projectCtx.project.id}`)
            .then(() => {
                navigate("/projects")
            })
            .catch(e => console.error(e))
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <h1>Project Name</h1>
        <p>{projectCtx.project.name}</p>
        <h1>Description</h1>
        <p>{projectCtx.project.description}</p>

        <AccessGuard resourceId={projectCtx.project.id} action="DeleteProject">
            <Button variant="danger" onClick={handleDeleteClicked}>Delete</Button>
        </AccessGuard>
    </>
}

function ProjectPermissions() {
    const projectCtx = useContext(ProjectContext)

    return <>
        <AccessGuard resourceId={projectCtx.project.id} action="ManageProjectPermissions">
            <Permissions resourceId={projectCtx.project.id}/>
        </AccessGuard>
    </>
}