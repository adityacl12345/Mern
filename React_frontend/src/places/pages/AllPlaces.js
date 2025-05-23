import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const AllPlaces = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState();
    useEffect(() => {
      const fetchPlaces = async () => {
        try {
          const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places`);
          setLoadedPlaces(responseData.places);
        } catch(err) {
          console.log(err);
        }
      };
      fetchPlaces(); 
    }, [sendRequest]);

    const placeDelHandler = (deletedPlaceId) => {
      setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId));
    }
    return (
      <React.Fragment>
        {isLoading && <div className="center"><LoadingSpinner /></div>}
        <ErrorModal error={error} onClear={clearError} />
        {!isLoading && loadedPlaces && <div className="place-list-container">
          <PlaceList items={loadedPlaces} onDeletePlace={placeDelHandler}/>
        </div>}
      </React.Fragment>
    );
};

export default AllPlaces;