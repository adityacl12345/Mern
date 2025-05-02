import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

import './NavDropDown.css';

const NavDropDown = props => {
    const auth = useContext(AuthContext);
    const [isOpen, setIsOpen ] = useState(false);
    const dropdownRef = useRef();

     // Close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            };
            document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="nav-dropdown" ref={dropdownRef}>
            <span
                role="button"
                aria-label="down-arrow"
                onMouseEnter={() => setIsOpen((prev) => !prev)}
            >{!isOpen ? '▼' : '▲'}</span>
            {isOpen && (
                <ul className="nav-dropdown-menu">
                    <li><Link to={`/user/${props.userId}`}>My Profile</Link></li>
                    <li><Link to={`/${props.userId}/places`}>My Places</Link></li>
                    <li><Link to="/places/new">Add a Place</Link></li>
                    <li><span onClick={auth.logout}>Log Out</span></li>
                </ul>
            )}
        </div>
    );
}

export default NavDropDown