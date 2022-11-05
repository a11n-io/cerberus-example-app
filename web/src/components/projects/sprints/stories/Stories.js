
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../../hooks/useFetch";
import Loader from "../../../../uikit/Loader";
import {Routes, Route, Link} from "react-router-dom";
import {ProjectContext} from "../../ProjectContext";
import Sprint from "./Story";
import CreateStory from "./CreateStory";
import Story from "./Story";
import {SprintContext} from "../SprintContext";

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

        {
            !showCreate && <Link to="" onClick={handleNewClicked}>New Story</Link>
        }
        {
            showCreate && <CreateStory
                stories={stories}
                setStories={setStories}
                setShowCreate={setShowCreate}/>
        }

    </>
}