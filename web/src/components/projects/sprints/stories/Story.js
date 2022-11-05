
import {Route, Routes, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../../hooks/useFetch";
import Loader from "../../../../uikit/Loader";
import {Form} from "react-bootstrap";

export default function Story() {
    const params = useParams()
    const [story, setStory] = useContext(null)
    const {get, loading} = useFetch("/api/")

    useEffect(() => {
        get("stories/"+params.id)
            .then(d => setStory(d))
            .catch(e => console.log(e))
    }, [])

    if (loading) {
        return <Loader/>
    }

    if (!story) {
        return <>Could not get story</>
    }

    return <>
        <Routes>
            <Route exact path="/" element={<Dashboard story={story} setStory={setStory}/>}/>
        </Routes>
    </>
}


function Dashboard(props) {
    const {get, post, loading} = useFetch("/api/")
    const [users, setUsers] = useState([])
    const [estimate, setEstimate] = useState(0)
    const [status, setStatus] = useState("")
    const [assignee, setAssignee] = useState("")
    const {story, setStory} = props

    useEffect(() => {
        get("users")
            .then(d => setUsers(d))
            .catch(e => console.log(e))
    }, [])

    useEffect(() => {
        setEstimate(story.estimate)
        setStatus(story.status)
        setAssignee(story.assignee)
    }, [story])

    function handleEstimateChange(e) {
        post("stories/"+story.id + "/estimate", {
            estimation: e.target.value
        })
            .then(d => {
                if (d) {
                    setStory(d)
                }
            })
            .catch(e => console.log(e))
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
            .catch(e => console.log(e))
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
            .catch(e => console.log(e))
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
                <Form.Control type="number" value={estimate} onBlur={handleEstimateChange}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select value={status} onChange={handleStatusChange}>
                    <option value="todo">todo</option>
                    <option value="busy">busy</option>
                    <option value="done">done</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Assignee</Form.Label>
                <Form.Select value={assignee} onChange={handleAssigneeChange}>
                    {
                        users.map(user => {
                            return (
                                <option value={user.id}>{user.displayName}</option>
                            )
                        })
                    }
                </Form.Select>
            </Form.Group>
        </Form>
    </>
}
