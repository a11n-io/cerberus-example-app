import {Link, Route, Routes, useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import Sprints from "./sprints/Sprints";
import {ProjectContext} from "./ProjectContext";
import {AccessGuard, Permissions} from "cerberus-reactjs";
import {Button, Tab, Tabs} from "react-bootstrap";

export default function Project(props) {
    const {project, setSelectedProject, setProjects} = props

    if (!project) {
        return <></>
    }

    return <>
        <Tabs defaultActiveKey="sprints">
            <Tab eventKey="sprints" title="Sprints" className="m-2"><Sprints project={project}/></Tab>
            <Tab eventKey="details" title="Details" className="m-2"><ProjectDashboard project={project} setSelectedProject={setSelectedProject} setProjects={setProjects}/></Tab>
            <Tab eventKey="permissions" title="Permissions" className="m-2"><ProjectPermissions project={project}/></Tab>
        </Tabs>
    </>

}


function ProjectDashboard(props) {
    const projectCtx = useContext(ProjectContext)
    const {del, loading} = useFetch("/api/")

    const {project, setSelectedProject, setProjects} = props

    function handleDeleteClicked() {
        del(`projects/${project.id}`)
            .then(() => {
                setProjects(prev => prev.filter(p => p.id !== project.id))
                setSelectedProject(null)
            })
            .catch(e => console.error(e))
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <h1>Project Name</h1>
        <p>{project.name}</p>
        <h1>Description</h1>
        <p>{project.description}</p>

        <AccessGuard resourceId={project.id} action="DeleteProject">
            <Button variant="danger" onClick={handleDeleteClicked}>Delete Project</Button>
        </AccessGuard>
    </>
}

function ProjectPermissions(props) {
    const {project} = props

    return <>
        <AccessGuard resourceId={project.id} action="ReadProjectPermissions">
            <Permissions resourceId={project.id} changeAction="ChangeProjectPermissions"/>
        </AccessGuard>
    </>
}