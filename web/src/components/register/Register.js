import Input from "../../uikit/Input";
import Button from "../../uikit/Button";
import useFetch from "../../hooks/useFetch";
import {useState} from "react";
import Loader from "../../uikit/Loader";
import {useNavigate} from "react-router-dom";

export default function Register() {
    const navigate = useNavigate()
    const {post, loading} = useFetch("/")
    const [email, setEmail] = useState()
    const [name, setName] = useState()
    const [password, setPassword] = useState()

    function handleRegister(e) {
        e.preventDefault()
        post("auth/register", {
            name: name,
            email: email,
            password: password
        })
            .then(r => {
                console.log(r)
                navigate("/login")
            })
            .catch(e => console.log(e))
    }

    function handleNameChanged(e) {
        setName(e.target.value)
    }

    function handleEmailChanged(e) {
        setEmail(e.target.value)
    }

    function handlePasswordChanged(e) {
        setPassword(e.target.value)
    }

    if (loading) {
        return <Loader/>
    }

    return <>
        <form onSubmit={handleRegister}>
            <Input required placeholder="Name" onChange={handleNameChanged}/>
            <Input required placeholder="Email" onChange={handleEmailChanged}/>
            <Input required placeholder="Password" type="password" onChange={handlePasswordChanged}/>
            <Button type="submit">Register</Button>
        </form>
    </>
}