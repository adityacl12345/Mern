import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import './NavLinks.css';
import { AuthContext } from "../../context/auth-context";
import logo from "../../../assets/CholBro_logo.png";
import Avatar from "../UIElements/Avatar";
import NavDropDown from "./NavDropDown";

const NavLinks = props => {
    const auth = useContext(AuthContext);
    const uid = auth.userId;
    
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
        {!auth.isLoggedIn && (<li className="side-navigation__user">
            <Avatar image={`${process.env.REACT_APP_ASSETS_URL}/uploads/images/Default.png`} alt="Image"/>
        </li>
        )}
        {auth.isLoggedIn && (
            <li className="side-navigation__user">
                <Avatar image={`${process.env.REACT_APP_ASSETS_URL}/${props.userImg}`} alt="Image"/>
                <NavDropDown userId={uid}></NavDropDown> 
            </li>
        )}
    </ul>
};

export default NavLinks; 