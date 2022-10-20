
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from "../../uikit/Loader";

export default function SprintMenu(props) {
    const [sprint, setSprint] = useState()
    const params = useParams()
    const {get, loading} = useFetch("/api/")

    const {project} = props

    useEffect(() => {
        if (params.id) {
            get("sprints/" + params.id)
                .then(d => setSprint(d))
                .catch(e => console.log(e))
        }
    }, [])

    if (loading) {
        return <Loader/>
    }

    if (!sprint) {
        return <></>
    }

    return <>
        <div className="navmenu">
            <Link to={`/projects/${project.id}/resourcetypes`}>{project.name} Sprints</Link>
            <p>{sprint.number}</p>
            <ul>
                <li className="nav-item">

                </li>
            </ul>

        </div>

    </>

}