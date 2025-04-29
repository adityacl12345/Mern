import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import './NavLinks.css';
import { AuthContext } from "../../context/auth-context";
import logo from "../../../assets/CholBro_logo.png";

const NavLinks = () => {
    const auth = useContext(AuthContext);
    
    return <ul className="nav-links">
        <li>
            <NavLink to='/' exact>HOME</NavLink>
        </li>
        <li className="main-navigation__logo"><Link to='/'><img src={logo} alt="Logo" /></Link></li>       
        {!auth.isLoggedIn && (
            <li>
                <NavLink to='/auth'>SIGN IN</NavLink>
            </li>
        )}
        {auth.isLoggedIn && (
            <li>
                <NavLink to='/places'>PLACES</NavLink>
            </li>
        )}
    </ul>
};

export default NavLinks; 