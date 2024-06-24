"use client";

import React from "react";
import { useState, useEffect } from "react";
import { SiteData } from "../../context/SiteWrapper";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Slider from "@mui/material/Slider";
import dayjs from "dayjs";
import Autocomplete from "react-google-autocomplete";
import { useRouter } from 'next/navigation';
import StaticFrontendLabel from "../../StaticFrontend";
import BackToResultsBtn from "../modals/BackToResultsBtn";
import '../../styles/Signup.css'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

  //@ts-ignore
function valuetext(value) {
  return `${value}°C`;
}

//@ts-ignore
const EditRoomListing = () => {
  // @ts-ignore
  const { isMobile, isTablet, editListingId, listing, setListingsCreated, userInfo, scrollToTop, setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity, snackbarMessage, snackbarOpen, snackbarSeverity } = SiteData();

  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if the user navigated to Component 2 properly
      const navigatedToEditListing = localStorage.getItem('navigatedToEditListing');

      if (!navigatedToEditListing) {
        // If the flag is not set, redirect to Component 1
        navigateToPage('/my-listings');
      } else {
        // Remove the flag to handle refresh
        localStorage.removeItem('navigatedToEditListing');
      }
    }, 0); // A delay of 0ms ensures this runs after the component is fully rendered

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);



  // We are using this id to filter om the array listing that
  // we are getting from the useContext
  // We filter filter based on the id that matches
  // this will be added in the new variable roomListing which can be used across this entire component.
  console.log('I am in EditRoomLosting.tsx and the value of listing: ' , listing);
  const roomListing = listing.find(
    // @ts-ignore
    (roomListing) => roomListing.id.toString() == editListingId
  );

  // Add a condition to handle null or undefined roomListing
