import "../../styles/myProfile/EditAccountInformation.css";
import "../../styles/myProfile/ApplicationSetup.css";
import { useState, useEffect } from "react";
import { SiteData } from "../../context/SiteWrapper";
import Button from "@mui/material/Button";
// import BackendAxios from "../../backend/BackendAxios";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import MultiSelect from "../searchTenant/MultiSelect";
import Autocomplete from "react-google-autocomplete";
import TextField from '@mui/material/TextField';
import SnackBarAlert from "../alerts/SnackBarAlerts";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import StaticFrontendLabel from "../../StaticFrontend";
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

//@ts-ignore
const ApplicationSetup = ({socialStatusInitiallyIsStudentOrEmployee , setSocialStatusInitiallyIsStudentOrEmployee}) => {
  //@ts-ignore
  const { userInfo, setUserInfo, snackbarOpen, setSnackbarOpen, snackbarMessage, setSnackbarMessage, snackbarSeverity, setSnackbarSeverity } = SiteData();
  const HOUSING_TYPE_LIST = StaticFrontendLabel.HOUSING_TYPE_LIST;
  const [cityInput, setCityInput] = useState(""); // State to store current input value
  let [isPlaceUpdated, setIsPlaceUpdated] = useState(false); // State to store current input value
  const [maxCitiesReached, setMaxCitiesReached] = useState(false); 
  const [maxCitiesReachedMessage, setMaxCitiesReachedMessage] = useState(''); 
  const LANGUAGES_LIST = StaticFrontendLabel.LANGUAGES_LIST;
  const GOOGLE_MAP_API_KEY = StaticFrontendLabel.GOOGLE_MAP_API_KEY;
  const USER_PROFILE_BIO_MAX_LENGTH = StaticFrontendLabel.USER_PROFILE_BIO_MAX_LENGTH;
  const [isAnyValueChanged, setIsAnyValueChanged] = useState(false);      

  const [welcomeProfileSetupStep, setWelcomeProfileSetupStep] = useState({
    typeOfPlace: Array.isArray(userInfo?.typeOfPlace)
      ? userInfo?.typeOfPlace
      : userInfo?.typeOfPlace
      ? [userInfo?.typeOfPlace]
      : [],
    budget: userInfo?.budget || "",
    socialStatus: Array.isArray(userInfo?.socialStatus)
      ? userInfo?.socialStatus
      : userInfo?.socialStatus
      ? [userInfo?.socialStatus]
      : [],
    socialstatusDetails: userInfo?.socialstatusDetails || "",
    cleanlinessLevel: userInfo?.cleanlinessLevel || "",
    isLookingForRoommate: userInfo?.isLookingForRoommate,
    gender: userInfo?.gender || "",
    minAge: userInfo?.minAge || 0,
    maxAge: userInfo?.maxAge || 100,
    hasPet: userInfo?.hasPet,
    hasKids: userInfo?.hasKids,
    moveInDate: handleDateFormat(userInfo?.moveInDate),
    preferredLeaseTerm: userInfo?.preferredLeaseTerm,
    preferredFurnishedPlace: userInfo?.preferredFurnishedPlace,
    roommateCount: userInfo?.roommateCount,
    isSmoker: userInfo?.isSmoker,
    userHasAPlace: userInfo?.userHasAPlace,
    bio: userInfo?.bio,
    citiesLookingToLiveIn: Array.isArray(userInfo?.citiesLookingToLiveIn)
    ? userInfo?.citiesLookingToLiveIn
    : userInfo?.citiesLookingToLiveIn
    ? [userInfo?.citiesLookingToLiveIn]
    : [],
    languages: Array.isArray(userInfo?.languages)
    ? userInfo?.languages
    : userInfo?.languages
    ? [userInfo?.languages]
    : [],
  });
  const SETUP_PROFILE_MAX_ALLOWED_CITIES = welcomeProfileSetupStep.userHasAPlace == 1 ? '1' : StaticFrontendLabel.SETUP_PROFILE_MAX_ALLOWED_CITIES;

  const [cities, setCities] = useState(welcomeProfileSetupStep.citiesLookingToLiveIn); // State to store selected cities

    //@ts-ignore
    const getAddressComponent = (place, componentType) => {
      //@ts-ignore
      const component = place.address_components.find((component) =>
        component.types.includes(componentType)
      );
      return component ? component.short_name : "";
    };
  
    //@ts-ignore
    const getAddressComponentShort = (place, type) => {
      const component = place.address_components.find(
        //@ts-ignore
          component => component.types.includes(type)
      );
      return component ? component.short_name : '';
  };
  


    // Function to update a subset of userInfo 
    //@ts-ignore
    const updateUserInfoSubset = (updatedSubset) => {
      setUserInfo([
        {
          ...userInfo, // Copy existing userInfo
          ...updatedSubset, // Update the specified subset
        },
        ...userInfo.slice(1), // Keep other elements unchanged
      ]);
    };

    /**
   * This function is very important.
   * 1- Why do I need it? Because when the update happens, if the user refreshes the page they need their updated info to persist
   * without this function, if I refresh, the value would revert back to the previous value but on the database it's updated
   * So before this function, the user needs to logout and then log in to view their changes, this one makes it dynamic by updating the exisitng
   * userInfo locally and if the user refreshes / logs out and back in they have the latest info
   */
      const updateCurrentUserInfo = () => {
        const updatedSubset = {
          typeOfPlace: welcomeProfileSetupStep.typeOfPlace,
          budget: welcomeProfileSetupStep.budget,
          socialStatus: welcomeProfileSetupStep.socialStatus,
          socialstatusDetails: welcomeProfileSetupStep.socialstatusDetails,
          cleanlinessLevel: welcomeProfileSetupStep.cleanlinessLevel,
          isLookingForRoommate: welcomeProfileSetupStep.isLookingForRoommate,
          gender: welcomeProfileSetupStep.gender,
          minAge: welcomeProfileSetupStep.minAge,
          maxAge: welcomeProfileSetupStep.maxAge,
          hasPet: welcomeProfileSetupStep.hasPet,
          hasKids: welcomeProfileSetupStep.hasKids,
          preferredFurnishedPlace: welcomeProfileSetupStep.preferredFurnishedPlace,
          isSmoker: welcomeProfileSetupStep.isSmoker,
          userHasAPlace: welcomeProfileSetupStep.userHasAPlace,
          bio: welcomeProfileSetupStep.bio,
          citiesLookingToLiveIn: welcomeProfileSetupStep.citiesLookingToLiveIn,
          languages: welcomeProfileSetupStep.languages,
          preferredLeaseTerm: welcomeProfileSetupStep.preferredLeaseTerm,
          moveInDate: welcomeProfileSetupStep.moveInDate,
        };
        updateUserInfoSubset(updatedSubset);
    };

    const [validationMessage, setValidationMessage] = useState('');
    const [bioValidationMessage, setBioValidationMessage] = useState('');

    function checkIfSocialStatusDetailsPopulated() {
      let allFieldsCompleted = true;
    
      if ( welcomeProfileSetupStep.socialStatus === 'Student' || welcomeProfileSetupStep.socialStatus === 'Employee' ) {
        allFieldsCompleted = false;
        if (welcomeProfileSetupStep.socialstatusDetails !== '') {
          allFieldsCompleted = true;
          setValidationMessage('');
        } else {
          setValidationMessage('Please set a value');
        }
      } else {
        setValidationMessage('');
        allFieldsCompleted = true;
      }

      if ( welcomeProfileSetupStep.bio == '' || welcomeProfileSetupStep.bio  == null) {
        allFieldsCompleted = false;
        setBioValidationMessage('Please set a biography')
      } else {
        allFieldsCompleted = true;
        setBioValidationMessage('');
      }
      return allFieldsCompleted;
    }

  let typeOfPlaceSentence = "you're offering?";
  if (userInfo.userHasAPlace === 0) {
    typeOfPlaceSentence = "you're looking for?";
  }

  let genderSentence = "roommate";
  if (userInfo.isLookingForRoommate === 0) {
    genderSentence = "tenant";
  }

  let cleanlinessLevelSentence = "Describe your cleanliness level";
  if (userInfo.userHasAPlace === 0) {
    cleanlinessLevelSentence =
      "What is your tenant/Roommate cleanliness level?";
  }

  function isUserListingARoom() {
    let userIsListingARoom = false;

    if(welcomeProfileSetupStep.userHasAPlace == 1 && welcomeProfileSetupStep.isLookingForRoommate == 0) {
      console.log('The user has a place and is not looking for a roommate. He is only listing a rental room.');
      console.log('System will not check if all the fields are populated since it is not needed');
      userIsListingARoom = true;
    }

    return userIsListingARoom;
  }


  //@ts-ignore
  const updateCitiesLookingToLiveIn = (newCityState) => {
    console.log('received value: ' + newCityState)
    
    const updatedCities = removeLeadingComma(newCityState);
    setWelcomeProfileSetupStep((prevState) => ({
      ...prevState,
      citiesLookingToLiveIn: updatedCities,
    }));


    console.log('new value: ' + updatedCities);
    console.log('new value of welcomeProfileSetupStep.citiesLookingToLiveIn: ' + welcomeProfileSetupStep.citiesLookingToLiveIn);
    console.log('full object value value: ' , welcomeProfileSetupStep);
  };
  
  //@ts-ignore
  const removeLeadingComma = (str) => {
    const updatedStr = str.replace(/^, /, ""); // Remove leading comma and space
    return updatedStr; // Return the updated string
  };


  const updateProfileSetup = async () => {
    console.log( "The user clicked on the finish button to complete the User Profile Setup" );

    if(!isAnyValueChanged) {
      setSnackbarMessage("You haven't made any changes yet");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return
    }
    
    // If the user
    if(!isUserListingARoom()) {
      // if the fields are not completed
      if(!checkIfSocialStatusDetailsPopulated()) { 
        console.log('The user is blocked from continuing because the fields are missing');
        console.log('welcomeProfileSetupStep.userHasAPlace: ' + welcomeProfileSetupStep.userHasAPlace );
        console.log('welcomeProfileSetupStep.isLookingForRoommate: ' + welcomeProfileSetupStep.isLookingForRoommate );
        return
      }
    }

    console.log('isPlaceUpdated is: ' , isPlaceUpdated);


    if(isPlaceUpdated) {
      updateCitiesLookingToLiveIn(welcomeProfileSetupStep.citiesLookingToLiveIn);
    }

    // try {
    //   let emailAddress = userInfo.emailAddress;
    //   console.log('Directly before sending the data to backend: ' , welcomeProfileSetupStep);
    //   const response = await BackendAxios.post("/insertProfileSetupInfo", {
    //     welcomeProfileSetupStep,
    //     emailAddress,
    //   });
    //   console.log("Insertion successful:", response.data);
    //   setSnackbarMessage("Success! Application setup updated.");
    //   setSnackbarSeverity("success");
    //   setSnackbarOpen(true);
    //   setIsAnyValueChanged(false);
    // } catch (error) {
    //   console.error("Error inserting profile setup info:", error);
    //   setSnackbarMessage("Failed to update application setup.");
    //   setSnackbarSeverity("error");
    //   setSnackbarOpen(true);
    // }

    updateCurrentUserInfo();

    console.log(
      "Full profile print: ################################# ",
      welcomeProfileSetupStep
    );
  };

  //@ts-ignore
  const handleSocialStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setWelcomeProfileSetupStep((prevState) => ({
      ...prevState,
      socialStatus: selectedStatus,
      socialstatusDetails: '', // Reset school or job field when social status changes
    }));

    
    const updatedSubset = {
      socialStatus: welcomeProfileSetupStep.socialStatus,
    };
    
    setUserInfo([
      {
        ...userInfo, // Copy existing userInfo
        ...updatedSubset, // Update the specified subset
      },
      ...userInfo.slice(1), // Keep other elements unchanged
    ]);

  };

  //@ts-ignore
  const handleSocialStatusDetails = (e) => {
    const value = e.target.value;
    const capitalizedValue = value
      .split(" ") // Split the string into an array of words
      //@ts-ignore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join the capitalized words back into a string
  
    //@ts-ignore
    setWelcomeProfileSetupStep((prevState) => ({
      ...prevState,
      socialstatusDetails: capitalizedValue,
    }));
  };
  

    // Use effect to log state changes
    useEffect(() => {
      if (cities.length >= SETUP_PROFILE_MAX_ALLOWED_CITIES) {
        console.log(`User reached max ${SETUP_PROFILE_MAX_ALLOWED_CITIES} cties`)
        setMaxCitiesReached(true);

        let maxCityReachedMessage;

        if(welcomeProfileSetupStep.userHasAPlace == 1) {
          maxCityReachedMessage='Max allowed 1 location';
        } else {
          maxCityReachedMessage='You have reached the max  allowed cities. Delete a city to update.';
        }
        
        setMaxCitiesReachedMessage(maxCityReachedMessage);
      } else {
        setMaxCitiesReached(false);
        setMaxCitiesReachedMessage('');
      }
  
      console.log(cities);
    }, [cities]);
    
    //@ts-ignore
    const onPlaceSelected = (place) => {
      const city = getAddressComponent(place, "locality");
      const state = getAddressComponentShort(place, "administrative_area_level_1").trim();
      const cityState = city + ", " + state;
      //@ts-ignore
      const isCityExists = cities.some((c) => c === city);
  
      if (!isCityExists) {
          console.log(`This city ${city} was not added yet. Will add it.`);
      }
  
      //@ts-ignore
      if (city && !cities.includes(city)) {
          console.log(`Adding new selected city: ${city} in state: ${state}`);
          //@ts-ignore
          setCities(prevCities => [...prevCities, cityState]); // Update cities based on previous state
          setCityInput(""); // Clear the input after selecting a city
          setIsPlaceUpdated(true); // Need this to see if we need to trim any leading comma
  

        console.log('before setWelcomeProfileSetupStep ' , welcomeProfileSetupStep);

          //@ts-ignore
          setWelcomeProfileSetupStep((prevState) => ({
            ...prevState,
            citiesLookingToLiveIn: prevState.citiesLookingToLiveIn != null && prevState.citiesLookingToLiveIn.length > 0
              ? (prevState.citiesLookingToLiveIn ? prevState.citiesLookingToLiveIn + ", " : "") + cityState
              : cityState,
          }));
      }
  };

    /**
   * This useeffect is created to load the citie on mount
   * and to check the inital status of socialStatus to see if Employee or Student to make the social status details input visibile
   */

  useEffect(() => {
    setCities(welcomeProfileSetupStep.citiesLookingToLiveIn);
    setSocialStatusInitiallyIsStudentOrEmployee(socialStatusInitiallyIsStudentOrEmployee);
  }, [])

  const [showPanels, setShowPanels] = useState(false);

   /**
   * This useEffect is used to monitor the change, if it matche Student or Employee to
   * make the next input visibile or invisible if changed
   */
    useEffect(() => {
      if(welcomeProfileSetupStep.socialStatus === 'Student' || welcomeProfileSetupStep.socialStatus === 'Employee') {
        setSocialStatusInitiallyIsStudentOrEmployee(true);
        console.log('A change was detected in welcomeProfileSetupStep now setting setSocialStatusInitiallyIsStudentOrEmployee to true');
      } else {
        setSocialStatusInitiallyIsStudentOrEmployee(false);
        console.log('A change was detected in welcomeProfileSetupStep now setting setSocialStatusInitiallyIsStudentOrEmployee to false');
      }
  
    }, [welcomeProfileSetupStep])


  useEffect(() => {

    const shouldShowPanel = welcomeProfileSetupStep.isLookingForRoommate == '0' && welcomeProfileSetupStep.userHasAPlace == '1';
    setShowPanels(shouldShowPanel);

    console.log('the value of showPanels is: ' + showPanels);
    console.log('the value of isLookingForRoommate is: ' + welcomeProfileSetupStep.isLookingForRoommate);
    console.log('the value of userHasAPlace is: ' + welcomeProfileSetupStep.userHasAPlace);
  }, [welcomeProfileSetupStep.isLookingForRoommate, welcomeProfileSetupStep.userHasAPlace]);

  const resetCitiesLookingToLiveIn = () => {
    setWelcomeProfileSetupStep(prevState => ({
      ...prevState,
      citiesLookingToLiveIn: [],
    }));
  };

    //@ts-ignore
    const removeCity = (index) => {
      const updatedCities = [...cities];
      updatedCities.splice(index, 1); // Remove city at index
      setCities([]);
      resetCitiesLookingToLiveIn();
    };

    const iconStyle = {
      fontSize: 30, // Adjust the size as needed
      color: "var(--roomatee-theme-color)", // Change the color to your desired color
    };

    const renderCities = () => {
      //@ts-ignore
      return cities.map((cityStateGroup, groupIndex) => {
        const cityStateArray = cityStateGroup.split(', ');
        const cityStatePairs = [];
    
        // Check if cityStateArray has more than 1 element
        if (cityStateArray.length > 1) {
          for (let i = 0; i < cityStateArray.length; i += 2) {
            const pair = cityStateArray.slice(i, i + 2);
            cityStatePairs.push(pair.join(', '));
          }
        } else {
          cityStatePairs.push(cityStateArray);
        }
    
        return (
          <React.Fragment key={groupIndex}>
            {cityStatePairs.map((pair, idx) => (
              <div key={`${groupIndex}-${idx}`} className="selected-city mb-2">
                <DeleteForeverIcon onClick={() => removeCity(groupIndex * cityStateArray.length + idx)} className='cursor-pointer' style={iconStyle}/>
                <span>{pair}</span>
                <br />
              </div>
            ))}
          </React.Fragment>
        );
      });
    };
    
    const [languages, setLanguage] = useState([]);

    //@ts-ignore
    const handleLanguageChange = (event) => {
      const { value } = event.target;
      setLanguage(value); // Update the state with the selected languages
  
      // Convert the selected languages to a comma-separated string if more than one language is selected
      const languagesString = Array.isArray(value) && value.length > 1 ? value.join(', ') : value;
  
      // Update welcomeProfileSetupStep directly with the selected languages as a comma-separated string
      //@ts-ignore
      setWelcomeProfileSetupStep((prevState) => ({
        ...prevState,
        languages: languagesString,
      }));
    };

    const remainingBioCharacters = welcomeProfileSetupStep.bio ? 
    USER_PROFILE_BIO_MAX_LENGTH - welcomeProfileSetupStep.bio.length : 
    USER_PROFILE_BIO_MAX_LENGTH;


  useEffect(() => {
    // Compare the current state with the initial state
     const hasValueChanged =
      JSON.stringify(welcomeProfileSetupStep) !== JSON.stringify({
        // Your initial state values here
        typeOfPlace: Array.isArray(userInfo?.typeOfPlace)
      ? userInfo?.typeOfPlace
      : userInfo?.typeOfPlace
      ? [userInfo?.typeOfPlace]
      : [],
    budget: userInfo?.budget || "",
    socialStatus: Array.isArray(userInfo?.socialStatus)
      ? userInfo?.socialStatus
      : userInfo?.socialStatus
      ? [userInfo?.socialStatus]
      : [],
    socialstatusDetails: userInfo?.socialstatusDetails || "",
    cleanlinessLevel: userInfo?.cleanlinessLevel || "",
    isLookingForRoommate: userInfo.isLookingForRoommate,
    gender: userInfo?.gender || "",
    minAge: userInfo?.minAge || 0,
    maxAge: userInfo?.maxAge || 100,
    hasPet: userInfo?.hasPet,
    hasKids: userInfo?.hasKids,
    preferredLeaseTerm: userInfo?.preferredLeaseTerm,
    preferredFurnishedPlace: userInfo?.preferredFurnishedPlace,
    isSmoker: userInfo?.isSmoker,
    userHasAPlace: userInfo?.userHasAPlace,
    bio: userInfo?.bio,
    citiesLookingToLiveIn: Array.isArray(userInfo?.citiesLookingToLiveIn)
    ? userInfo?.citiesLookingToLiveIn
    : userInfo?.citiesLookingToLiveIn
    ? [userInfo?.citiesLookingToLiveIn]
    : [],
    languages: Array.isArray(userInfo?.languages)
    ? userInfo?.languages
    : userInfo?.languages
    ? [userInfo?.languages]
    : [],
      });

      if (hasValueChanged) {
        setIsAnyValueChanged(true);
        // Values have changed, you can do something here
        console.log('Values have changed:', welcomeProfileSetupStep);
      } else {
        setIsAnyValueChanged(false);
      }
  }, [welcomeProfileSetupStep]); // Dependency array containing the state you want to track

  function returnCountOfRequiredRoommates() {
    if(welcomeProfileSetupStep.isLookingForRoommate == 1) {

      let label;
      if(welcomeProfileSetupStep.userHasAPlace == 1) {
        label='How many roommates are you looking for?';
      } else {
        label='Preferred roommates count?';
      }
      
      return (
        <div className='mb-3 mt-3'>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={welcomeProfileSetupStep.roommateCount}
              label={label}
              //@ts-ignore
              onChange={(event) =>
                //@ts-ignore
                setWelcomeProfileSetupStep((prevState) => ({
                  ...prevState,
                  roommateCount: event.target.value,
                }))
              }
            >
              <MenuItem value={"1"}>1 roommate</MenuItem>
              <MenuItem value={"2"}>2 roommates</MenuItem>
              <MenuItem value={"3"}>3 roommates</MenuItem>
              <MenuItem value={"4"}>4 roommates</MenuItem>
            </Select>
          </FormControl>
        </div>
 
      )
    }
  }

  function returnBudget() {
    return (
      <div className="input-group mb-3 asking-price sliding-right-to-left">
        <input
          placeholder="Budge Price"
          value={welcomeProfileSetupStep.budget}
          id="price"
          required
          maxLength={6}
          type="text"
          className="form-control asking-price"
          aria-label="Amount (to the nearest dollar)"
          onChange={(e) =>
            //@ts-ignore
            setWelcomeProfileSetupStep((prevState) => ({
              ...prevState,
              budget: e.target.value,
            }))
          }
        />
        <div className="input-group-append">
          <span className="input-group-text">$/month</span>
        </div>
      </div>
    )
  }

  function returnSocialStatus() {
    return (
      <div className="mb-3" style={{width: '100%'}}>
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Social Status</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={welcomeProfileSetupStep.socialStatus}
        label="Social Status"
        //@ts-ignore
        onChange={handleSocialStatusChange}
        
      >
        <MenuItem value={"Employee"}>Employee</MenuItem>
        <MenuItem value={"Student"}>Student</MenuItem>
        <MenuItem value={"Parent"}>Parent</MenuItem>
        <MenuItem value={"Military"}>Military</MenuItem>
        <MenuItem value={"Unemployed"}>Unemployed</MenuItem>
        <MenuItem value={"Retired"}>Retired</MenuItem>
        <MenuItem value={"Business Owner"}>Business Owner</MenuItem>
      </Select>
    </FormControl>
  </div>
    )
  }

  function returnSocialStatusDetails() {
    return (
      <div className='mb-3' style={{width: '100%'}}>
    {welcomeProfileSetupStep.socialStatus === 'Student' || welcomeProfileSetupStep.socialStatus === 'Employee' ? (
      <>
      <FormControl sx={{  width: '100%' }} variant="outlined">
        <InputLabel htmlFor={welcomeProfileSetupStep.socialStatus === 'Student' ? 'school' : 'job'}>
          {welcomeProfileSetupStep.socialStatus === 'Student' ? 'Field of Studies' : 'Job Title'}
        </InputLabel>
        <OutlinedInput
          id={welcomeProfileSetupStep.socialStatus === 'Student' ? 'school' : 'job'}
          type="txt"
          label={welcomeProfileSetupStep.socialStatus === 'Student' ? 'Field of Studies' : 'Job Title'}
          value={welcomeProfileSetupStep.socialstatusDetails}
          onChange={handleSocialStatusDetails}
          inputProps={{ maxLength: 100 }} // Set the maximum length here (e.g., 50 characters)
        />
      </FormControl>

      <p style={{color: 'red', fontWeight: 'bold'}}>{validationMessage}</p>
      </>
    ) : null}
</div>
    )
  }

  function returnLanguages() {
    return (
      <div style={{width: '100%'}}>
      <MultiSelect
        state={welcomeProfileSetupStep.languages}
        // @ts-ignore
        setState={(value) =>
          setWelcomeProfileSetupStep({
            ...welcomeProfileSetupStep,
            languages: value,
          })
        }
        options={LANGUAGES_LIST}
        label="Languages"
      />
      </div>
    )
  }

  function returnLeaseDuration() {
    return(
      <div className='mb-3'>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Lease Duration</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={welcomeProfileSetupStep.preferredLeaseTerm}
              label="Lease Duration"
              //@ts-ignore
              onChange={(event) =>
                //@ts-ignore
                setWelcomeProfileSetupStep((prevState) => ({
                  ...prevState,
                  preferredLeaseTerm: event.target.value,
                }))
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

  function returnHousingTypeInterest() {
    return (
      <div style={{width: '100%'}}>
      <MultiSelect
        state={welcomeProfileSetupStep.typeOfPlace}
        // @ts-ignore
        setState={(value) =>
          setWelcomeProfileSetupStep({
            ...welcomeProfileSetupStep,
            typeOfPlace: value,
          })
        }
        options={HOUSING_TYPE_LIST}
        label="Interest in housing type"
      />
      </div>
    )
  }

  function returnBio() {
    return (
      <div className='pb-2 pt-3' >
      <label className='remaining-characters-style'>Remaining Characters: {remainingBioCharacters}</label>
      <TextField 
          sx={{  width: '100%' }}
          inputProps={{ maxLength: '300' }}
          id="outlined-textarea"
          label="Give a brief description of yourself"
          placeholder="Biography"
          multiline
          value={welcomeProfileSetupStep.bio}
          rows={4}
          onChange={(e) =>
            setWelcomeProfileSetupStep({
              ...welcomeProfileSetupStep,
              bio: e.target.value,
            })
          }
        />
        <p style={{color: 'red', fontWeight: 'bold'}}>{bioValidationMessage}</p>
      </div>
    )
  }

  function returnDoYouHaveAPlace() {
    return (
      <div>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Do you own a place?
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={welcomeProfileSetupStep.userHasAPlace ? welcomeProfileSetupStep.userHasAPlace : userInfo.userHasAPlace}
            onChange={(e) =>
              setWelcomeProfileSetupStep({
                ...welcomeProfileSetupStep,
                userHasAPlace: e.target.value,
              })
            }
          >
            <FormControlLabel value="1" control={<Radio />} label="Yes" />
            <FormControlLabel value="0" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  function returnAreYouLookingForRoommate() {
    return (
      <div>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Are you looking for a roommate?
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={welcomeProfileSetupStep.isLookingForRoommate ? welcomeProfileSetupStep.isLookingForRoommate : userInfo.isLookingForRoommate}
            onChange={(e) =>
              setWelcomeProfileSetupStep({
                ...welcomeProfileSetupStep,
                isLookingForRoommate: e.target.value,
              })
            }
          >
            <FormControlLabel value="1" control={<Radio />} label="Yes" />
            <FormControlLabel value="0" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  function returnCleanlinessLevel() {
    return (
      <div>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Describe your cleanliness Level
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={welcomeProfileSetupStep.cleanlinessLevel ? welcomeProfileSetupStep.cleanlinessLevel : userInfo.cleanlinessLevel}
            onChange={(e) =>
              setWelcomeProfileSetupStep({
                ...welcomeProfileSetupStep,
                cleanlinessLevel: e.target.value,
              })
            }
          >
            <FormControlLabel
              value="Normal"
              control={<Radio />}
              label="Normal"
            />
            <FormControlLabel value="Neat" control={<Radio />} label="Neat" />
            <FormControlLabel value="Messy" control={<Radio />} label="Messy" />
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  function returnHaveAnyKids() {
    return (
      <div>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Do you have any kids?
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={welcomeProfileSetupStep.hasKids ? welcomeProfileSetupStep.hasKids : userInfo.hasKids}
            onChange={(e) =>
              setWelcomeProfileSetupStep({
                ...welcomeProfileSetupStep,
                hasKids: e.target.value,
              })
            }
          >
            <FormControlLabel value="1" control={<Radio />} label="Yes" />
            <FormControlLabel value="0" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  function returnHaveAnyFurniture() {
    return (
      <div>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Furniture Preference
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={welcomeProfileSetupStep.preferredFurnishedPlace ? welcomeProfileSetupStep.preferredFurnishedPlace : userInfo.preferredFurnishedPlace}
            onChange={(e) =>
              setWelcomeProfileSetupStep({
                ...welcomeProfileSetupStep,
                preferredFurnishedPlace: e.target.value,
              })
            }
          >
            <FormControlLabel value="1" control={<Radio />} label="Yes" />
            <FormControlLabel value="0" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  function returnHaveAnyPets() {
    return (
      <div>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Do you own any pets?
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={welcomeProfileSetupStep.hasPet ? welcomeProfileSetupStep.hasPet : userInfo?.hasPet}
            onChange={(e) =>
              setWelcomeProfileSetupStep({
                ...welcomeProfileSetupStep,
                hasPet: e.target.value,
              })
            }
          >
            <FormControlLabel value="1" control={<Radio />} label="Yes" />
            <FormControlLabel value="0" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  function returnDoYouSmoke() {
    return (
      <div>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Do you smoke?
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={welcomeProfileSetupStep.isSmoker ? welcomeProfileSetupStep.isSmoker : userInfo.isSmoker}
            onChange={(e) =>
              setWelcomeProfileSetupStep({
                ...welcomeProfileSetupStep,
                isSmoker: e.target.value,
              })
            }
          >
            <FormControlLabel value="1" control={<Radio />} label="Yes" />
            <FormControlLabel value="0" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  function returnCitySearch() {
    return (
      <div>
      <Autocomplete
        className={`form-control search-input-v2 mb-2`}
        apiKey={GOOGLE_MAP_API_KEY}
        onPlaceSelected={onPlaceSelected}
        //@ts-ignore
        disabled={maxCitiesReached}
        //@ts-ignore
        componentRestrictions={{ country: "us" }}
        
        value={cityInput}
        //@ts-ignore
        onChange={(e) => setCityInput(e.target.value)}
        placeholder="Enter a city"
        options={{
          types: ["(cities)"],
        }}
      />
      </div>
    )
  }

    //@ts-ignore
    function handleDateFormat(dateValue) {
      //@ts-ignore
    const formattedDate = new Date(dateValue).toISOString().split('T');
    return formattedDate;
  }

  
function returnMoveInDate() {
  if (welcomeProfileSetupStep.isLookingForRoommate === 1) {
    //@ts-ignore
    const [value, setValue] = React.useState(dayjs(welcomeProfileSetupStep.moveInDate));
    const minDate = dayjs().startOf('day'); // Set minDate to today's date

    let label;
    if (welcomeProfileSetupStep.userHasAPlace === 1) {
      label = "How soon are you looking to have them move in?";
    } else {
      label = "How soon are you looking to move in?";
    }

    return (
      <div>
        <div className="sliding-right-to-left pt-2">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ '& .MuiOutlinedInput-root': { height: '55px' }, width: '100%' }}
              label="Move-in Date"
              value={value}
              onChange={(date) => {
                // @ts-ignore
                setValue(date);
                setWelcomeProfileSetupStep((prevState) => ({
                  ...prevState,
                  moveInDate: handleDateFormat(date)
                }));
              }}
              minDate={minDate} // Set minDate to disable selection of past dates
            />
          </LocalizationProvider>
        </div>
      </div>
    );
  } else {
    return null; // Return null if isLookingForRoommate is not 1
  }
}


if(!userInfo) {
  return <div>Loading userinfo in Profile Picture...</div>
}


  return (
    <div className="container edit-account-information-container">
      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />

      <p className='mb-4'>This information will show up for other users, making it easier for them to find you and for you to discover new connections</p>

      {/*  --------------------------- DO YOU HAVE A PLACE --------------------------- */}
      {returnDoYouHaveAPlace()}

      {/*  --------------------------- ARE YOU LOOKING FOR A ROOMMATE --------------------------- */}
      {returnAreYouLookingForRoommate()}

      {/* If the user is not looking for roommates and the user has a place */}
      {!showPanels && (
        <>

      {/*  --------------------------- DESCRIBE YOUR CLEANLINESS LEVEL --------------------------- */}
      {returnCleanlinessLevel()}

      {/*  --------------------------- ANY KIDS --------------------------- */}
      {returnHaveAnyKids()}

      {/*  --------------------------- FURNITURE PREFERENCE --------------------------- */}
      {returnHaveAnyFurniture()}

      {/*  --------------------------- DO YOU OWN ANY PETS --------------------------- */}
      {returnHaveAnyPets()}

      {/*  --------------------------- DO YOU SMOKE --------------------------- */}
      {returnDoYouSmoke()}

      {/*  --------------------------- Biography --------------------------- */}
      {returnBio()}

      {/*  --------------------------- HOUSING TYPE INTEREST --------------------------- */}
      {returnHousingTypeInterest()}

      {returnLeaseDuration()}

      {/* ---------------------------------- LANGUAGES ---------------------------------- */}
      {returnLanguages()}

      {/*  --------------------------- CITY SEARCH --------------------------- */}
      {returnCitySearch()}

      {/* ---------------------------------- ALERT ---------------------------------- */}
      <p style={{color: 'red', fontWeight: 'bold'}}>{maxCitiesReachedMessage}</p>

      {/* ---------------------------------------- Display selected cities ---------------------------------------- */}
      <div className="selected-cities">
        {renderCities()}
      </div>

      {/* ---------------------------------------- Move In Date ---------------------------------------- */}
      <div>{returnMoveInDate()}</div>

      {/* ---------------------------------------- Count of Roommates ---------------------------------------- */}
      {returnCountOfRequiredRoommates()}

      {/* ---------------------------------------- Budget ---------------------------------------- */}
      {returnBudget()}

      {/* ---------------------------------- SOCIAL STATUS ---------------------------------- */}
      {returnSocialStatus()}

      {/* ---------------------------------- SOCIAL STATUS DETAILS ---------------------------------- */}
      {returnSocialStatusDetails()}
        </>
      )
}


  <Button
  style={{width: '100px'}}
  className='ml-auto'
  variant="contained"
  color="primary"
  onClick={() => updateProfileSetup()}
>
  Update
</Button>

  
    </div>
  );
};

export default ApplicationSetup;
