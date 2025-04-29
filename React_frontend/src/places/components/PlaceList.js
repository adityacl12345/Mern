import React from "react";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import './PlaceList.css';
import Button from "../../shared/components/FormElements/Button";

const PlaceList = props => {
    if(props.items.length === 0) {
        return (
            <div className="place-list center">
                <Card className="extra-pad">
                    <h2>No places! Add one?</h2>
                    <Button to="/places/new">Add New</Button>
                </Card>
            </div>
        )
    }

    return <ul className="place-list">
        {props.items.map(place => <PlaceItem key={place.id} id={place.id} title={place.title} address={place.address} image={place.images[0]} creatorId={place.creatorId} desc={place.desc} coords={place.location} averageRating={place.averageRating} onDelete={props.onDeletePlace}/>)}
    </ul>
};

export default PlaceList;