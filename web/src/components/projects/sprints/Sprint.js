import {SprintContext} from "./SprintContext";
import {Route, Routes, useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import useFetch from "../../../hooks/useFetch";
import Loader from "../../../uikit/Loader";

export default function Sprint() {
    const params = useParams()
    const sprintCtx = useContext(SprintContext)
    const {get, loading} = useFetch("/api/")

    useEffect(() => {
        get("sprints/"+params.id)
            .then(d => sprintCtx.setSprint(d))
            .catch(e => console.log(e))
    }, [])

    if (loading) {
        return <Loader/>
    }

    if (!sprintCtx.sprint) {
        return <>Could not get sprint</>
    }

    return <>
        <Routes>
            <Route exact path="/" element={<Dashboard/>}/>
        </Routes>

    </>
}


function Dashboard() {
    const sprintCtx = useContext(SprintContext)
    return <>
        <h1>Sprint</h1>
        <h2>Goal</h2>
        <p>{sprintCtx.sprint.goal}</p>
        <h2>Start</h2>
        <p>{sprintCtx.sprint.start}</p>
        <h2>End</h2>
        <p>{sprintCtx.sprint.end}</p>
    </>
}
