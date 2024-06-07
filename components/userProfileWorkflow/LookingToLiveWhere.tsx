"use client";

import React, { useState, useEffect } from "react";
import Title from "./Title";
import SubTitle from "./SubTitle";
import NavigationButton from "./NavigationButton";
import { SiteData } from "../../context/SiteWrapper";
import StaticFrontendLabel from "../../StaticFrontend";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Autocomplete from "react-google-autocomplete";
import '../../styles/userProfileWorkflow/LookingToLiveWhere.css'

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
const ProSpan = styled('span')({
  display: 'inline-block',
  height: '1em',
  width: '1em',
  verticalAlign: 'middle',
  marginLeft: '0.3em',
  marginBottom: '0.08em',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundImage: 'url(https://mui.com/static/x/pro.svg)',
});

function Label({
  componentName,
  valueType,
  isProOnly,
}: {
  componentName: string;
  valueType: string;
  isProOnly?: boolean;
}) {
  const content = (
    <span>
      <strong>{componentName}</strong> for {valueType} editing
    </span>
  );

  if (isProOnly) {
    return (
      <Stack direction="row" spacing={0.5} component="span">
        <Tooltip title="Included on Pro package">
          <a
            href="https://mui.com/x/introduction/licensing/#pro-plan"
            aria-label="Included on Pro package"
          >
            <ProSpan />
          </a>
        </Tooltip>
        {content}
      </Stack>
    );
  }

  return content;
}

