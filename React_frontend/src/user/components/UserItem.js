import React from "react";
import { Link } from "react-router-dom";

import './UserItem.css';

const UserItem = props => {
    return (
        <li className="user-item">
            <Link to={`/user/${props.user.id}`} className="user-item__content">
                    <div className="user-item__image">
                        <img src={`${process.env.REACT_APP_ASSETS_URL}/${props.user.image}`} alt={props.user.name} />
                    </div>
                    <div className="user-item__info">
                        <h4>{props.user.name}</h4>
                        <h5>{props.user.places.length}{props.user.places.length === 1? " place": " places"}</h5>
                    </div>
            </Link>
        </li>
    );
};

export default UserItem;
