import {Route, Routes, useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import Sprints from "./sprints/Sprints";
import {ProjectContext} from "./ProjectContext";
import {SprintProvider} from "./sprints/SprintContext";

export default function Project() {
    const params = useParams()
    const projectCtx = useContext(ProjectContext)
    const {get, loading} = useFetch("/api/")

    useEffect(() => {
        get("projects/"+params.id)
            .then(d => {
                console.log(d);
                projectCtx.setApp(d);
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

        <SprintProvider>
            <Routes>
                <Route path="sprints/*" element={<Sprints/>}/>
                <Route exact path="/" element={<ProjectDashboard/>}/>
            </Routes>
        </SprintProvider>
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
