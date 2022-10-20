import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext(null)

function AuthProvider(props) {
    const [jwtToken, setJwtToken] = useState(null)
    const [id, setId] = useState()

    const value = {
        jwtToken: jwtToken,
        setJwtToken: setJwtToken,
        id: id,
        setId: setId
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
    const {redirectTo = "", ...rest} = props

    useEffect(() => {
        if (redirectTo !== "" && !auth.jwtToken) {
            navigate(redirectTo)
        }
    }, [auth])

    if (redirectTo !== "" && !auth.jwtToken) {
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