import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import './MainNavigation.css';
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import logo from "../../../assets/CholBro_logo.png";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import Avatar from "../UIElements/Avatar";
import NavDropDown from "./NavDropDown";
import SearchBar from "../FormElements/SearchBar";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import ErrorModal from "../UIElements/ErrorModal";


const MainNavigation = props => {
    const auth = useContext(AuthContext);
    const uid = auth.userId;
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [drawerIsOpen, setDrawerOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userImg, setUserImg] = useState(null);
    const history = useHistory();
    
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

    const handlePlaceSelect = (place) => {
        history.push(`/place/${place.id}`);
        setSearchOpen(false);
    };
    const handleOpenSearch = () => {
        setSearchOpen(true);
    };

    const handleCloseSearch = () => {
        setSearchOpen(false);
    };

    const openDrawer = () => {
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
    };
    return (
        <React.Fragment>
            {isLoading && <div className="center"><LoadingSpinner /></div>}
            <ErrorModal error={error} onClear={clearError} />
            {drawerIsOpen && <Backdrop onClick={closeDrawer}/>}
            <SideDrawer show={drawerIsOpen} onClick={closeDrawer}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks userImg={userImg}/>
                </nav>
            </SideDrawer>
            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={openDrawer}>
                    <span />
                    <span />
                    <span />
                </button>
                <div className="main-navigation__logo small-screen">
                    <Link to='/'><img src={logo} alt="Logo" />
                    </Link>
                </div>
                <nav className="main-navigation__header-nav">
                    <NavLinks userImg={userImg} />
                </nav>
                {searchOpen && <SearchBar onSelect={handlePlaceSelect}></SearchBar>}
                {!searchOpen && <span className="icon search-icon" onClick={handleOpenSearch}></span>}
                {searchOpen && <span className="icon close-icon" onClick={handleCloseSearch}></span>}
                {!auth.isLoggedIn && (<div className="main-navigation__user">
                    <Avatar image={`${process.env.REACT_APP_ASSETS_URL}/uploads/images/Default.png`} alt="Image"/>
                </div>
                )}
                {auth.isLoggedIn && (
                    <div className="main-navigation__user">
                        <Avatar image={`${process.env.REACT_APP_ASSETS_URL}/${userImg}`} alt="Image"/>
                        <NavDropDown userId={uid}></NavDropDown> 
                    </div>
                )}
            </MainHeader>
        </React.Fragment>
    );
};

export default MainNavigation;