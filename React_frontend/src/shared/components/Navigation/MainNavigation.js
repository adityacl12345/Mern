import React, { useState } from "react";
import { Link } from "react-router-dom";

import './MainNavigation.css';
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import logo from "../../../assets/logo.png";


const MainNavigation = props => {
    const [drawerIsOpen, setDrawerOpen] = useState(false);

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
                    <NavLinks />
                </nav>
            </MainHeader>
        </React.Fragment>
    );
};

export default MainNavigation;