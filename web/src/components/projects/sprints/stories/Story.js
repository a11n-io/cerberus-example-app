import {Route, Routes, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../../hooks/useFetch";
import Loader from "../../../../uikit/Loader";
import {Form} from "react-bootstrap";
import {StoryContext} from "./StoryContext";
import {AccessGuard, Permissions, useAccess} from "cerberus-reactjs";

export default function Story() {
    const params = useParams()
    const storyCtx = useContext(StoryContext)
    const {get, loading} = useFetch("/api/")

    useEffect(() => {
        get("stories/"+params.id)
            .then(d => storyCtx.setStory(d))
            .catch(e => console.error(e))
    }, [])

    if (loading) {
        return <Loader/>
    }

    if (!storyCtx.story) {
        return <>Could not get story</>
    }

    return <>
        <Routes>
            <Route exact path="/" element={<Dashboard story={storyCtx.story} setStory={storyCtx.setStory}/>}/>
            <Route exact path="permissions" element={<StoryPermissions/>}/>
        </Routes>
    </>
}


function Dashboard(props) {
    const {get, post, loading} = useFetch("/api/")
    const [users, setUsers] = useState([])
    const [estimate, setEstimate] = useState(0)
    const [status, setStatus] = useState("")
    const [assignee, setAssignee] = useState("")
    const [estimateAccess, setEstimateAccess] = useState(false)
    const [statusAccess, setStatusAccess] = useState(false)
    const [assigneeAccess, setAssigneeAccess] = useState(false)
    const {story, setStory} = props

    useAccess(story.id, "EstimateStory", setEstimateAccess)
    useAccess(story.id, "ChangeStoryStatus", setStatusAccess)
    useAccess(story.id, "ChangeStoryAssignee", setAssigneeAccess)

    useEffect(() => {
        get("users")
            .then(d => setUsers(d))
            .catch(e => console.error(e))
    }, [])

    useEffect(() => {
        setEstimate(story.estimation)
        setStatus(story.status)
        setAssignee(story.assignee)
    }, [story])

    function handleEstimateChange(e) {
        setEstimate(e.target.value)
    }

    function handleEstimateBlur(e) {
        post("stories/"+story.id + "/estimate", {
            estimation: estimate
        })
            .then(d => {
                if (d) {
                    setStory(d)
                }
            })
            .catch(e => console.error(e))
    }

    function handleStatusChange(e) {
        post("stories/"+story.id + "/status", {
            status: e.target.value
        })
            .then(d => {
                if (d) {
                    setStory(d)
                }
            })
            .catch(e => console.error(e))
    }

    function handleAssigneeChange(e) {
        post("stories/"+story.id + "/assign", {
            userId: e.target.value
        })
            .then(d => {
                if (d) {
                    setStory(d)
                }
            })
            .catch(e => console.error(e))
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <h1>Story</h1>
        <h2>Description</h2>
        <p>{story.description}</p>
        <Form className="mb-5">
            <Form.Group className="mb-3">
                <Form.Label>Estimate</Form.Label>
                <Form.Control disabled={!estimateAccess} type="number" value={estimate} onChange={handleEstimateChange} onBlur={handleEstimateBlur}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select disabled={!statusAccess} value={status} onChange={handleStatusChange}>
                    <option value="todo">todo</option>
                    <option value="busy">busy</option>
                    <option value="done">done</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Assignee</Form.Label>
                <Form.Select disabled={!assigneeAccess} value={assignee} onChange={handleAssigneeChange}>
                    {
                        users.map(user => {
                            return (
                                <option key={user.id} value={user.id}>{user.displayName}</option>
                            )
                        })
                    }
                </Form.Select>
            </Form.Group>
        </Form>
    </>
}

function StoryPermissions() {
    const storyCtx = useContext(StoryContext)

    return <>
        <AccessGuard resourceId={storyCtx.story.id} action="ReadStoryPermissions">
            <Permissions resourceId={storyCtx.story.id} changeAction="ChangeStoryPermissions"/>
        </AccessGuard>
    </>
}