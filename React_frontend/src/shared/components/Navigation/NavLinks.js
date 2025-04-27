import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import './NavLinks.css';
import { AuthContext } from "../../context/auth-context";
import Button from "../FormElements/Button";
import Avatar from "../UIElements/Avatar";
import logo from "../../../assets/CholBro_logo.png";

const NavLinks = props => {
    const auth = useContext(AuthContext);
    const uid = auth.userId;
    
    return <ul className="nav-links">
        <li>
            <NavLink to='/' exact>HOME</NavLink>
        </li>
        {auth.isLoggedIn && (
            <li>
                <NavLink to={`/user/${uid}`}>MY PROFILE</NavLink>
            </li>
        )}
        <li className="main-navigation__logo"><Link to='/'><img src={logo} alt="Logo" /></Link></li>
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
            <li className="small-screen">
                <Avatar image={`${process.env.REACT_APP_ASSETS_URL}/${props.userImg}`} alt="Image"/>
            </li>           
        )}
        {auth.isLoggedIn && (
            <li className="small-screen">
                <Button text onClick={auth.logout}>LOG OUT</Button>
            </li>
        )}
    </ul>
};

export default NavLinks; 