if (!roomListing) {
  // Return a default value or handle the null case here
  return <p>No listing found.</p>;
}

  console.log('listing: ' , listing);
  console.log('The value for editListingId: ' , editListingId);
  console.log('roomListing : ' , roomListing);

  const [isValidAddress, setIsValidAddress] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isFormEdited, setIsFormEdited] = useState(false);
  const GOOGLE_MAP_API_KEY = StaticFrontendLabel.GOOGLE_MAP_API_KEY;
  const NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH = StaticFrontendLabel.NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH;
  const [isFieldFilled, setIsFieldFilled] = useState(false);
  //@ts-ignore
  const onInputChange = (event) => {
    const value = event.target.value;
    setAddress(value);
      //@ts-ignore
     setIsFieldFilled(!!value.trim()); // Set isFieldFilled to true if value is not empty
    
    };


    
  //@ts-ignore
  const handleMoveInDate = (selectedDate) => {
    // Convert epoch timestamp to Date object
    const date = new Date(selectedDate);

    // Format the date as YYYY-MM-DD
    const formattedDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    console.log(
      "The user changed the move-in date price filter to: " + formattedDate
    );

    setRoomListingData({ ...roomListingData, moveInDate: formattedDate });
  };

  // this function ensure we are capture a least a single edit.
  // if 1 or more edits happened the button will be clickable to submit
  const handleInputChange = () => {
    setIsFormEdited(true);
  };

  const showUpdateStatus = () => {
    // Show the notification after the action is completed
    setShowNotification(true);

    // Hide the notification after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };


  const [isWheelChairAccessibleChecked, setWheelChairAccessibleChecked] = useState(Boolean(roomListing?.wheelChairAccessibility));
  const [isPrivateParkingAvailableChecked, setPrivateParkingAvailableChecked] = useState(Boolean(roomListing?.privateParking));
  const [isPublicParkingAvailableChecked, setPublicParkingAvailableChecked] = useState(roomListing?.publicParking);
  const [isPetFriendlyChecked, setPetFriendlyChecked] = useState( Boolean(roomListing?.petFriendly));
  const [isPrivateBathroomChecked, setPrivateBathroomChecked] = useState(roomListing?.privateBathroom);
  const [isWasherChecked, setWasherChecked] = useState(roomListing?.washer);
  const [isDryerChecked, setDryerChecked] = useState(roomListing?.dryer);
  const [isRefrigeratorChecked, setRefrigeratorChecked] = useState(roomListing?.refrigerator);
  const [isDishWasherChecked, setDishWasherChecked] = useState(roomListing?.dishWasher);
  const [isInternetConnectionChecked, setInternetConnectionChecked] = useState(roomListing?.internetConnection);
  const [isMicorwaveChecked, setMicorwaveChecked] = useState(roomListing?.microwave);
  const [isSmokingChecked, setSmokingAllowed] = useState(roomListing?.smokingAllowed);
  const [isFurnishedChecked, setFurnishedChecked] = useState(roomListing?.furnished);
  const [isTelevisionChecked, setTelevisionChecked] = useState(roomListing?.television);
  const [isAirConditionningChecked, setAirConditionningChecked] = useState(roomListing?.airConditionning);
  const [isHeatingChecked, setHeatingChecked] = useState(roomListing?.heating);
  const [isFireplaceChecked, setFireplaceChecked] = useState(roomListing?.fireplace);
  const [isSmokeAlarmChecked, setSmokeAlarmChecked] = useState(roomListing?.smokeAlarm);
  const [isDishesChecked, setDishesChecked] = useState(roomListing?.dishes);
  const [isToasterChecked, setToasterChecked] = useState(roomListing?.toaster);
  const [isCoffeeMakerChecked, setCoffeeMakerChecked] = useState(roomListing?.coffeeMaker);
  const [genderPreference, setGenderPreference] = useState(roomListing?.genderPreference || '');
  const [agePreference, setAgePreference] = useState(roomListing?.agePreference || '');
  const [minAge, setMinAge] = useState(roomListing?.minAge || '18');
  const [maxAge, setMaxAge] = useState(roomListing?.maxAge || '99');
  const [address, setAddress] = useState(roomListing?.address || '');
  const [city, setCity] = useState(roomListing?.city || '');
  const [state, setState] = useState(roomListing?.state || '');
  const [country, setCountry] = useState(roomListing?.country || '');
  const [zip, setZip] = useState(roomListing?.zip || '');
  const [floor, setFloor] = useState(roomListing?.floor || '');
  const [description, setDescription] = useState(roomListing?.description || '');
  const [listingType, setListingType] = useState(roomListing?.listingType || '');
  const [bedSize, setBedSize] = useState(roomListing?.bedSize || '');
  const [longitude, setLongitude] = useState(roomListing?.longitude || '');
  const [latitude, setLatitude] = useState(roomListing?.latitude || '');
  const [price, setPrice] = useState(roomListing?.price || '');
  const [moveInDate, setMoveInDate] = useState(roomListing?.moveInDate.split("T")[0] || '');
  const [leaseDurationInMonth, setLeaseDurationInMonth] = useState(roomListing?.leaseDurationInMonth || '');
  const [userProfileId, setUserProfileId] = useState(roomListing?.userProfileId || '');

  const [roomListingData, setRoomListingData] = useState({
    id: editListingId,
    userProfileId: userProfileId,
    listingType: listingType,
    price: price,
    moveInDate: moveInDate,
    leaseDurationInMonth: leaseDurationInMonth,
    address: address,
    country: country,
    city: city,
    state: state,
    zip: zip,
    longitude: longitude,
    latitude: latitude,
    privateBathroom: isPrivateBathroomChecked,
    privateParking: isPrivateParkingAvailableChecked,
    publicParking: isPublicParkingAvailableChecked,
    internetConnection: isInternetConnectionChecked,
    washer: isWasherChecked,
    dryer: isDryerChecked,
    dishWasher: isDishWasherChecked,
    wheelChairAccessibility: isWheelChairAccessibleChecked,
    floor: floor,
    petFriendly: isPetFriendlyChecked,
    refrigerator: isRefrigeratorChecked,
    microwave: isMicorwaveChecked,
    genderPreference: genderPreference,
    agePreference: agePreference,
    minAge: minAge,
    maxAge: maxAge,
    smokingAllowed: isSmokingChecked,
    furnished: isFurnishedChecked,
    television: isTelevisionChecked,
    airConditionning: isAirConditionningChecked,
    heating: isHeatingChecked,
    fireplace: isFireplaceChecked,
    smokeAlarm: isSmokeAlarmChecked,
    dishes: isDishesChecked,
    toaster: isToasterChecked,
    coffeeMaker: isCoffeeMakerChecked,
    bedSize: bedSize,
    pictures: [],
    description: description,
  });

  const [selectedAddress, setSelectedAddress] = useState(roomListing?.address || "");

  // @ts-ignore
  const handleCheckboxChange = (checkboxNumber) => {
    switch (checkboxNumber) {
      case 1:
        setWheelChairAccessibleChecked((prevValue) => !prevValue);
        break;
      case 2:
        setPrivateParkingAvailableChecked((prevValue) => !prevValue);
        break;
      case 3:
        setPetFriendlyChecked((prevValue) => !prevValue);
        break;
      case 4:
        // @ts-ignore
        setPrivateBathroomChecked((prevValue) => !prevValue);
        break;
      case 5:
        // @ts-ignore
        setWasherChecked((prevValue) => !prevValue);
        break;
      case 6:
        // @ts-ignore
        setDryerChecked((prevValue) => !prevValue);
        break;
      case 7:
        // @ts-ignore
        setRefrigeratorChecked((prevValue) => !prevValue);
        break;
      case 8:
        // @ts-ignore
        setDishWasherChecked((prevValue) => !prevValue);
        break;
      case 9:
        // @ts-ignore
        setInternetConnectionChecked((prevValue) => !prevValue);
        break;
      case 10:
        // @ts-ignore
        setPublicParkingAvailableChecked((prevValue) => !prevValue);
        break;
      case 11:
        // @ts-ignore
        setMicorwaveChecked((prevValue) => !prevValue);
        break;
      case 12:
        // @ts-ignore
        setSmokingAllowed((prevValue) => !prevValue);
        break;
      case 13:
        // @ts-ignore
        setFurnishedChecked((prevValue) => !prevValue);
        break;
      case 14:
        // @ts-ignore
        setTelevisionChecked((prevValue) => !prevValue);
        break;
      case 15:
        // @ts-ignore
        setAirConditionningChecked((prevValue) => !prevValue);
        break;
      case 16:
        // @ts-ignore
        setHeatingChecked((prevValue) => !prevValue);
        break;
      case 17:
        // @ts-ignore
        setFireplaceChecked((prevValue) => !prevValue);
        break;
      case 18:
        // @ts-ignore
        setSmokeAlarmChecked((prevValue) => !prevValue);
        break;
      case 19:
        // @ts-ignore
        setDishesChecked((prevValue) => !prevValue);
        break;
      case 20:
        // @ts-ignore
        setToasterChecked((prevValue) => !prevValue);
        break;
      case 21:
        // @ts-ignore
        setCoffeeMakerChecked((prevValue) => !prevValue);
        break;
    }
  };
  useEffect(() => {
    // Reset the form edit status when the form is submitted
    if (showNotification) {
      setIsFormEdited(false);
    }
  }, [showNotification]);

  useEffect(() => {
    // Helper function to convert 1 or 0 to true or false
    // @ts-ignore
    const convertToBoolean = (value) => {
      return value == 1 ? true : false;
    };

    // Update the state with the new values
    setRoomListingData((prevData) => ({
      ...prevData,
      listingType: listingType,
      price: price,
      moveInDate: moveInDate,
      leaseDurationInMonth: leaseDurationInMonth,
      address: address,
      city: city,
      state: state,
      zip: zip,
      country: country,
      longitude: longitude,
      latitude: latitude,
      genderPreference: genderPreference,
      agePreference: agePreference,
      minAge: minAge,
      maxAge: maxAge,
      privateBathroom: convertToBoolean(isPrivateBathroomChecked),
      privateParking: convertToBoolean(isPrivateParkingAvailableChecked),
      publicParking: convertToBoolean(isPublicParkingAvailableChecked),
      internetConnection: convertToBoolean(isInternetConnectionChecked),
      washer: convertToBoolean(isWasherChecked),
      dryer: convertToBoolean(isDryerChecked),
      dishWasher: convertToBoolean(isDishWasherChecked),
      wheelChairAccessibility: convertToBoolean(isWheelChairAccessibleChecked),
      floor: floor,
      petFriendly: convertToBoolean(isPetFriendlyChecked),
      refrigerator: convertToBoolean(isRefrigeratorChecked),
      microwave: convertToBoolean(isMicorwaveChecked),
      smokingAllowed: convertToBoolean(isSmokingChecked),
      furnished: convertToBoolean(isFurnishedChecked),
      television: convertToBoolean(isTelevisionChecked),
      airConditionning: convertToBoolean(isAirConditionningChecked),
      heating: convertToBoolean(isHeatingChecked),
      fireplace: convertToBoolean(isFireplaceChecked),
      smokeAlarm: convertToBoolean(isSmokeAlarmChecked),
      dishes: convertToBoolean(isDishesChecked),
      toaster: convertToBoolean(isToasterChecked),
      coffeeMaker: convertToBoolean(isCoffeeMakerChecked),
      bedSize: bedSize,
      description: description,
      //TODO PICTURES
    }));
  }, [
    price,
    moveInDate,
    leaseDurationInMonth,
    address,
    city,
    state,
    zip,
    country,
    longitude,
    latitude,
    genderPreference,
    agePreference,
    minAge,
    maxAge,
    isPrivateBathroomChecked,
    isPrivateParkingAvailableChecked,
    isPublicParkingAvailableChecked,
    isInternetConnectionChecked,
    isWasherChecked,
    isDryerChecked,
    isDishWasherChecked,
    isWheelChairAccessibleChecked,
    floor,
    isPetFriendlyChecked,
    isRefrigeratorChecked,
    isMicorwaveChecked,
    isSmokingChecked,
    isFurnishedChecked,
    isTelevisionChecked,
    isAirConditionningChecked,
    isHeatingChecked,
    isFireplaceChecked,
    isSmokeAlarmChecked,
    isDishesChecked,
    isToasterChecked,
    isCoffeeMakerChecked,
    bedSize,
    description,
  ]);

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
    if (!place.geometry) {
      console.log("Place not found:", place);
      setIsValidAddress(false);
      return;
    }

    setIsValidAddress(true);

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

    setAddress(address);
    setCity(city);
    setState(state);
    setCountry(country);
    setZip(zip);
    setLongitude(longitude);
    setLatitude(latitute);
  };

  // @ts-ignore
  const handleImageChange = (e) => {
    setRoomListingData({ ...roomListingData, pictures: e.target.files });
  };

  const handleEdit = () => {

    if(!isValidAddress) {
      return;
    }

    scrollToTop();

    showUpdateStatus();
    //   // Submit the form and pass the foreign key the user
    //   // id to associate this listing to his personal key id
      // Create a new data object with updated values
      const updatedData = {
        ...roomListingData,
        userProfileId: userInfo.id,
        emailAddress: userInfo.emailAddress,
        id: editListingId,
    };

    // Update the state with the new data
    setRoomListingData(updatedData);

    // this should update the value that the useEffect
    // is dependant on to redender again the listing array
    // @ts-ignore
    setListingsCreated((prevCount) => prevCount + 1);

    console.log("The user clicked on Update Listing");
  };

  // @ts-ignore
  const handleUpdateRoomListing = async (e) => {
    e.preventDefault();
    
    if(!isValidAddress) {
      setSnackbarMessage("Please Double check the address and make sure it matches");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSelectedAddress("");
      return;
    }

    setSelectedAddress("");

    const formData = new FormData();
    for (const key in roomListingData) {
      if (key === "pictures") {
        for (let i = 0; i < roomListingData[key].length; i++) {
          formData.append("pictures", roomListingData[key][i]);
        }
      } else {
        // @ts-ignore
        formData.append(key, roomListingData[key]);
      }
    }

    try {
      console.log(
        "Sending to backend roomListingData value: ",
        roomListingData
      );

      try {
        const response = await fetch("/api/updateRoomListing", {
          method: "POST",
          body: formData, 
          cache: 'no-store'
        });
      
        if (!response.ok) {
          throw new Error('Network response was not ok' + response.statusText);
        }
      
        const data = await response.json();

        if (response.status === 200) {
          console.log("Place listing added successfully");

          // setShowListingCreatedAlert(true);
          // resetInputForm();
          // takeUserToHisListings();
          // scrollToTop();
          // resetRoomListingData(setRoomListingData);
          setSnackbarMessage(data.message);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } else {
          console.error("Error room listing: " + data.message);
          setSnackbarMessage("Error creating place listing");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        // Handle the error here
        console.error("Error:", error);
      }  

      navigateToPage('/my-listings');

    } catch (error) {
      console.log("Error updating the listing: ", error);
      setSnackbarMessage("Error updating room listing" + error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // this is for the slider value
  const [value, setValue] = React.useState([minAge, maxAge]);

  // @ts-ignore
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setRoomListingData({
      ...roomListingData,
      minAge: newValue[0],
      maxAge: newValue[1],
    });
  };


        //@ts-ignore
        const checkAddressValidity = (address) => {
          // Call the Google Maps API to validate the address
          // For simplicity, we'll assume any non-empty address is valid
          setIsValidAddress(!!address);
        };

  useEffect(() => {
    // Check validity of prepopulated address when component mounts
    checkAddressValidity(roomListing.address);
  }, [roomListing.address]);

  const remainingCharacters = NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH - roomListingData.description.length;

      //@ts-ignore
      function returnSectionHeader(headingLabel) {
        return (
          <>
              <h4>{headingLabel}</h4>
              <hr />
          </>
        )
      }

      function returnMoveInDateForListing() {
        const minDate = dayjs().startOf('day'); // Set minDate to today's date
        return (
          <>
            {returnSectionHeader("Move-in Date")}
            <p className="list-a-room-hint">
              Let us when you plan to accept a new tenant to find you a best match!
            </p>
      
            {/* MOVE IN DATE */}
            <div className="mb-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="input-field-width"
                  onChange={handleMoveInDate}
                  slotProps={{ textField: { size: "medium" } }}
                  value={dayjs(moveInDate)}
                  minDate={minDate} // Set minDate to disable selection of past dates
                />
              </LocalizationProvider>
            </div>
          </>
        );
      }
      
      function returnLeaseDuration() {
        return(
          <div className='mb-3'>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Lease Duration</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={leaseDurationInMonth}
                  label="Lease Duration"
                  //@ts-ignore
                  onChange={(e) => {
                    setLeaseDurationInMonth(e.target.value);
                    handleInputChange();
                  }}
                >
                  <MenuItem value={"1"}>1 month</MenuItem>
                  <MenuItem value={"3"}>3 month</MenuItem>
                  <MenuItem value={"6"}>6 month</MenuItem>
                  <MenuItem value={"12"}>12 month</MenuItem>
                  <MenuItem value={"15"}>15 month</MenuItem>
                  <MenuItem value={"18"}>18 month</MenuItem>
                </Select>
              </FormControl>
            </div>
        )
      }

      function displayBackButtonForMobile() {
        if(isMobile || isTablet) {
          return (
            <div className='mr-3 pt-2'>
            <BackToResultsBtn prevPage={"/my-listings"} text={"Back to search results"} />
            </div>
          )
        }
      }

  return (
    <div className="container-fluid">

      <div className="row">
        <div className="col-lg-6 col-sm-12 listing-container">
          <div className={`row ${isMobile ? '' : 'new-listing-section'}`}>
            <form
              id="editListingForm"
              method="post"
              onSubmit={handleUpdateRoomListing}
            >
              <div>
              {displayBackButtonForMobile()}
                <h2 className="create-new-listing-title">
                  Edit Your New Rental Space
                </h2>
                <input
                  type="hidden"
                  id="userProfileId"
                  value={userInfo.id}
                  onChange={(e) => setUserProfileId(e.target.value)}
                />

                {/* ---------------------------------------- ADDRESS ----------------------------------------------------- */}
                {returnSectionHeader('Address')}
                <p className="list-a-room-hint">
                  Boost you potential tenant matching speed with greater ease!
                </p>

                    <Autocomplete
                      value={address}
                      className={`form-control search-input-v2 mb-2`}
                      apiKey={GOOGLE_MAP_API_KEY}
                      onChange={onInputChange}
                      onPlaceSelected={onPlaceSelected}
                      tcomponentRestrictions={{ country: "us" }}
                      options={{
                      types: ["geocode", "establishment"],
                      }}
                      placeholder="Enter an address, city, street, state or ZIP code"
                  />

                {/* FLOOR */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    value={floor}
                    required
                    className="form-control"
                    id="floor"
                    placeholder="Floor"
                    onChange={(e) => {
                      setFloor(e.target.value);
                      handleInputChange();
                    }}
                  />
                  <label htmlFor="floor">Floor</label>
                </div>

                {/* ---------------------------------------- Place Description ----------------------------------------------------- */}
                {returnSectionHeader('Housing Description')}
                {/* Room description */}
                <p className="list-a-room-hint">
                  Give us a description of this property. This info will show on
                  the headline of the listing!
                </p>
                <div className="mb-3">
                <label className='remaining-characters-style'>Remaining Characters: {remainingCharacters}</label>
                  <textarea
                    className="form-control"
                    placeholder="Description of place/room"
                    maxLength={NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH}
                    rows={5}
                    value={description}
                    required
                    onChange={(e) => {
                      setDescription(e.target.value);
                      handleInputChange();
                    }}
                  />
                </div>




                {/* LISTING TYPE */}
                <div className='mb-3'>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Housing Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={listingType}
              label="Housing Type"
              onChange={(e) => {
                setListingType(e.target.value);
                handleInputChange();
              }}
            >
              <MenuItem value={"House"}>House</MenuItem>
              <MenuItem value={"Apartment"}>Apartment</MenuItem>
              <MenuItem value={"Bedroom"}>Bedroom</MenuItem>
              <MenuItem value={"Studio"}>Studio</MenuItem>
            </Select>
          </FormControl>
        </div>


                <div className='mb-3'>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select bed size</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={bedSize}
              label="Select bed size"
              onChange={(e) => {
                setBedSize(e.target.value);
                handleInputChange();
              }}
            >
              <MenuItem value={"Small Single"}>Small Single</MenuItem>
              <MenuItem value={"Twin"}>Twin</MenuItem>
              <MenuItem value={"Twin XL"}>Twin XL</MenuItem>
              <MenuItem value={"Queen"}>Queen</MenuItem>
              <MenuItem value={"King"}>King</MenuItem>
              <MenuItem value={"Not Available"}>Not Available</MenuItem>
            </Select>
          </FormControl>
        </div>

                {/* ---------------------------------------- Pricing ----------------------------------------------------- */}
                {returnSectionHeader('Pricing')}

                {/* PRICE */}
                <div className="input-group mb-3 asking-price input-field-width">
                  <input
                    value={price}
                    placeholder="Asking Price"
                    id="price"
                    required
                    maxLength={6}
                    type="text"
                    className="form-control asking-price"
                    aria-label="Amount (to the nearest dollar)"
                    onChange={(e) => {
                      setPrice(e.target.value);
                      handleInputChange();
                    }}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">$</span>
                  </div>
                </div>

                {/* ---------------------------------------- Move-in Date ----------------------------------------------------- */}
                {returnMoveInDateForListing()}

                {/* ---------------------------------------- Lease Duration ----------------------------------------------------- */}
                {returnLeaseDuration()}

                {/* ---------------------------------------- Roommate/Tenant Prefrences ----------------------------------------------------- */}
                <h4 className="pt-4">{returnSectionHeader('Roommate/Tenant Prefrences')}</h4>
                <p className="list-a-room-hint ">
                  Please specify your preferences for your future
                  roommate/tenant.
                </p>

                <div className='mb-3'>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender Preference</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={genderPreference}
              label="Gender Preference"
              onChange={(e) => {
                setGenderPreference(e.target.value);
                handleInputChange();
              }}
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
              <MenuItem value={"X"}>X</MenuItem>
              <MenuItem value={"Any"}>Any</MenuItem>
            </Select>
          </FormControl>
        </div>





                <div
                  className="form-floating mb-3"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  
                  {/* <div className="input-field-width">
                    <select
                      required
                      className="input-dropdown"
                      id="listingType"
                      name="cars"
                      value={agePreference}
                      onChange={(e) => {
                        setAgePreference(e.target.value);
                        handleInputChange();
                      }}
                    >
                      <option value="" disabled selected>
                        Age Preference
                      </option>
                      <option value="Any">Any</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div> */}


                  <div className='mb-3 input-field-width'>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Age Preference</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={agePreference}
                        label="Gender Preference"
                        onChange={(e) => {
                                  setAgePreference(e.target.value);
                                  handleInputChange();
                                }}
                        
                      >
                        <MenuItem value={"Any"}>Any</MenuItem>
                        <MenuItem value={"Custom"}>Custom</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  {/* This is the custom check.
                  IF the age is CUSTOM will display the Age Range and the Slider for Min and Max Age */}
                  {roomListingData.agePreference === "Custom" && (
                    <div className="input-field-width" style={{marginLeft: '40px'}} >
                      <span>Range</span>

                      <Slider
                        getAriaLabel={() => "Age range"}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        min={18}
                        max={99}
                      />
                    </div>
                  )}
                </div>

                {/* ---------------------------------------- Heating and Cooling ----------------------------------------------------- */}
                {returnSectionHeader('Heating and Cooling')}

                {/* Air conditionning */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(15)}
                      type="checkbox"
                      id="airConditionning"
                      checked={isAirConditionningChecked}
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          airConditionning: !isAirConditionningChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Air conditionning</label>
                </div>
                {/* Heating */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(16)}
                      type="checkbox"
                      id="heating"
                      checked={isHeatingChecked}
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          heating: !isHeatingChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Heating</label>
                </div>
                {/* Fireplace */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(17)}
                      type="checkbox"
                      id="fireplace"
                      checked={isFireplaceChecked}
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          fireplace: !isFireplaceChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Fireplace</label>
                </div>

                {/* ---------------------------------------- Home Safety ----------------------------------------------------- */}
                <div className='pt-2'>{returnSectionHeader('Home Safety')}</div>

                {/* Smoke Alarm */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(18)}
                      type="checkbox"
                      id="smokeAlarm"
                      checked={isSmokeAlarmChecked}
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          smokeAlarm: !isSmokeAlarmChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Smoke Alarm</label>
                </div>

                {/* ---------------------------------------- Parking and facilities ----------------------------------------------------- */}
                <div className='pt-2'>{returnSectionHeader('Parking and facilities')}</div>

                {/* WHEEL CHAIR ACCESSIBLE */}

                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="wheelChairAccessibility"
                      onClick={() => handleCheckboxChange(1)}
                      checked={isWheelChairAccessibleChecked}
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          wheelChairAccessibility:
                            !isWheelChairAccessibleChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Wheel Chair Access</label>
                </div>

                {/* PRIVATE PARKING */}
                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="privateParking"
                      checked={isPrivateParkingAvailableChecked}
                      onClick={() => handleCheckboxChange(2)}
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          privateParking: !isPrivateParkingAvailableChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">
                    Private Parking Available
                  </label>
                </div>
                {/* PUBLIC PARKING */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(10)}
                      checked={isPublicParkingAvailableChecked}
                      type="checkbox"
                      id="publicParking"
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          publicParking: !isPublicParkingAvailableChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">
                    Public Parking Available
                  </label>
                </div>
                {/* PET FRIENDLY */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(3)}
                      type="checkbox"
                      id="petFriendly"
                      checked={isPetFriendlyChecked}
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          petFriendly: !isPetFriendlyChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Pet Friendly</label>
                </div>


                {/* ---------------------------------------- KITCHEN ----------------------------------------------------- */}
                <div className='pt-2'>{returnSectionHeader('Kitchen')}</div>

                {/* Dishes and silverware */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(19)}
                      type="checkbox"
                      id="dishes"
                      checked={isDishesChecked}
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          dishes: !isDishesChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Dishes and silverware</label>
                </div>

                {/* REFRIGERATOR */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(7)}
                      checked={isRefrigeratorChecked}
                      type="checkbox"
                      id="refrigerator"
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          refrigerator: !isRefrigeratorChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Refrigerator</label>
                </div>

                {/* MICROWAVE */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(11)}
                      checked={isMicorwaveChecked}
                      type="checkbox"
                      id="microwave"
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          microwave: !isMicorwaveChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Microwave</label>
                </div>

                {/* TOASTER */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(20)}
                      checked={isToasterChecked}
                      type="checkbox"
                      id="toaster"
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          toaster: !isToasterChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Toaster</label>
                </div>
                {/* COFFEE MAKER */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(21)}
                      checked={isCoffeeMakerChecked}
                      type="checkbox"
                      id="coffeeMaker"
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          coffeeMaker: !isCoffeeMakerChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Coffee Maker</label>
                </div>

                {/* ---------------------------------------- AMENATIES ----------------------------------------------------- */}
                <div className='pt-2'>{returnSectionHeader('Amenities')}</div>

                <p className="list-a-room-hint">
                  Tell us more about the room features
                </p>
                {/* FURNISHED */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(13)}
                      type="checkbox"
                      checked={isFurnishedChecked}
                      id="furnished"
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          furnished: !isFurnishedChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Furnished</label>
                </div>

                {/* WASHER */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(5)}
                      type="checkbox"
                      checked={isWasherChecked}
                      id="washer"
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          washer: !isWasherChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Washer</label>
                </div>

                {/* DRYER */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(6)}
                      checked={isDryerChecked}
                      type="checkbox"
                      id="dryer"
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          dryer: !isDryerChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Dryer</label>
                </div>

                {/* DISH WASHER */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(8)}
                      type="checkbox"
                      checked={isDishWasherChecked}
                      id="dishWasher"
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          dishWasher: !isDishWasherChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Dish Washer</label>
                </div>

                {/* INTERNET CONNECTION */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(9)}
                      checked={isInternetConnectionChecked}
                      type="checkbox"
                      id="internetConnection"
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          internetConnection: !isInternetConnectionChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Internet Connection</label>
                </div>

                {/* TELEVISION */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(14)}
                      checked={isTelevisionChecked}
                      type="checkbox"
                      id="television"
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          television: !isTelevisionChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Television</label>
                </div>

                {/* PRIVATE BATHROOM */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(4)}
                      type="checkbox"
                      id="privateBathroom"
                      checked={isPrivateBathroomChecked}
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          privateBathroom: !isPrivateBathroomChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Private Bathroom</label>
                </div>

                {/* SMOKING ALLOWED */}
                <div>
                  <label className="switch">
                    <input
                      onClick={() => handleCheckboxChange(12)}
                      type="checkbox"
                      id="smokingAllowed"
                      checked={isSmokingChecked}
                      onChange={(e) => {
                        setRoomListingData({
                          ...roomListingData,
                          smokingAllowed: !isSmokingChecked,
                        });
                        handleInputChange();
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Smoking Allowed</label>
                </div>
              </div>
           

              {/* ---------------------------------------------- VISUALS ---------------------------------------------- */}
              <div className='pt-2'>{returnSectionHeader('Visuals')}</div>
              <p className="list-a-room-hint">
                Upload pictures to showcase your new rental unit.
              </p>
              
              {/* ---------------------------------------- IMAGES ----------------------------------------------------- */}
              <div>
                <input type="file" multiple onChange={handleImageChange} />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="row submit-button">
                <input
                  type="submit"
                  value="Update Listing!"
                  className={isFormEdited ? "submit-button" : "submit-button-disabled"}
                  onClick={handleEdit}
                  disabled={!isFormEdited}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoomListing;
