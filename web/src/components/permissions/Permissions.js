import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";

export default function Permissions(props) {
    const authCtx = useContext(AuthContext)
    const {get, post, loading} = useFetch("localhost:8080/api") // cerberus
    const [permissions, setPermissions] = useState([])
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [permittee, setPermittee] = useState()

    const {resourceId} = props

    useEffect(() => {
        if (authCtx.cerberusToken) {
            get(`accounts/${authCtx.user.accountId}/resources/${resourceId}/permissions`, {
                "Authorization": "Bearer " + authCtx.cerberusToken
            })
                .then(r => setPermissions(r))
                .catch(e => console.log(e))

            get(`accounts/${authCtx.user.accountId}/users`, {
                "Authorization": "Bearer " + authCtx.cerberusToken
            })
                .then(r => setUsers(r))
                .catch(e => console.log(e))

            get(`accounts/${authCtx.user.accountId}/roles`, {
                "Authorization": "Bearer " + authCtx.cerberusToken
            })
                .then(r => setRoles(r))
                .catch(e => console.log(e))

        }
    }, [])

    function handlePermitteeChanged(e) {

    }

    return <>

        <table>
            <thead>
                <tr>
                    <th>Permittee</th>
                    <th>Policies</th>
                </tr>
            </thead>
            <tbody>
            {
                permissions.map(permission => {
                    return (
                        <tr key={permission.id}>
                            <td>

                            </td>
                            <td>

                            </td>
                        </tr>
                    )
                })
            }
            <tr>
                <td>
                    <label htmlFor="permittees">Choose a permittee:</label>
                    <select id="permittees" onChange={handlePermitteeChanged}>
                        <optgroup label="Roles">
                            {
                                roles.map(role => {
                                    return (
                                        <option key={role.id} value={role.id}>{role.roleName}</option>
                                    )
                                })
                            }
                        </optgroup>
                        <optgroup label="Users">
                            {
                                users.map(user => {
                                    return (
                                        <option key={user.id} value={user.id}>{user.displayName}</option>
                                    )
                                })
                            }
                        </optgroup>
                    </select>
                </td>
                <td>
                    {
                        permittee &&
                        <>
                        </>
                    }
                </td>
            </tr>
            </tbody>
        </table>
    </>
}