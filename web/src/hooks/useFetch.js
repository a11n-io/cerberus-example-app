import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext";

export default function useFetch(baseUrl) {
    const [loading, setLoading] = useState(false);
    const authCtx = useContext(AuthContext)

    const defaultHeaders = {
        "Content-Type": "application/json",
    }

    function get(url, headers) {

        let hdr = {...defaultHeaders, ...headers}
        if (authCtx.jwtToken) {
            hdr = {...hdr, "Authorization": "Bearer " + authCtx.jwtToken}
        }

        return new Promise((resolve, reject) => {
            setLoading(true);
            fetch(baseUrl + url, {
                method: "get",
                headers: hdr
            })
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        setLoading(false);
                        return reject(data);
                    }
                    setLoading(false);
                    resolve(data);
                })
                .catch(error => {
                    setLoading(false);
                    reject(error);
                });
        });
    }

    function post(url, body, headers) {
        let hdr = {...defaultHeaders, ...headers}
        if (authCtx.jwtToken) {
            hdr = {...hdr, "Authorization": "Bearer " + authCtx.jwtToken}
        }

        return new Promise((resolve, reject) => {
            setLoading(true);
            fetch(baseUrl + url, {
                method: "post",
                headers: hdr,
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        setLoading(false);
                        return reject(data);
                    }
                    setLoading(false);
                    resolve(data);
                })
                .catch(error => {
                    setLoading(false);
                    reject(error);
                });
        });
    }

    function put(url, body, headers) {
        let hdr = {...defaultHeaders, ...headers}
        if (authCtx.jwtToken) {
            hdr = {...hdr, "Authorization": "Bearer " + authCtx.jwtToken}
        }

        return new Promise((resolve, reject) => {
            setLoading(true);
            fetch(baseUrl + url, {
                method: "put",
                headers: hdr,
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        setLoading(false);
                        return reject(data);
                    }
                    setLoading(false);
                    resolve(data);
                })
                .catch(error => {
                    setLoading(false);
                    reject(error);
                });
        });
    }

    function del(url, headers) {
        let hdr = {...defaultHeaders, ...headers}
        if (authCtx.jwtToken) {
            hdr = {...hdr, "Authorization": "Bearer " + authCtx.jwtToken}
        }

        return new Promise((resolve, reject) => {
            setLoading(true);
            fetch(baseUrl + url, {
                method: "delete",
                headers: hdr
            })
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        setLoading(false);
                        return reject(data);
                    }
                    setLoading(false);
                    resolve(data);
                })
                .catch(error => {
                    setLoading(false);
                    reject(error);
                });
        });
    }

    return { get, post, put, del, loading };
};