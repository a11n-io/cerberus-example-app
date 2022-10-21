import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import useFetch from "../hooks/useFetch";

const AuthContext = createContext(null)

function AuthProvider(props) {
    const [user, setUser] = useState(null)

    const value = {
        user: user,
        setUser: setUser,
    }

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}

function AuthGuard(props) {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()
    const {get} = useFetch("/api/")
    const {redirectTo = "", ...rest} = props

    useEffect(() => {
        if (redirectTo !== "" && !auth.user) {
            navigate(redirectTo)
        } else if (auth.user) {
            // get cerberus token
            get("cerberus/token")
                .then(r => console.log("Cerberus token", r))
                .catch(e => console.log(e))
        }
    }, [auth])

    if (!auth.user) {
        return <></>
    } else {

        return (
            <>
                {
                    rest.children
                }
            </>
        )
    }
}

export {AuthContext, AuthProvider, AuthGuard}