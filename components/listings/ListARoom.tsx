"use client";

import React from "react";
import { useState, useEffect } from "react";
import { SiteData } from "../../context/SiteWrapper";
import { useRouter } from 'next/navigation';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Slider from "@mui/material/Slider";
import "../../styles/Listings.css";
import AutocompleteInput from "../modals/AutocompleteInput";
import StaticFrontendLabel from "../../StaticFrontend";
import dayjs from 'dayjs';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
// Define DatePickerPropsWithValidation extending DatePickerProps
//@ts-ignore
interface DatePickerPropsWithValidation extends DatePickerProps<any> {
  error?: boolean;
  helperText?: string;
}

//@ts-ignore
function valuetext(value) {
  return `${value}°C`;
}

const ListARoom = () => {
    // @ts-ignore
  const { isMobile, userAuth, isTablet, setListingsCreated, userInfo, setShowListingCreatedAlert, scrollToTop, roomListingData, setRoomListingData, resetRoomListingData, setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity, snackbarMessage, snackbarOpen, snackbarSeverity } = SiteData();
  const [selectedDate, setSelectedDate] = useState(null);
  const [moveInDateError, setMoveInDateError] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH = StaticFrontendLabel.NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH;
    // this is for the slider value
    const [value, setValue] = React.useState([20, 37]);
  const [booleanFields, setBooleanFields] = useState({
    wheelChairAccessibility: false,
    privateParking: false,
    publicParking: false,
    petFriendly: false,
    privateBathroom: false,
    washer: false,
    dryer: false,
    refrigerator: false,
    dishWasher: false,
    internetConnection: false,
    microwave: false,
    smokingAllowed: false,
    furnished: false,
    television: false,
    airConditionning: false,
    heating: false,
    fireplace: false,
    smokeAlarm: false,
    dishes: false,
    toaster: false,
    coffeeMaker: false,
  });

  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };


  const [selectedAddress, setSelectedAddress] = useState(roomListingData?.address || "");
 

    useEffect(() => {
        if (!userAuth) {
          navigateToPage("/login");
        } else {
        //   setIsHydrated(true);
          console.log('The value of userAuth is: ' + userAuth);
        }
      }, []);

    // const [isHydrated, setIsHydrated] = useState(false);
    // if (!isHydrated) {
    //     return <div>wle</div>; //TODO update to something better!!
    //   }



  

  


  

  useEffect(() => {
    if (roomListingData && roomListingData.address) {
      checkAddressValidity(roomListingData.address);
    }
  }, [roomListingData]);

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
    setMoveInDateError(false); // Reset the error
    setRoomListingData({ ...roomListingData, moveInDate: formattedDate });
  };



  const showUpdateStatus = () => {
    // Show the notification after the action is completed
    setShowListingCreatedAlert(true);

    // Hide the notification after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      setShowListingCreatedAlert(false);
    }, 5000);
  };


  //@ts-ignore
  const handleCheckboxChange = (fieldName) => {
    setBooleanFields((prevFields) => ({
      ...prevFields,
      //@ts-ignore
      [fieldName]: !prevFields[fieldName],
    }));

    //@ts-ignore
    setRoomListingData((prevData) => ({
      ...prevData,
      //@ts-ignore
      [fieldName]: !prevData[fieldName],
    }));
  };

  // @ts-ignore
  const handleImageChange = (e) => {
    setRoomListingData({ ...roomListingData, pictures: e.target.files });
  };

  const resetInputForm = () => {
    // @ts-ignore
    document.getElementById("newListingForm").reset();
  };

  const takeUserToHisListings = () => {
    navigateToPage("/my-listings");
  };

  const handleSubmitNewRoomListing = () => {
    console.log("userInfo:", userInfo);

    // Submit the form and pass the foreign key the user
    // id to associate this listing to his personal key id
    console.log("Appending to roomListingData the userProfileId of value: " + userInfo.id);

    // Create a new data object with updated values
    const updatedData = {
        ...roomListingData,
        userProfileId: userInfo.id,
        emailAddress: userInfo.emailAddress,
    };

    // Update the state with the new data
    setRoomListingData(updatedData);


    // this should update the value that the useEffect
    // is dependant on to redender again the listing array
    // @ts-ignore
    setListingsCreated((prevCount) => prevCount + 1);
  };

