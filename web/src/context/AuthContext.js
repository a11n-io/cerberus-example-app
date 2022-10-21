import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

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
    const {redirectTo = "", ...rest} = props

    useEffect(() => {
        if (redirectTo !== "" && !auth.user) {
            navigate(redirectTo)
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