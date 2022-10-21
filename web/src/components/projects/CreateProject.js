import {useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import Input from "../../uikit/Input";
import Button from "../../uikit/Button";

export default function CreateProject() {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const {post, loading} = useFetch("/api/")

    function handleFormSubmit(e) {
        e.preventDefault()
        post("accounts/"+auth.user.accountId+"/projects", {
            name: name,
            description: description
        })
            .then(r => {
                if (r) {
                    navigate("/projects/" + r.id)
                }
            })
            .catch(e => console.log(e))
    }

    function handleNameChanged(e) {
        setName(e.target.value)
    }

    function handleDescriptionChanged(e) {
        setDescription(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <form onSubmit={handleFormSubmit}>
            <Input required placeholder="Name" onChange={handleNameChanged}/>
            <Input required placeholder="Description" onChange={handleDescriptionChanged}/>
            <Button type="submit">Create</Button>
        </form>
    </>
}