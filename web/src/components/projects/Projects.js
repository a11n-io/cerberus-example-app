
import {useContext, useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";
import {AuthContext} from "../../context/AuthContext";
import Loader from "../../uikit/Loader";
import {Routes, Route, Link} from "react-router-dom";
import Project from "./Project";
import CreateProject from "./CreateProject";
import {AccessGuard} from "cerberus-reactjs"
import {ProjectContext} from "./ProjectContext";

export default function Projects() {

    return <>

        <Routes>
            <Route path=":id/*" element={<Project/>}/>
            <Route exact path="/" element={<ProjectList/>}/>
        </Routes>

    </>

}

function ProjectList() {
    const [projects, setProjects] = useState([])
    const authCtx = useContext(AuthContext)
    const projectCtx = useContext(ProjectContext)
    const {get, loading} = useFetch("/api/")
    const [showCreate, setShowCreate] = useState(false)

    useEffect(() => {
        get("accounts/"+authCtx.user.accountId+"/projects")
            .then(d => setProjects(d))
            .catch(e => console.log(e))
    }, [])

    function handleNewClicked(e) {
        e.preventDefault()
        setShowCreate(p => !p)
    }

    if (loading) {
        return <Loader/>
    }

    return <>

        <ul>
            {
                projects.map(project => {
                    return (
                        <li className="nav-item" key={project.id}>
                            <Link to={`/projects/${project.id}`}>{project.name}</Link>
                        </li>
                    )
                })
            }
        </ul>

        <AccessGuard
            cerberusUrl={"http://localhost:8000/api/"}
            cerberusToken={authCtx.user.cerberusToken}
            accountId={authCtx.user.accountId}
            resourceId={authCtx.user.accountId}
            userId={authCtx.user.id}
            action="CreateProject">

        <Link to="" onClick={handleNewClicked}>New Project</Link>
        {
            showCreate && <CreateProject/>
        }
        </AccessGuard>
    </>
}