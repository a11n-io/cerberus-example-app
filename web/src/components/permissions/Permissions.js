import {useContext, useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";
import Button from "../../uikit/Button";

export default function Permissions(props) {
    const {cerberusUrl, cerberusToken, accountId, resourceId} = props
    const {get, post, loading} = useFetch(cerberusUrl)
    const [permissions, setPermissions] = useState([])
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [policies, setPolicies] = useState([])
    const [permittee, setPermittee] = useState()

    const headers = {
        "CerberusAuthorization": "Bearer " + cerberusToken
    }

    useEffect(() => {
            get(`accounts/${accountId}/resources/${resourceId}/permissions`, headers)
                .then(r => {
                    console.log(r)
                    if (r && r.data) {
                    setPermissions(r.data)}
                })
                .catch(e => console.log(e))

            get(`accounts/${accountId}/users`, headers)
                .then(r => {
                    if (r && r.data) {
                        setUsers(r.data)
                    }
                })
                .catch(e => console.log(e))

            get(`accounts/${accountId}/roles`, headers)
                .then(r => {
                    if (r && r.data) {
                        setRoles(r.data)
                    }
                })
                .catch(e => console.log(e))

            get(`policies`, headers)
                .then(r => {
                    if (r && r.data) {
                        setPolicies(r.data)
                    }
                })
                .catch(e => console.log(e))
    }, [])

    function handlePermitteeChanged(e) {

    }

    return <>

        <table>
            <thead>
                <tr>
                    <th>Permittee</th>
                    <th>Policies</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {
                permissions.map(permission => {
                    return (
                        <tr key={permission.id}>
                            <td>
                                {permission.permittee.displayName}
                            </td>
                            <td>
                                {
                                    permission.policies.map(policy => {
                                        return (
                                            <span>{policy.name} x</span>
                                        )
                                    })
                                }
                                <span>
                                    <select>

                                            {
                                                policies.map(policy => {
                                                    return (
                                                        <option key={policy.id} value={policy.id}>{policy.name}</option>
                                                    )
                                                })
                                            }
                                    </select>
                                </span>
                            </td>
                            <td><Button>Delete</Button></td>
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
                                        <option key={role.id} value={role.id}>{role.displayName}</option>
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