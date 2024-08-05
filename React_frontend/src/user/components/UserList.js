import React from "react";

import './UsersList.css';
import UserItem from "./UserItem";

const UserList = props => {
    if(props.items.length === 0) {
        return <h2>No users found!</h2>
    }

    return <ul className="users-list">
        {props.items.map(user => (
            <UserItem key={user.id} id={user.id} placeCount={user.places.length} name={user.name} image={user.image} />
        ))}
    </ul>;
};

export default UserList;