/**
 * This function will create the formData which contains the fields
 * and the pictures uploaded by the user. The formData will be sent
 * to the backend for processing and databae insertion.
 */
  const createFormData = (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === "pictures") {
        const pictures = data[key];
        for (let i = 0; i < pictures.length; i++) {
          formData.append("pictures", pictures[i]);
        }
      } else {
        formData.append(key, data[key]);
      }
    }
    return formData;
  };

  // @ts-ignore
  const handleInsertNewRoomListing = async (e) => {
    e.preventDefault();

    if(!isValidAddress) {
      setSnackbarMessage("Please Double check the address and make sure it matches");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSelectedAddress("");
      return;
    }

    setSelectedAddress("");

    console.log("roomListingData" , roomListingData);

    const formData = createFormData(roomListingData);

    // Verify formData contents
    //@ts-ignore
    for (const [key, value] of formData.entries()) {
        console.log(`Key: ${key}, Value: ${value}`);
    }

    try {
        const response = await fetch("/api/createNewRoomListing", {
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

          setShowListingCreatedAlert(true);
          resetInputForm();
          takeUserToHisListings();
          scrollToTop();
          resetRoomListingData(setRoomListingData);
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
  };



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
  


    //@ts-ignore
function returnSectionHeader(headingLabel) {
    return (
      <>
        <h4>{headingLabel}</h4>
        <hr />
      </>
    );
  }

    const remainingCharacters = roomListingData && roomListingData.description
    ? NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH - roomListingData.description.length
    : NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH;

  function returnMoveInDateForListing() {
    const minDate = dayjs().startOf('day'); // Set minDate to today's date

    return (
      <>
        {returnSectionHeader("Move-in Date")}
  
        <p className="list-a-room-hint">
          Let us when you plan to accept a new tenant to find you a best match!
        </p>
  
        <div className="mb-3 ">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="input-field-width"
              onChange={handleMoveInDate}
              slotProps={{ textField: { size: "medium" } }}
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
              value={roomListingData.preferredLeaseTerm}
              label="Lease Duration"
              //@ts-ignore
              onChange={(e) =>
                setRoomListingData({
                  ...roomListingData,
                  leaseDurationInMonth: e.target.value,
                })
              }
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
  function returnBedSizeSection() {
    return(
      <div className='mb-3'>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select bed size</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={roomListingData.preferredLeaseTerm}
              label="Select bed size"
              //@ts-ignore
              onChange={(e) =>
                setRoomListingData({
                  ...roomListingData,
                  bedSize: e.target.value,
                })
              }
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
    )
  }
  function returnHousingTypeSection() {
    return(
      <div className='mb-3'>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Housing Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={roomListingData.listingType}
              label="Housing Type"
              //@ts-ignore
              onChange={(e) =>
                setRoomListingData({
                  ...roomListingData,
                  listingType: e.target.value,
                })
              }
            >
              <MenuItem value={"House"}>House</MenuItem>
              <MenuItem value={"Apartment"}>Apartment</MenuItem>
              <MenuItem value={"Bedroom"}>Bedroom</MenuItem>
              <MenuItem value={"Studio"}>Studio</MenuItem>
            </Select>
          </FormControl>
        </div>
    )
  }

  function returnGenderPreference() {
    return(
      <div className='mb-3'>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender Preference</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={roomListingData.genderPreference}
              label="Gender Preference"
              //@ts-ignore
              onChange={(e) =>
                setRoomListingData({
                  ...roomListingData,
                  genderPreference: e.target.value,
                })
              }
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
              <MenuItem value={"X"}>X</MenuItem>
              <MenuItem value={"Any"}>Any</MenuItem>
            </Select>
          </FormControl>
        </div>
    )
  }
                  
  function returnAgePreference() {
    return(
      <div className='mb-3 input-field-width'>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age Preference</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={roomListingData.agePreference}
              label="Gender Preference"
              onChange={(e) => {
                const value = e.target.value;
                setRoomListingData({
                  ...roomListingData,
                  agePreference: value,
                  minAge: value === "Any" ? 0 : roomListingData.minAge, // Reset minAge when switching from Custom
                  maxAge: value === "Any" ? 0 : roomListingData.maxAge, // Reset maxAge when switching from Custom
                });
              }}
            >
              <MenuItem value={"Any"}>Any</MenuItem>
              <MenuItem value={"Custom"}>Custom</MenuItem>
            </Select>
          </FormControl>
        </div>
    )
  }


  
  
  return (
    <div className="container-fluid">
      
      <div className="row ">
        <div className="col-lg-6 col-sm-12 listing-container">
          <div className={`row ${isMobile ? '' : 'new-listing-section'}`}>
            <form
              id="newListingForm"
              method="post"
              onSubmit={handleInsertNewRoomListing}
            >
              <div>
                <h2 className="create-new-listing-title">
                  {StaticFrontendLabel.LIST_A_ROOM_PAGE_TITLE}
                </h2>
                <input
                  type="hidden"
                  id="userProfileId"
                />
                {/* ---------------------------------------- ADDRESS ----------------------------------------------------- */}
                {returnSectionHeader('Address')}

                <p className="list-a-room-hint">
                  Boost you potential tenant matching speed with greater ease!
                </p>

                <AutocompleteInput />

                {/* FLOOR */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    required
                    className="form-control"
                    id="floor"
                    maxLength={3}
                    placeholder="Floor"
                    onChange={(e) =>
                      setRoomListingData({
                        ...roomListingData,
                        floor: e.target.value,
                      })
                    }
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
                    placeholder="Description of place/room"
                    className="form-control"
                    maxLength={NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH}
                    rows={5}
                    required
                    onChange={(e) =>
                      setRoomListingData({
                        ...roomListingData,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                {/* LISTING TYPE */}
                {returnHousingTypeSection()}
                
                {/* ---------------------------------------- BED SIZE ---------------------------------------- */}
                {returnBedSizeSection()}

                {/* ---------------------------------------- Pricing ----------------------------------------------------- */}
                {returnSectionHeader('Pricing')}

                {/* PRICE */}
                <div className="input-group mb-3 asking-price input-field-width">
                  <input
                    placeholder="Asking Price"
                    id="price"
                    required
                    maxLength={6}
                    type="text"
                    className="form-control asking-price"
                    aria-label="Amount (to the nearest dollar)"
                    onChange={(e) =>
                      setRoomListingData({
                        ...roomListingData,
                        price: e.target.value,
                      })
                    }
                  />
                  <div className="input-group-append ">
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

                {/* ---------------------------------------- Gender Preference ----------------------------------------------------- */}
                {returnGenderPreference()}

                <div
                  className="form-floating mb-3"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {returnAgePreference()}

                  {/* This is the custom check.
                  IF the age is CUSTOM will display the Age Range and the Slider for Min and Max Age */}
                  {roomListingData.agePreference === "Custom" && (
                    <div className="input-field-width ml-3">
                      <span>Age Range</span>

                      <Slider
                        getAriaLabel={() => "Temperature range"}
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

                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="airConditionning"
                      onClick={() => handleCheckboxChange("airConditionning")}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Air conditionning</label>
                </div>

                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="heating"
                      onClick={() => handleCheckboxChange("heating")}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Heating</label>
                </div>

                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="fireplace"
                      onClick={() => handleCheckboxChange("fireplace")}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Fireplace</label>
                </div>

                {/* ---------------------------------------- Home Safety ----------------------------------------------------- */}
                <div className='pt-2'>{returnSectionHeader('Home Safety')}</div>

                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="smokeAlarm"
                      onClick={() => handleCheckboxChange("smokeAlarm")}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Smoke Alarm</label>
                </div>

                {/* ---------------------------------------- Accessibility ----------------------------------------------------- */}
                <div className='pt-2'>{returnSectionHeader('Parking and facilities')}</div>

                {/* WHEEL CHAIR ACCESSIBLE */}
                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="wheelChairAccessibility"
                      onClick={() =>
                        handleCheckboxChange("wheelChairAccessibility")
                      }
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
                      onClick={() => handleCheckboxChange("privateParking")}
                      onChange={() => {}}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Private Parking</label>
                </div>

                {/* PUBLIC PARKING */}

                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="publicParking"
                      onClick={() => handleCheckboxChange("publicParking")}
                      onChange={() => {}}
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
                      type="checkbox"
                      id="petFriendly"
                      onClick={() => handleCheckboxChange("petFriendly")}
                      onChange={() => {}}
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
                      type="checkbox"
                      id="dishes"
                      onClick={() => handleCheckboxChange("dishes")}
                      onChange={() => {}}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Dishes and silverware</label>
                </div>

                {/* REFRIGERATOR */}
                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="refrigerator"
                      onClick={() => handleCheckboxChange("refrigerator")}
                      onChange={() => {}}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Refrigerator</label>
                </div>

                {/* MICROWAVE */}
                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="microwave"
                      onClick={() => handleCheckboxChange("microwave")}
                      onChange={() => {}}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Microwave</label>
                </div>
                {/* TOASTER */}
                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="toaster"
                      onClick={() => handleCheckboxChange("toaster")}
                      onChange={() => {}}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Toaster</label>
                </div>
                {/* COFFEE MAKER */}
                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="coffeeMaker"
                      onClick={() => handleCheckboxChange("coffeeMaker")}
                      onChange={() => {}}
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
                      type="checkbox"
                      id="furnished"
                      onClick={() => handleCheckboxChange("furnished")}
                      onChange={() => {}}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Furnished</label>
                </div>

                {/* WASHER */}
                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="washer"
                      onClick={() => handleCheckboxChange("washer")}
                      onChange={() => {}}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Washer</label>
                </div>
                {/* DRYER */}
                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="dryer"
                      onClick={() => handleCheckboxChange("dryer")}
                      onChange={() => {}}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Dryer</label>
                </div>

                {/* DISH WASHER */}
                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="dishWasher"
                      onClick={() => handleCheckboxChange("dishWasher")}
                      onChange={() => {}}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Dish Washer</label>
                </div>

                {/* INTERNET CONNECTION */}
                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="internetConnection"
                      onClick={() => handleCheckboxChange("internetConnection")}
                      onChange={() => {}}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Internet Connection</label>
                </div>

                {/* Television */}
                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="television"
                      onClick={() => handleCheckboxChange("television")}
                      onChange={() => {}}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Television</label>
                </div>

                {/* PRIVATE BATHROOM */}

                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="privateBathroom"
                      onClick={() => handleCheckboxChange("privateBathroom")}
                      onChange={() => {}}
                    />
                    <span className="slider round"></span>
                  </label>
                  <label className="radio-label">Private Bathroom</label>
                </div>

                {/* SMOKING ALLOWED*/}
                <div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="smokingAllowed"
                      onClick={() => handleCheckboxChange("smokingAllowed")}
                      onChange={() => {}}
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
              {/* Images */}
              <div>
                <input type="file" multiple onChange={handleImageChange} />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="row submit-button">
                <input
                  type="submit"
                  value="Create Listing!"
                  className="submit-button"
                  onClick={handleSubmitNewRoomListing} // do not remove this otherwise the userId will not populate properly.
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListARoom;
