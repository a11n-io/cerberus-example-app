
import {useContext, useEffect, useState} from "react";
import {Link, NavLink, useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";
import {ProjectContext} from "../projects/ProjectContext";
import {SprintContext} from "../projects/sprints/SprintContext";
import {StoryContext} from "../projects/sprints/stories/StoryContext";
import {AccessGuard} from "cerberus-reactjs";

export default function StoryMenu() {
    const projectCtx = useContext(ProjectContext)
    const sprintCtx = useContext(SprintContext)
    const storyCtx = useContext(StoryContext)

    if (!storyCtx.story) {
        return <></>
    }

    return <>
        <div className="navmenu">
            <Link to={`/projects/${projectCtx.project.id}/sprints/${sprintCtx.sprint.id}/stories`}>
                <i className="mr-1">&#8592;</i>
                <i>{sprintCtx.sprint.number} Stories</i>
            </Link>
            <p>{storyCtx.story.description}</p>

            <AccessGuard resourceId={storyCtx.story.id} action="ReadStoryPermissions">
                <li className="nav-item">
                    <NavLink end to={`permissions`}>Permissions</NavLink>
                </li>
            </AccessGuard>
        </div>

    </>

}