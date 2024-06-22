"use client";

import React, { useRef } from "react";
import Autocomplete from "react-google-autocomplete";
import { SiteData } from "../../context/SiteWrapper";
import EastIcon from "@mui/icons-material/East";
import LocationOnIcon from "@mui/icons-material/LocationOn";
// import BackendAxios from "../../backend/BackendAxios";
import '../../styles/AutocompleteSearchBar.css'
import '../../styles/HomeSearchBar.css'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import SnackBarAlert from "../alerts/SnackBarAlerts";
import StaticFrontendLabel from "@/StaticFrontend";

/**
 * The searchRouter component argument is required as it defines
 * how this search bar will behave
 * if searchRouter = userProfile the /search will search for userProfile table
 * if searchRouter = roomListings the /search will search for roomListings table
 */
 
//@ts-ignore
const AutocompleteSearchBar = ({ searchRouter, nextPage, profileType }) => {
  //@ts-ignore
  const { isMobile, setSearchResults, searchValue, userInfo, userAuth, setSearchValue, setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity, snackbarMessage, snackbarOpen, snackbarSeverity, tenantFilters, setTenantFilters, minPriceFilter, maxPriceFilter, moveInDate, booleanFilter } = SiteData();
  const [searchCount, setSearchCount] = useState(0);
  const MAX_ALLOWED_BACKEND_CALLS_PER_MINUTE = StaticFrontendLabel.MAX_ALLOWED_BACKEND_CALLS_PER_MINUTE;
  const GOOGLE_MAP_API_KEY = StaticFrontendLabel.GOOGLE_MAP_API_KEY;
  const [isFieldFilled, setIsFieldFilled] = useState(false);
  const AUTOCOMPLETE_SEARCH_MAX_LENGTH = StaticFrontendLabel.AUTOCOMPLETE_SEARCH_MAX_LENGTH;
  
  const searchInputRef = useRef(null);

  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };

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

    console.log("Place selected:", place);
    let address, rawAddressValue, longitude, latitute,country,zip,city,street,state, locationResolved;

    // If the search failed
    if (!place || !place.geometry) {
        locationResolved = 0,
        state = '';
        street = '';
        city = '';
        zip = '';
        country = '';
        latitute = '';
        longitude = '';
        address = place?.name || ''; // check if place and place.name are defined
        rawAddressValue = place?.name || ''; // check if place and place.name are defined
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

    setSearchValue({
        rawAddressValue: rawAddressValue,
        locationResolved: locationResolved,
        zip: zip,
        city: city,
        state: state,
        country: country,
        address: address,
        street: street
      });

  };

/**
 * This function is very important
 * Imaging the user typing 01803 which is a true address and then clicking the search button
 * We want the search to trigger with whatever value he selected as raw value
 */
  //@ts-ignore
  const onInputChange = (event) => {
    const value = event.target.value;
      //@ts-ignore
    setSearchValue((prevSearchValue) => ({
      ...prevSearchValue,
      rawAddressValue: value,
      locationResolved: 0,
      zip: '',
      city: '',
      state: '',
      country: '',
      address: value,
      street: ''
    }));

     setIsFieldFilled(!!value.trim()); // Set isFieldFilled to true if value is not empty

  };

    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        // Prevent the default form submission
        event.preventDefault();

        setSearchValue((prevSearchValue) => ({
          ...prevSearchValue,
          rawAddressValue: event.target.value,
          locationResolved: 0,
          zip: '',
          city: '',
          state: '',
          country: '',
          address: event.target.value,
          street: ''
        }));
    
        setIsFieldFilled(!!event.target.value.trim());

        console.log("searchValue : " , searchValue );

        // Call handleSearch after updating the search value
        handleSearch(event);
      }
    };


  // @ts-ignore
