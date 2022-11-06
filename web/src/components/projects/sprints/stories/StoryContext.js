import {createContext, useState} from "react";

const StoryContext = createContext(null)

function StoryProvider(props) {
    const [story, setStory] = useState()

    const value = {
        story: story,
        setStory: setStory
    }

    return (
        <StoryContext.Provider value={value}>
            {props.children}
        </StoryContext.Provider>
    )
}

export {StoryContext, StoryProvider}