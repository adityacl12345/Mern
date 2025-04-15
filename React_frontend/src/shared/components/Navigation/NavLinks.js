import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import './NavLinks.css';
import { AuthContext } from "../../context/auth-context";
import Button from "../FormElements/Button";
import Avatar from "../UIElements/Avatar";

const NavLinks = props => {
    const auth = useContext(AuthContext);
    const uid = auth.userId;
    
    return <ul className="nav-links">
        <li>
            <NavLink to='/'>ALL USERS</NavLink>
        </li>
        {auth.isLoggedIn && (
            <li>
                <NavLink to={`/user/${uid}`}>MY PROFILE</NavLink>
            </li>
        )}
        {auth.isLoggedIn && (
            <li>
                <NavLink to={`/${uid}/places`}>MY PLACES</NavLink>
            </li>
        )}
        {auth.isLoggedIn && (
            <li>
                <NavLink to='/places/new'>ADD PLACE</NavLink>
            </li>
        )}
        {!auth.isLoggedIn && (
            <li>
                <NavLink to='/auth'>SIGN IN</NavLink>
            </li>
        )}
        {auth.isLoggedIn && (
            <li>
                <Button text onClick={auth.logout}>LOG OUT</Button>
            </li>
        )}
        {auth.isLoggedIn && (
            <li>
                <Avatar image={`${process.env.REACT_APP_ASSETS_URL}/${props.uImg}`} alt="Image"/>
            </li>
        )}
    </ul>
};

export default NavLinks; 