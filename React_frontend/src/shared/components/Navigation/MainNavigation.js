import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import './MainNavigation.css';
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import logo from "../../../assets/logo.png";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";


const MainNavigation = props => {
    const auth = useContext(AuthContext);
    const uid = auth.userId;
    const [drawerIsOpen, setDrawerOpen] = useState(false);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [userImg, setUserImg] = useState(null);
    useEffect(() => {
        const fetchUserImg = async () => {
        try {
            const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/users/${uid}`);
            setUserImg(responseData.user.image);
        } catch(err) {
            console.log(err);
        }
        };
        if(uid) {
            fetchUserImg(); 
        }
    }, [sendRequest, setUserImg, uid]);

    const openDrawer = () => {
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
    };
    return (
        <React.Fragment>
            {drawerIsOpen && <Backdrop onClick={closeDrawer}/>}
            <SideDrawer show={drawerIsOpen} onClick={closeDrawer}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>
            </SideDrawer>
            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={openDrawer}>
                    <span />
                    <span />
                    <span />
                </button>
                <div className="main-navigation__logo"><Link to='/'><img src={logo} alt="Logo" /></Link></div>
                <nav className="main-navigation__header-nav">
                    <NavLinks uImg={userImg}/>
                </nav>
            </MainHeader>
        </React.Fragment>
    );
};

export default MainNavigation;