"use client";

import React, { useState, useEffect } from "react";
import Title from "./Title";
import SubTitle from "./SubTitle";
import NavigationButton from "./NavigationButton";
import { SiteData } from "../../context/SiteWrapper";
import Slider from "@mui/material/Slider";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from '@mui/material/TextField';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MuiTelInput } from 'mui-tel-input'
import StaticFrontendLabel from "../../StaticFrontend";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

//@ts-ignore
const PersonalInformation = ({ nextStep, prevStep }) => {
  //@ts-ignore
  const { isMobile, welcomeProfileSetupStep, setWelcomeProfileSetupStep, setPrevProgress, setNextProgress, scrollToTop } = SiteData();
  setPrevProgress(75);
  setNextProgress(90);
  const [isAllFieldsCompleted, setIsAllFieldsCompleted] = useState(false);
  let COMPONENT_TITLE = `Personal Information`;
  let COMPONENT_SUB_HEADING = "This information will help us match you with the best candidates";
  const LANGUAGES_LIST = StaticFrontendLabel.LANGUAGES_LIST;
  const USER_PROFILE_BIO_MAX_LENGTH = StaticFrontendLabel.USER_PROFILE_BIO_MAX_LENGTH;
  const PRIVACY_MESSAGE_PHONE_NUMBER = StaticFrontendLabel.PRIVACY_MESSAGE_PHONE_NUMBER;

  //@ts-ignore
  function valuetext(value) {
    return `${value}°C`;
  }

  useEffect(() => {
    scrollToTop();
  },[])

  const [dobValue, setDob] = React.useState<Dayjs | null>(
    dayjs("2014-08-18T21:11:54")
  );

  //@ts-ignore
  const handleDateChange = (newValue) => {
    const dobValue = newValue ? dayjs(newValue).format('MM/DD/YYYY') : ''; // Format DOB to mm/dd/yyyy
    //@ts-ignore
    setDob(dobValue); // Update DOB state
  
    // Log selected date value

     // Calculate age based on DOB
  const today = dayjs();
  const dobDate = dayjs(newValue);
  const calculatedAge = today.diff(dobDate, 'year');

  console.log('Selected dob:', dobValue);
  console.log('Selected age:', calculatedAge.toString());

  
    // Set formatted DOB in state
    setWelcomeProfileSetupStep({
      ...welcomeProfileSetupStep,
      dob: dobValue,
      age: calculatedAge.toString(),
    });
  };

  // this is for the slider value
  const [value, setValue] = useState([18, 30]);

  //@ts-ignore
  const handleChange = (event, newValue) => {
    setValue(newValue);

    setWelcomeProfileSetupStep({
      ...welcomeProfileSetupStep,
      minAge: newValue[0],
      maxAge: newValue[1],
    });
  };

  useEffect(() => {
    // Destructure the values from welcomeProfileSetupStep
    const { bio, gender, socialStatus, minAge, maxAge, age, dob, isSmoker, hasPet, cleanlinessLevel, socialstatusDetails, languages, hasKids, preferredFurnishedPlace } = welcomeProfileSetupStep;

    if (
      bio &&
      gender &&
      socialStatus &&
      //@ts-ignore
      ((socialStatus === 'Student' || socialStatus === 'Employee') ? socialstatusDetails : true) &&
      minAge &&
      maxAge &&
      age &&
      dob &&
      languages &&
      hasKids &&
      preferredFurnishedPlace &&
      isSmoker !== undefined &&
      hasPet !== undefined &&
      cleanlinessLevel
    ) {
      setIsAllFieldsCompleted(true);
    } else {
      setIsAllFieldsCompleted(false);
    }

  }, [welcomeProfileSetupStep]);

  let panelWidth = '500px';
  let additionalClass = ''
  if(isMobile) {
    panelWidth='100%';
    additionalClass='container'
  }

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

  const remainingBioCharacters = USER_PROFILE_BIO_MAX_LENGTH - welcomeProfileSetupStep.bio.length;

  //@ts-ignore
  const handlePhoneNumberChange = (newValue) => {
    //@ts-ignore
    setWelcomeProfileSetupStep((prevState) => ({
      ...prevState,
      phoneNumber: newValue,
    }));
  }

  function returnAgeRangePreference() {
    if(welcomeProfileSetupStep.isLookingForRoommate == 1) {
      return (
        <div className="mt-3" style={{ width: "300px", margin: "auto" }}>
            <div className="mb-5">
              <span>What's your preferred age range?</span>
            </div>
  
            <Slider
              getAriaLabel={() => "Temperature range"}
              value={[
                welcomeProfileSetupStep.minAge,
                welcomeProfileSetupStep.maxAge,
              ]}
              onChange={handleChange}
              getAriaValueText={valuetext}
              min={18}
              max={99}
              valueLabelDisplay="on"
            />
          </div>
      )
    }
  }

  function getFurniturePreference() {
    let inputLabel = 'Furniture Preference';
    if(welcomeProfileSetupStep.userHasAPlace == 1) {
      inputLabel = 'Is the place furnished?'
    }

    return (
      <div className="mt-3" >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{inputLabel}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={welcomeProfileSetupStep.preferredFurnishedPlace}
          label={inputLabel}
          //@ts-ignore
          onChange={(event) =>
            //@ts-ignore
            setWelcomeProfileSetupStep((prevState) => ({
              ...prevState,
              preferredFurnishedPlace: event.target.value,
            }))
          }
        >
          <MenuItem value={"1"}>Yes</MenuItem>
          <MenuItem value={"0"}>No</MenuItem>
        </Select>
      </FormControl>
    </div>
    )
  }
  
  function returnSocialStatusInput() {
    return (
      <div className="mt-3" >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Social Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={welcomeProfileSetupStep.socialStatus}
              label="Social Status"
              //@ts-ignore
              onChange={(event) =>
                //@ts-ignore
                setWelcomeProfileSetupStep((prevState) => ({
                  ...prevState,
                  socialStatus: event.target.value,
                }))
              }
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

  function returnHasKidsInput() {
    return (
      <div className="mt-3" >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Have any kids?</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={welcomeProfileSetupStep.hasKids}
              label="Have any kids?"
              //@ts-ignore
              onChange={(event) =>
                //@ts-ignore
                setWelcomeProfileSetupStep((prevState) => ({
                  ...prevState,
                  hasKids: event.target.value,
                }))
              }
            >
              <MenuItem value={"1"}>Yes</MenuItem>
              <MenuItem value={"0"}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
    )
  }

  function returnSpokenLanguagesInput() {
    return (
      <div className="mt-3" >
      <FormControl fullWidth>
        <InputLabel id="demo-multiple-checkbox-label">Languages</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={languages}
          onChange={handleLanguageChange}
          input={<OutlinedInput label="Languages" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {LANGUAGES_LIST.map((name) => (
            <MenuItem key={name} value={name}>
              {/* @ts-ignore */}
              <Checkbox checked={languages.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
    )
  }

  function returnGenderInput() {
    return (
      <div className="mt-3" >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={welcomeProfileSetupStep.gender}
              label="Gender"
              //@ts-ignore
              onChange={(event) =>
                //@ts-ignore
                setWelcomeProfileSetupStep((prevState) => ({
                  ...prevState,
                  gender: event.target.value,
                }))
              }
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
              <MenuItem value={"Transgender"}>Transgender</MenuItem>
              <MenuItem value={"Prefer not to say"}>Prefer not to say</MenuItem>
            </Select>
          </FormControl>
        </div>
    )
  }

  function returnIsSmokerInput() {
    return (
      <div className="mt-3" >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Are you a smoker?</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={welcomeProfileSetupStep.isSmoker}
              label="Are you a smoker?"
              //@ts-ignore
              onChange={(event) =>
                //@ts-ignore
                setWelcomeProfileSetupStep((prevState) => ({
                  ...prevState,
                  isSmoker: event.target.value,
                }))
              }
            >
              <MenuItem value={"1"}>Yes</MenuItem>
              <MenuItem value={"0"}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
    )
  }

  function returnHasPetsInput() {
    return (
      <div className="mt-3" >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Do you own a Pet?
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={welcomeProfileSetupStep.hasPet}
              label="Do you own a Pet?"
              //@ts-ignore
              onChange={(event) =>
                //@ts-ignore
                setWelcomeProfileSetupStep((prevState) => ({
                  ...prevState,
                  hasPet: event.target.value,
                }))
              }
            >
              <MenuItem value={"1"}>Yes</MenuItem>
              <MenuItem value={"0"}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
    )
  }

  function returnCleanlinessLevelInput() {
    return (
      <div className="mt-3" >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Cleanliness Level
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={welcomeProfileSetupStep.cleanlinessLevel}
              label="Cleanliness Level"
              //@ts-ignore
              onChange={(event) =>
                //@ts-ignore
                setWelcomeProfileSetupStep((prevState) => ({
                  ...prevState,
                  cleanlinessLevel: event.target.value,
                }))
              }
            >
              <MenuItem value={"Normal"}>Normal</MenuItem>
              <MenuItem value={"Neat"}>Neat</MenuItem>
              <MenuItem value={"Messy"}>Messy</MenuItem>
            </Select>
          </FormControl>
        </div>
    )
  }

  function returnSocialStatusDetailsInput() {
    return (
      <div className='mt-3' style={{width: '100%'}}>
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
        </>
      ) : null}
  </div>
    )
  }

  function returnBioInput() {
      return (
        <div className="mt-3">
  <label className='remaining-characters-style pb-2'>Remaining Characters: {remainingBioCharacters}</label>
    <TextField 
      sx={{  width: '100%' }}
      inputProps={{ maxLength: '300' }}
      id="outlined-textarea"
      label="Introduce yourself with brief description."
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
  </div>
    )
  }

  function returnDobInput() {
    return (
      <div className="mt-3" >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ '& .MuiOutlinedInput-root': { height: '55px' }, width: '100%' }} 
              label="Date of Birth"
              // value={value}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
        </div>
    )
  }

  function returnPhoneNumberInput() {
    return (
      <div className="mt-3" >
        <p style={{fontStyle: 'italic'}}>{PRIVACY_MESSAGE_PHONE_NUMBER}</p>
        <MuiTelInput value={welcomeProfileSetupStep.phoneNumber} onChange={handlePhoneNumberChange} sx={{ '& .MuiOutlinedInput-root': { height: '55px' }, width: '100%' }} />
      </div>
    )
  }

  return (
    <div>
      {/* ---------------------------------- TITLE ---------------------------------- */}
      <Title text={COMPONENT_TITLE} />

      {/* ---------------------------------- SUB HEADING ---------------------------------- */}
      <SubTitle text={COMPONENT_SUB_HEADING} />

      <div className={`sliding-right-to-left ${additionalClass}`} style={{ width: panelWidth, margin: "auto" }}>

        {/* ---------------------------------- Biography ---------------------------------- */}
        {returnBioInput()}

        {/* ---------------------------------- PHONE NUMBER ---------------------------------- */}
        {returnPhoneNumberInput()}

        {/* ---------------------------------- DOB ---------------------------------- */}
        {returnDobInput()}

        {/* ---------------------------------- GENDER ---------------------------------- */}
        {returnGenderInput()}

        {/* ---------------------------------- LANGUAGES ---------------------------------- */}
        {returnSpokenLanguagesInput()}

        {/* ---------------------------------- HAS KIDS ---------------------------------- */}
        {returnHasKidsInput()}

        {/* ---------------------------------- FURNITURE PREFERENCE ---------------------------------- */}
        {getFurniturePreference()}

        {/* ---------------------------------- SOCIAL STATUS ---------------------------------- */}
        {returnSocialStatusInput()}
        {returnSocialStatusDetailsInput()}

        {/* ---------------------------------- SMOKER ---------------------------------- */}
        {returnIsSmokerInput()}

        {/* ---------------------------------- PETS ---------------------------------- */}
        {returnHasPetsInput()}

        {/* ---------------------------------- Cleanliness Level ---------------------------------- */}
        {returnCleanlinessLevelInput()}

        {/* ---------------------------------- AGE RANGE ---------------------------------- */}
        {returnAgeRangePreference()}
        
      </div>


      {/* ---------------------------------- NAVIGATION BUTTONS ---------------------------------- */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <NavigationButton
          direction="Back"
          nextStep={nextStep}
          prevStep={prevStep}
        />

        {/* The Next button will be hidden until the user provides a response, then it will be displayed */}
        {isAllFieldsCompleted && (
          <NavigationButton
            direction="Next"
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
