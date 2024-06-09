/**
 * This component is used in the List a Room component
 * We call to support setting up the line address and
 * automatically fill up the City / State / Zip / Country
 * This ensures the user is entering a valid address that propagates
 * properly across our database and helps performing a proper database search
 */

 import React from "react";
 import Autocomplete from "react-google-autocomplete";
 import { SiteData } from "../../context/SiteWrapper";
 import '../../styles/AutocompleteSearchBar.css'
 import { useRouter } from 'next/navigation';
 import { useState, useEffect } from "react";
 import SnackBarAlert from "../alerts/SnackBarAlerts";
 import StaticFrontendLabel from "../../StaticFrontend";

const AutocompleteInput = () => {
  //@ts-ignore
  const { isMobile, setSearchResults, setSearchClick, userSearchType, searchValue, setSearchValue, setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity, snackbarMessage, snackbarOpen, snackbarSeverity, roomListingData, setRoomListingData } = SiteData();
  const [searchCount, setSearchCount] = useState(0);
  const MAX_ALLOWED_BACKEND_CALLS_PER_MINUTE = StaticFrontendLabel.MAX_ALLOWED_BACKEND_CALLS_PER_MINUTE;
const router = useRouter();
const navigateToPage = (path) => {
  router.push(path);
};

  const GOOGLE_MAP_API_KEY = StaticFrontendLabel.GOOGLE_MAP_API_KEY;
  const [isFieldFilled, setIsFieldFilled] = useState(false);
  const AUTOCOMPLETE_SEARCH_MAX_LENGTH = StaticFrontendLabel.AUTOCOMPLETE_SEARCH_MAX_LENGTH;

     //@ts-ignore
  const getAddressComponent = (place, componentType) => {
    //@ts-ignore
    const component = place.address_components.find((component) =>
      component.types.includes(componentType)
    );
    return component ? component.short_name : "";
  };

  //@ts-ignore
  const onPlaceSelected = (place) => {
    let address, rawAddressValue, longitude, latitute,country,zip,city,street,state, locationResolved;

    console.log("Place selected:", place);

    // If the search failed
    if(!place.geometry) {
        locationResolved = 0,
        state = '';
        street = '';
        city = '';
        zip = '';
        country = '';
        latitute = '';
        longitude = '';
        address = place.name; // if nothing matched the api will return whatever the user type place {name: 'the value typed'}
        rawAddressValue = place.name; // if nothing matched the api will return whatever the user type place {name: 'the value typed'}
    } else {
        locationResolved = 1,
        state = getAddressComponent(place, "administrative_area_level_1").trim();
        street = getAddressComponent(place, "route").trim();
        city = getAddressComponent(place, "locality").trim().trim();
        zip = getAddressComponent(place, "postal_code").trim();
        country = getAddressComponent(place, "country").trim();
        latitute = place.geometry.location.lat();
        longitude = place.geometry.location.lng();
        address = place.formatted_address.trim();
        rawAddressValue = place.formatted_address.trim();
    }

    console.log("State: ", state);
    console.log("Country: ", country);
    console.log("Street: ", street);
    console.log("City: ", city);
    console.log("Zip: ", zip);
    console.log("Address: ", address);
    console.log("Latitude: ", latitute);
    console.log("Longitude: ", longitude);
    console.log("Location Resolved: ", locationResolved);
    console.log("Raw Value: ", rawAddressValue);

    setRoomListingData({ 
        address: address,
        city: city,
        zip: zip,
        state: state,
        country: country,
        latitute: latitute,
        longitude: longitude
     });

  };

/**
 * This function is very important
 * Imagine the user typing 01803 which is a true address and then clicking the search button
 * We want the search to trigger with whatever value he selected as raw value
 */
  //@ts-ignore
  const onInputChange = (event) => {
    const value = event.target.value;
      //@ts-ignore
     setIsFieldFilled(!!value.trim()); // Set isFieldFilled to true if value is not empty
  };

     return (
      <div className='input-group'>

      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />

    {/* ------------------------- Search Bar  -------------------------*/}
    <Autocomplete
        className={`form-control search-input-v2 mb-2`}
        apiKey={GOOGLE_MAP_API_KEY}
        onChange={onInputChange}
        onPlaceSelected={onPlaceSelected}
        tcomponentRestrictions={{ country: "us" }}
        options={{
        types: ["geocode", "establishment"],
        }}
        placeholder="Enter an address, city, street, state or ZIP code"
        maxLength={AUTOCOMPLETE_SEARCH_MAX_LENGTH}
    />
      </div>
  );
}

export default AutocompleteInput;