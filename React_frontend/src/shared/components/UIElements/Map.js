import React, { useEffect, useRef } from "react";

import './Map.css';

const Map = props => {
    const mapRef = useRef();

    const { center, zoom } = props;

    useEffect(() => {
        const map = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: zoom
        });
    
        new window.google.maps.Marker({position: center, map: map});
    }, [center, zoom]);

    return <div ref={mapRef} className={`map ${props.className}`}></div>;
};

export default Map;