//@ts-ignore
const LookingToLiveWhere = ({ nextStep, prevStep }) => {
  //@ts-ignore
  const { isMobile, setWelcomeProfileSetupStep, welcomeProfileSetupStep, setPrevProgress, setNextProgress } = SiteData();
  setPrevProgress(30);
  setNextProgress(50);
  const [cities, setCities] = useState([]); // State to store selected cities
  const [cityInput, setCityInput] = useState(""); // State to store current input value
  const [maxCitiesReached, setMaxCitiesReached] = useState(false); 
  const [maxCitiesReachedMessage, setMaxCitiesReachedMessage] = useState(''); 
  const SETUP_PROFILE_MAX_ALLOWED_CITIES = welcomeProfileSetupStep.userHasAPlace == 1 ? '1' : StaticFrontendLabel.SETUP_PROFILE_MAX_ALLOWED_CITIES;
  const COMPONENT_TITLE = welcomeProfileSetupStep.userHasAPlace == 1 ? 'Where do you live?' : 'Where are you looking to live?';
  const COMPONENT_SUB_HEADING = welcomeProfileSetupStep.userHasAPlace == 1 ? 'This will help potential roommmates find you' : 'Add one or more cities you\'re interested in';
  const GOOGLE_MAP_API_KEY = StaticFrontendLabel.GOOGLE_MAP_API_KEY;



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


  //@ts-ignore
  const onPlaceSelected = (place) => {
    const city = getAddressComponent(place, "locality");
    const state = getAddressComponentShort(place, "administrative_area_level_1").trim();
    const cityState = city + ", " + state;
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

        //@ts-ignore
        setWelcomeProfileSetupStep((prevState) => ({
            ...prevState,
            citiesLookingToLiveIn: prevState.citiesLookingToLiveIn ? prevState.citiesLookingToLiveIn + ", " + cityState : cityState,
        }));
    }
};


  // Use effect to log state changes
  useEffect(() => {
    if (cities.length >= SETUP_PROFILE_MAX_ALLOWED_CITIES) {
      console.log(`User reached max ${SETUP_PROFILE_MAX_ALLOWED_CITIES} cties`)
      if(welcomeProfileSetupStep.userHasAPlace == 0) {
        setMaxCitiesReachedMessage('You have reached the max  allowed cities. Delete a city to update.');
      }
      setMaxCitiesReached(true);

    } else {
      setMaxCitiesReached(false);
      setMaxCitiesReachedMessage('');
    }

    console.log(cities);
  }, [cities]);

  //@ts-ignore
  const removeCity = (index) => {
    const updatedCities = [...cities];
    updatedCities.splice(index, 1); // Remove city at index
    setCities(updatedCities);
  };

  const iconStyle = {
    fontSize: 30, // Adjust the size as needed
    color: "var(--roomatee-theme-color)", // Change the color to your desired color
  };

  const renderCities = () => {
    return cities.map((city, index) => (
      <div key={index} className="selected-city mb-2">
        <DeleteForeverIcon onClick={() => removeCity(index)} className='cursor-pointer' style={iconStyle}/>
        <span>{city}</span>
      </div>
    ));
  };


  useEffect(() => {
    if(welcomeProfileSetupStep.userHasAPlace == 1 && welcomeProfileSetupStep.isLookingForRoommate == 0) {
      nextStep()
    }
  }, []);

  const shouldRenderNavigationButton = () => {
    return cities.length !== 0 && welcomeProfileSetupStep.budget && welcomeProfileSetupStep.preferredLeaseTerm;
  };

  function returnCountOfRequiredRoommates() {
    if(welcomeProfileSetupStep.isLookingForRoommate == 1) {

      let label;
      
      if(welcomeProfileSetupStep.userHasAPlace == 1) {
        label='How many roommates are you looking for?';
      } else {
        label='Preferred roommates count?';
      }

      return (
        <div>
          <Title text={label} />
          <div className="sliding-right-to-left container custom-container ">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Number of Roommmates</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={welcomeProfileSetupStep.roommateCount}
              label="Number of Roommmates"
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
        </div>
      )
    }
  }

  function returnCitiesInput() {
    return (
      <>
        {/* ---------------------------------- TITLE ---------------------------------- */}
        <Title text={COMPONENT_TITLE} />

        {/* ---------------------------------- SUB HEADING ---------------------------------- */}
        <SubTitle text={COMPONENT_SUB_HEADING} />
        <div className="sliding-right-to-left container custom-container search-input-v2 custom-autocomplete">

          <Autocomplete
            className='form-control search-input-v2 '
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

        {/* ---------------------------------- ALERT ---------------------------------- */}
        <p style={{color: 'red', fontWeight: 'bold'}}>{maxCitiesReachedMessage}</p>

        {/* ---------------------------------------- Display selected cities ---------------------------------------- */}
        
        </div>
        <div className="selected-cities">
          {renderCities()}
        </div>

        </>

    )
  }

  function returnBudgetInput() {
    return (
      <>
      <Title text={'Tell us about your budget'} />

<div className="sliding-right-to-left container custom-container ">
  <div className="input-group mb-3 asking-price sliding-right-to-left custom-autocomplete">
    <input
      placeholder="Budge Price"
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
    <div className="input-group-append" >
      <span className="input-group-text" style={{height: '60px'}}>$/month</span>
    </div>
  </div>
</div>
      </>
    )
  }

  function returnLeaseTerm() {
    return (
      <>
      <Title text={'Lease Term Preference'} />

<div className="sliding-right-to-left container custom-container custom-autocomplete" >
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Lease Duration</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={welcomeProfileSetupStep.preferredLeaseTerm}
        label="Lease Duration"

        onChange={(event) =>
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
      </>
    )
  }


  //@ts-ignore
  function handleDateFormat(dateValue) {
      //@ts-ignore
    const formattedDate = new Date(dateValue).toISOString().split('T')[0];
    return formattedDate;
  }

  function returnMoveInDate() {
    if (welcomeProfileSetupStep.isLookingForRoommate == 1) {
      let label;
      const minDate = dayjs().startOf('day'); // Set minDate to today's date

      if (welcomeProfileSetupStep.userHasAPlace == 1) {
        label = "How soon are you looking to have them move in?";
      } else {
        label = "How soon are you looking to move in?";
      }
  
      return (
        <div>
          <Title text={label} />
          <div className="sliding-right-to-left container custom-container">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
  sx={{ '& .MuiOutlinedInput-root': { height: '55px' }, width: '100%' }} 
  label="Move-in Date"
  // value={welcomeProfileSetupStep.moveInDate || null} // Handle null or undefined values
  onChange={(date) =>
    //@ts-ignore
    setWelcomeProfileSetupStep((prevState) => ({
      ...prevState,
      moveInDate: handleDateFormat(date), // Use the date object directly
    }))
  }
  minDate={minDate} // Set minDate to disable selection of past dates
/>
          </LocalizationProvider>
          </div>
        </div>
      );
    }
  }
  

  return (
    <div style={{width: isMobile ? '100%' : '50%', margin: 'auto'}}>
      {/* ---------------------------------- CITIES INPUT  ---------------------------------- */}
      {returnCitiesInput()}
      
      {/* ---------------------------------- BUDGET ---------------------------------- */}
      {returnBudgetInput()}

      {/* ---------------------------------- LEASE TERM ---------------------------------- */}
      {returnLeaseTerm()}

      {/* ---------------------------------- ROOMMATES COUT ---------------------------------- */}
      {returnCountOfRequiredRoommates()}

      {/* ---------------------------------- WHEN ---------------------------------- */}
      {returnMoveInDate()}

      {/* ---------------------------------- NAVIGATION BUTTONS ---------------------------------- */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <NavigationButton
          direction="Back"
          nextStep={nextStep}
          prevStep={prevStep}
        />

      {shouldRenderNavigationButton() &&  (
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

export default LookingToLiveWhere;
