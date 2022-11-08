
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../../hooks/useFetch";
import Loader from "../../../../uikit/Loader";
import {Routes, Route, Link} from "react-router-dom";
import CreateStory from "./CreateStory";
import Story from "./Story";
import {SprintContext} from "../SprintContext";
import {AccessGuard, WsContext} from "cerberus-reactjs";
import {AuthContext} from "../../../../context/AuthContext";

export default function Stories() {

    return <>
        <Routes>
            <Route path=":id/*" element={<Story/>}/>
            <Route exact path="/" element={<StoryList/>}/>
        </Routes>
    </>
}

function StoryList() {
    const [stories, setStories] = useState([])
    const authCtx = useContext(AuthContext)
    const sprintCtx = useContext(SprintContext)
    const wsCtx = useContext(WsContext)
    const {get, loading} = useFetch("/api/")
    const [showCreate, setShowCreate] = useState(false)

    useEffect(() => {
        get("sprints/"+sprintCtx.sprint.id+"/stories")
            .then(d => {
                if (d) {
                    setStories(d)
                }
            })
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
                stories.map(story => {
                    return (
                        <li className="nav-item" key={story.id}>
                            <Link to={`${story.id}`}>{story.description}</Link>
                        </li>
                    )
                })
            }
        </ul>

        <AccessGuard wsContext={wsCtx} resourceId={sprintCtx.sprint.id} action="CreateStory">
            {
                !showCreate && <Link to="" onClick={handleNewClicked}>New Story</Link>
            }
            {
                showCreate && <CreateStory
                    stories={stories}
                    setStories={setStories}
                    setShowCreate={setShowCreate}/>
            }
        </AccessGuard>
    </>
}