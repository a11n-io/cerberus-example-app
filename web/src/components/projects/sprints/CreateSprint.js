import {useContext, useState} from "react";
import {ProjectContext} from "../ProjectContext";
import useFetch from "../../../hooks/useFetch";
import Loader from "../../../uikit/Loader";
import Input from "../../../uikit/Input";
import Button from "../../../uikit/Button";

export default function CreateSprint(props) {
    const projectCtx = useContext(ProjectContext)
    const [goal, setGoal] = useState()
    const {post, loading} = useFetch("/api/")

    function handleFormSubmit(e) {
        e.preventDefault()
        post("apps/"+projectCtx.project.id+"/sprints", {
            goal: goal,
        })
            .then(r => {
                if (r) {
                    props.setSprints([...props.sprints, r])
                    props.setShowCreate(false)
                }
            })
            .catch(e => console.log(e))
    }

    function handleGoalChanged(e) {
        setGoal(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <form onSubmit={handleFormSubmit}>
            <Input required placeholder="Goal" onChange={handleGoalChanged}/>
            <Button type="submit">Create</Button>
        </form>
    </>
}