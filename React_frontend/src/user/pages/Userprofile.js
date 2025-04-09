import React, { useEffect, useState } from "react";

import './Userprofile.css';
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

const Userprofile = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedUser, setLoadedUser] = useState();
    const [loadedPlaces, setLoadedPlaces] = useState();
    const uid = useParams().uid;
    useEffect(() => {
        const fetchUser = async () => {
        try {
            const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/users/${uid}`);
            setLoadedUser(responseData.user);
        } catch(err) {
            console.log(err);
        }
        };
        fetchUser(); 
    }, [sendRequest, uid]);

    useEffect(() => {
        const fetchPlaces = async () => {
        try {
            const data = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places/user/${uid}`);
            setLoadedPlaces(data.places);
        } catch(err) {
            console.log(err);
        }
        };
        fetchPlaces(); 
    }, [sendRequest, uid]);

    if (!loadedUser) return <p>Loading...</p>;

    return (
        <React.Fragment>
            {isLoading && <div className="center"><LoadingSpinner /></div>}
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedUser && <div className="user-profile-container">
                <Card>
                    <div className="user-profile flex">
                        <Avatar image={`${process.env.REACT_APP_ASSETS_URL}/${loadedUser.image}`} alt={loadedUser.name} />
                        <div className="user-data">
                            <h2>{loadedUser.name}</h2>
                            <p><strong>Email:</strong> {loadedUser.email}</p>
                        </div>
                    </div>
                    <hr></hr>
                    <h3>Places Visited</h3>
                    <div className="user-places flex">
                        {loadedPlaces?.map((place) => (
                        <Card key={place._id} className="place-card">
                            <Link to={`/place/${place._id}`}>
                                <Avatar image={`${process.env.REACT_APP_ASSETS_URL}/${place.image}`} alt={place.title} />
                                <div className="place-data">
                                    <strong>{place.title}</strong>
                                    <p>{place.desc}</p>
                                </div>
                            </Link>
                        </Card>
                        ))}
                    </div>
                </Card>
            </div>}
        </React.Fragment>
  );
};

export default Userprofile;