import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import './NavLinks.css';
import { AuthContext } from "../../context/auth-context";
import Button from "../FormElements/Button";
import Avatar from "../UIElements/Avatar";
import { useHttpClient } from "../../hooks/http-hook";


const NavLinks = props => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [userImg, setUserImg] = useState();
    const uid = auth.userId;
    useEffect(() => {
        const fetchUserImg = async () => {
        try {
            const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/users/${uid}`);
            setUserImg(responseData.user.image);
        } catch(err) {
            console.log(err);
        }
        };
        fetchUserImg(); 
    }, [sendRequest, setUserImg, uid]);
    return <ul className="nav-links">
        <li>
            <NavLink to='/'>ALL USERS</NavLink>
        </li>
        {auth.isLoggedIn && (
            <li>
                <NavLink to={`/user/${auth.userId}`}>MY PROFILE</NavLink>
            </li>
        )}
        {auth.isLoggedIn && (
            <li>
                <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
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
                <Avatar image={`${process.env.REACT_APP_ASSETS_URL}/${userImg}`} alt="Image"/>
            </li>
        )}
    </ul>
};

export default NavLinks; 