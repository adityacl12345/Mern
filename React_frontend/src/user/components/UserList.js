import React from "react";

import './UsersList.css';
import UserItem from "./UserItem";
import ItemCarousel from "../../shared/components/UIElements/ItemCarousel";

const UserList = props => {
    if(props.items.length === 0) {
        return <h2>No users found!</h2>
    }

    const userItems = props.items?.map(user => (
        <UserItem key={user.id} user={user} />
    ));

    return (
        <ItemCarousel items={userItems} />
    );
};

export default UserList;