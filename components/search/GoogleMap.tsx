import React, { useState, useRef, useEffect } from 'react';
import { SiteData } from "../../context/SiteWrapper";
import StaticFrontendLabel from "../../StaticFrontend";

//@ts-ignore
const GoogleMap = ({ mapHeight }) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const GOOGLE_MAP_API_KEY = StaticFrontendLabel.GOOGLE_MAP_API_KEY;
  //@ts-ignore
  const { latitude, longitude, mapAddress } = SiteData();
  const [mapMarkers, setMapMarkers] = useState([]);

  useEffect(() => {
    const loadMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      document.body.appendChild(script);

      //@ts-ignore
      window.initMap = () => {
        let centerCoordinates;
        if (latitude && longitude) {
          centerCoordinates = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
        } else if (mapAddress) {
          centerCoordinates = { lat: parseFloat(mapAddress.latitude), lng: parseFloat(mapAddress.longitude) };
        } else {
          // Default to Boston coordinates if neither latitude/longitude nor mapAddress is provided
          centerCoordinates = { lat: 42.3601, lng: -71.0589 };
        }

        //@ts-ignore
        const googleMap = new window.google.maps.Map(mapContainer.current, {
          center: centerCoordinates,
          zoom: 15,
        });

        setMap(googleMap);
      };
    };

    loadMapScript();

    return () => {
      if (map) {
        setMap(null); // Clean up map to prevent memory leaks
      }
    };
  }, [latitude, longitude, mapAddress]);

  useEffect(() => {
    if (map) {
      mapMarkers.forEach(marker => {
        //@ts-ignore
        marker.setMap(null);
      });
  
      //@ts-ignore
      const targetMarker = new window.google.maps.Marker({
        position: latitude && longitude ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : (mapAddress ? { lat: parseFloat(mapAddress.latitude), lng: parseFloat(mapAddress.longitude) } : { lat: 42.3601, lng: -71.0589 }), // Boston coordinates
        map: map,
        title: mapAddress?.address || '', // Use the resolved address if available
      });
  
      //@ts-ignore
      map.setCenter(latitude && longitude ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : (mapAddress ? { lat: parseFloat(mapAddress.latitude), lng: parseFloat(mapAddress.longitude) } : { lat: 42.3601, lng: -71.0589 })); // Boston coordinates
  
      //@ts-ignore
      setMapMarkers([targetMarker]);
    }
  }, [map, latitude, longitude, mapAddress]);

  return (
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: mapHeight,
          border: '1px solid #ccc',
          marginBottom: '20px', // Use camelCase for CSS properties
        }}
      />
  );
};

export default GoogleMap;
