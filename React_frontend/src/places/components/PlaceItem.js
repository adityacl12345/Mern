import React, { useContext, useState } from "react";

import './PlaceItem.css';
import Button from "../../shared/components/FormElements/Button"
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import AverageRating from "../../shared/components/UIElements/AverageRating";

const PlaceItem = props => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [showMap, setShowMap] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const openMap = () => setShowMap(true);
    const closeMap = () => setShowMap(false);
    const openConfirm = () => setShowConfirm(true);
    const cancelConfirm = () => setShowConfirm(false);
    const deleteConfirm = async () => {
        try {
            await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`, 'DELETE', null, {
                Authorization: 'Bearer ' + auth.token
            });
            props.onDelete(props.id);
        } catch(err) {
            console.log(err);
        }
    }

    //================================================
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap} 
                onCancel={closeMap} 
                header={props.title} 
                contentClass="place-item__modal-content" 
                footerClass="place-item__modal-actions" 
                footer = {<Button onClick={closeMap}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map center={props.coords} zoom={16}/>
                </div>
            </Modal>
            <Modal
                show={showConfirm}
                onCancel={cancelConfirm}
                contentClass="place-item__modal-content"
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={(
                    <React.Fragment>
                        <Button inverse onClick={cancelConfirm}>Cancel</Button>
                        <Button danger onClick={deleteConfirm}>Delete</Button>
                    </React.Fragment>
                )}
            >
                <p>Do you really want to delete? The actions cannot be undone!</p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    {isLoading && <div className="center"><LoadingSpinner /></div>}
                    <div className="place-item__image">
                        <img src={`${process.env.REACT_APP_ASSETS_URL}${props.image}`} alt={props.title}/>
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h5>{props.address}</h5>
                        <AverageRating averageRating={props.averageRating}></AverageRating>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMap}>View on Map</Button>
                        <Button to={`/place/${props.id}`}>Details</Button>
                        {auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
                        {auth.userId === props.creatorId && <Button danger onClick={openConfirm}>DELETE</Button>}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
};

export default PlaceItem;