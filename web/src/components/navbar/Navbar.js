import {NavLink, Link, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext, AuthGuard} from "../../context/AuthContext";

export default function Navbar() {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    function handleLogout() {
        auth.setJwtToken(null)
        navigate("/login")
    }

    return <>
        <nav className="navbar">
            <NavLink to="/" className="nav-brand">
                Cerberus Example App
            </NavLink>
            <ul>
                <AuthGuard>
                    <li className="nav-item">
                        <NavLink to="/projects">Projects</NavLink>
                    </li>
                    <li className="nav-item">
                        <Link to="" onClick={handleLogout}>Logout</Link>
                    </li>
                </AuthGuard>
            </ul>
        </nav>
    </>
}