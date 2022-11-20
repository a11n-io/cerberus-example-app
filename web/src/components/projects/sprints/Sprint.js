import {SprintContext} from "./SprintContext";
import {Route, Routes, useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import useFetch from "../../../hooks/useFetch";
import Loader from "../../../uikit/Loader";
import Btn from "../../../uikit/Btn";
import Stories from "./stories/Stories";
import {AccessGuard, Permissions} from "cerberus-reactjs";

export default function Sprint() {
    const params = useParams()
    const sprintCtx = useContext(SprintContext)
    const {get, loading} = useFetch("/api/")

    useEffect(() => {
        get("sprints/"+params.id)
            .then(d => sprintCtx.setSprint(d))
            .catch(e => console.error(e))
    }, [])

    if (loading) {
        return <Loader/>
    }

    if (!sprintCtx.sprint) {
        return <>Could not get sprint</>
    }

    return <>
        <Routes>
            <Route path="stories/*" element={<Stories/>}/>
            <Route exact path="/" element={<Dashboard/>}/>
            <Route exact path="permissions" element={<SprintPermissions/>}/>
        </Routes>
    </>
}


function Dashboard() {
    const sprintCtx = useContext(SprintContext)
    const sprint = sprintCtx.sprint

    return <>
        <h1>Sprint {sprint.sprintNumber}</h1>
        <h2>Goal</h2>
        <p>{sprint.goal}</p>
        {
            sprint.startDate === 0 ?
                <ChangeSprint sprintCtx={sprintCtx} start={true}/> :
                <>
                    <p>Started on {new Date(sprint.startDate * 1000).toDateString()}</p>
                    {
                        sprint.endDate === 0 ?
                            <ChangeSprint sprintCtx={sprintCtx} start={false}/> :
                            <>
                                <p>Ended on {new Date(sprint.endDate * 1000).toDateString()}</p>
                            </>
                    }
                </>
        }

    </>
}

function ChangeSprint(props) {
    const {post, loading} = useFetch("/api/")
    const {sprintCtx, start} = props

    function handleButtonClicked() {
        post("sprints/"+sprintCtx.sprint.id+"/" + (start ? "start" : "end"))
            .then(d => {
                if (d) {
                    sprintCtx.setSprint(d)
                }
            })
            .catch(e => console.error(e))
    }

    return <>
        <Btn onClick={handleButtonClicked}>{start ? "Start" : "End"} sprint</Btn>
    </>
}

function SprintPermissions() {
    const sprintCtx = useContext(SprintContext)

    return <>
        <AccessGuard resourceId={sprintCtx.sprint.id} action="ManageSprintPermissions">
            <Permissions resourceId={sprintCtx.sprint.id}/>
        </AccessGuard>
    </>
}