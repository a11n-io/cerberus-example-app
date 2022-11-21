import {useContext, useEffect, useState} from "react";
import useFetch from "../../../../hooks/useFetch";
import Loader from "../../../../uikit/Loader";
import {Routes, Route, Link} from "react-router-dom";
import CreateStory from "./CreateStory";
import Story from "./Story";
import {SprintContext} from "../SprintContext";
import {AccessGuard} from "cerberus-reactjs";

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
    const sprintCtx = useContext(SprintContext)
    const {get, loading} = useFetch("/api/")
    const [showCreate, setShowCreate] = useState(false)

    useEffect(() => {
        get("sprints/"+sprintCtx.sprint.id+"/stories")
            .then(d => {
                if (d) {
                    setStories(d)
                }
            })
            .catch(e => console.error(e))
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
                            <AccessGuard
                                resourceId={story.id}
                                action="ReadStory"
                                otherwise={<span>{story.description}</span>}>
                                <Link to={`${story.id}`}>
                                    <i>{story.description}</i>
                                    <i className="m-1">&#8594;</i>
                                </Link>
                            </AccessGuard>
                        </li>
                    )
                })
            }
        </ul>

        <AccessGuard resourceId={sprintCtx.sprint.id} action="CreateStory">
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