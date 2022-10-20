import {createContext, useState} from "react";

const SprintContext = createContext(null)

function SprintProvider(props) {
    const [sprint, setSprint] = useState()

    const value = {
        sprint: sprint,
        setSprint: setSprint
    }

    return (
        <SprintContext.Provider value={value}>
            {props.children}
        </SprintContext.Provider>
    )
}

export {SprintContext, SprintProvider}