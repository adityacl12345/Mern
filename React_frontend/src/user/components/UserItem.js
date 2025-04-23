import React from "react";
import { Link } from "react-router-dom";

import './UserItem.css';
import Avatar from "../../shared/components/UIElements/Avatar";

const UserItem = props => {
    return (
        <li className="user-item">
            <Link to={`/${props.id}/places`} className="user-item__content">
                    <div className="user-item__image">
                        <Avatar image={`${process.env.REACT_APP_ASSETS_URL}/${props.image}`} alt={props.name} />
                    </div>
                    <div className="user-item__info">
                        <h4>{props.name}</h4>
                        <h5>{props.placeCount}{props.placeCount === 1? " place": " places"}</h5>
                    </div>
            </Link>
        </li>
    );
};

export default UserItem;
