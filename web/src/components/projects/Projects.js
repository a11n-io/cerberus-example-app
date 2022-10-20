
import {useContext, useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";
import {AuthContext} from "../../context/AuthContext";
import Loader from "../../uikit/Loader";
import {Routes, Route, Link} from "react-router-dom";
import App from "./Project";
import CreateProject from "./CreateProject";

export default function Projects() {

    return <>

        <Routes>
            <Route path=":id/*" element={<App/>}/>
            <Route exact path="/" element={<ProjectList/>}/>
        </Routes>

    </>

}

function ProjectList() {
    const [projects, setProjects] = useState([])
    const auth = useContext(AuthContext)
    const {get, loading} = useFetch("/api/")
    const [showCreate, setShowCreate] = useState(false)

    useEffect(() => {
        get("users/"+auth.id+"/projects")
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

        <Link to="" onClick={handleNewClicked}>New Project</Link>

        {
            showCreate && <CreateProject/>
        }

    </>
}