const handleSearch = async (e) => {
  e.preventDefault(); // Prevents the form from submitting (reloading the page)

  console.log(`Search Value before API call: >${searchValue.rawAddressValue}<`);

  // Check if the field is filled before proceeding
  if (!isFieldFilled) {
    setSnackbarMessage("Seach is empty");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
    return;
  }

  // Rate Limiting: Check if search count exceeds 15 within 1 minute
  if (searchCount >= MAX_ALLOWED_BACKEND_CALLS_PER_MINUTE) {
    console.log(  `Search limit reached limit ${MAX_ALLOWED_BACKEND_CALLS_PER_MINUTE}. Please wait before searching again.` );
    setSnackbarMessage( `Search limit reached limit ${MAX_ALLOWED_BACKEND_CALLS_PER_MINUTE}. Please wait before searching again.` );
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
    return;
  }

  console.log( `############## Searching with value: >${searchValue.rawAddressValue}<`);
  console.log('searchRouter: ' , searchRouter);
  
  let requestedData;

  if(searchRouter == '/searchListings') {
    requestedData = { searchValue, minPriceFilter, maxPriceFilter, moveInDate, booleanFilter, profileType };

  } else if(searchRouter == '/searchProfile'){
    requestedData = { searchValue, tenantFilters, profileType };
  }

  if(userAuth) {
    // if the user is authenticated send the user info as well
    //@ts-ignore
    requestedData = { ...requestedData, userInfo };
  }

  try {
    console.log('frontend requestedData: ' , requestedData)
    const response = await fetch(`/api/${searchRouter}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestedData),
      cache: 'no-store'
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
  
    const data = await response.json();
    setSearchCount((prevCount) => prevCount + 1); // Increment search count

    if (response.status === 200) {
      setSearchResults(data);
      console.log("The search returned results of count: ", data.length);
      console.log("The search returned object: ", data);
    } else {
      console.log("Error completing the search: ");

    }
  } catch (error) {
    // Handle the error here
    console.error("Error:", error);
  }

  console.log('Navigating to: ' + nextPage);
  console.log('searchRouter is: ' + searchRouter);
  navigateToPage(nextPage);

  // Reset searchCount after 60 seconds
  // This ensures the search throttleing withn the minute is reset.
  setTimeout(() => {
    setSearchCount(0);
    console.log("Search count reset after 60 seconds.");
  }, 60000); // 60000 milliseconds = 60 seconds
};


const arrowIconStyle = {
  fontSize: isMobile ? 25 : 35,
  color: "var(--roomatee-theme-color)",
};

const locationPinStyle = {
  fontSize: isMobile ? 25 : 30,
  color: "var(--roomatee-theme-color)", // Change the color to your desired color
};

const customAutocompleteItemStyle = {
  padding: "10px",
  fontSize: "16px",
  color: "#333", // Text color
  cursor: "pointer",
  
  "&:hover": {
    backgroundColor: "#c52525",
  },
};


  return (
      <div className='input-group'>

      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />

        {/* ------------------------- Pin Icon  -------------------------*/}
        <span className="input-group-text bg-white">
          <LocationOnIcon style={locationPinStyle} />
        </span>

        {/* ------------------------- Search Bar  -------------------------*/}
        <Autocomplete
          className={`form-control border-start-0 border-end-0 ${isMobile ? 'search-input-mobile' : 'search-input'}` }
          apiKey={GOOGLE_MAP_API_KEY}
          onChange={onInputChange}
          onKeyPress={handleKeyPress}
          value={searchValue.rawAddressValue || ''}
          onPlaceSelected={onPlaceSelected}
          tcomponentRestrictions={{ country: "us" }}
          options={{
            types: ["(cities)"],
          }}
          placeholder="Search by cities"
          // autoCompleteItem={customAutocompleteItemStyle} // Apply custom styles to autocomplete items
          maxLength={AUTOCOMPLETE_SEARCH_MAX_LENGTH}
        />

        {/* ------------------------- Arrow Clickable button ->  -------------------------*/}
        <button className="search-btn" type="submit" onClick={handleSearch} >
          <EastIcon style={arrowIconStyle}/>
        </button>
      </div>
  );
};

export default AutocompleteSearchBar;
