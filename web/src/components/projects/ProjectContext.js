import {createContext, useState} from "react";

const ProjectContext = createContext(null)

function ProjectProvider(props) {
    const [project, setProject] = useState()

    const value = {
        project: project,
        setProject: setProject
    }

    return (
        <ProjectContext.Provider value={value}>
            {props.children}
        </ProjectContext.Provider>
    )
}

export {ProjectContext, ProjectProvider}