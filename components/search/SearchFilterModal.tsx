"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import { SiteData } from "../../context/SiteWrapper";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "../../styles/SearchFilters.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Box } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "16px", 
        },
      },
    },
  },
});

const SearchFilterModal = () => {
  //@ts-ignore
  const { userAuth, userInfo,isMobile,searchFilterModalMobileTextSize,searchFilterModalLargeScreenTextSize,badgeFilterShow,setBadgeFilterShow,countEnabledSearchFilters,setCountEnabledSearchFilters,setSearchResults,minPriceFilter,setMinPriceFilter,maxPriceFilter,setMaxPriceFilter,moveInDate,setMoveInDate,searchValue,setSearchValue,booleanFilter,setBooleanFilter, resetAllListingSearchFilters } = SiteData();
  const [open, setOpen] = useState(false);

  /**
   * If any of the below fields are enabled the filters button
   * will enable the badge and display it using the boolean value
   * isAnyTrue
   */
  useEffect(() => {
    // Count the number of enabled booleans
    const enabledBooleanCount = Object.values(booleanFilter).filter(
      (value) => value
    ).length;

    // Increase the count by 1 if minPriceFilter is set
    const countAllFiltersSet =
      enabledBooleanCount +
      (minPriceFilter !== "" ? 1 : 0) +
      (maxPriceFilter !== "" ? 1 : 0) +
      (moveInDate == null ? 0 : 1);

    setCountEnabledSearchFilters(countAllFiltersSet);
    // Check if any boolean or minPriceFilter or maxPriceFilter or moveInDate is true or not empty
    const isAnyTrue = countAllFiltersSet > 0;

    // Set badgeFilterShow based on the result
    setBadgeFilterShow(!isAnyTrue);
  }, [booleanFilter, minPriceFilter, maxPriceFilter, moveInDate]);



  /**
   * Initialize previous values using the initial state or values
   * This will hold the previous values so we can prevent the search from
   * triggering over and over if the user did not mofify his filter or
   * input
   */
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [prevMinPriceFilter, setPrevMinPriceFilter] = useState("");
  const [prevMaxPriceFilter, setPrevMaxPriceFilter] = useState("");
  const [prevMoveInDateFilter, setPrevMoveInDateFilter] = useState("");
  const [prevBooleanFilter, setPrevBooleanFilter] = useState({});

  /**
   * Helper function to compare boolean filters
   * so that no matter how my booleans we have
   * it will always handle it.
   */
  //@ts-ignore
  const compareBooleanFilters = (filter1, filter2) => {
    const keys1 = Object.keys(filter1);
    const keys2 = Object.keys(filter2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every((key) => filter1[key] === filter2[key]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(
      "The user clicked on the boolean filter: " +
        event.target.name +
        " and the value is now: " +
        event.target.checked
    );
    setBooleanFilter({
      ...booleanFilter,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const applyFiltersAndSearch = () => {
    setOpen(false);
    handleSearchWithFilter();
  };

  // @ts-ignore
  // Check for changes and trigger the API call
  const handleSearchWithFilter = async () => {
    //e.preventDefault(); // Prevents the form from submitting (reloading the page)
    // Check if the search should be performed
    
    let requestedData = { searchValue, minPriceFilter, maxPriceFilter, moveInDate, booleanFilter };
    
    if(userAuth) {
      // if the user is authenticated send the user info as well
      //@ts-ignore
      requestedData = { ...requestedData, userInfo };
    }

    if (
      searchValue !== prevSearchValue ||
      minPriceFilter !== prevMinPriceFilter ||
      maxPriceFilter !== prevMaxPriceFilter ||
      moveInDate !== prevMoveInDateFilter ||
      !compareBooleanFilters(booleanFilter, prevBooleanFilter)
    ) {
      try {
        console.log('frontend requestedData: ' , requestedData)
        const response = await fetch('/api/searchListings', {
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
    
        if (response.status === 200) {
          setSearchResults(data);
          console.log("The search returned results of count: ", data.length);
          console.log("The search returned object: ", data);
        } else {
          console.log("Error completing the search: ");
    
        }
          
      setPrevSearchValue(searchValue);
      setPrevMinPriceFilter(minPriceFilter);
      setPrevMaxPriceFilter(maxPriceFilter);
      setPrevMoveInDateFilter(moveInDate);
      setPrevBooleanFilter({ ...booleanFilter });

      } catch (error) {
        // Handle the error here
        console.error("Error:", error);
      }
    }  else {
      console.log(
        "No change in search filter, supression call to reduce backend API calls"
      );
    }
  };

  // @ts-ignore
  const handleMaxPriceFilter = (e) => {
    console.log("The user changed the max price filter to: " + e.target.value);
    setMaxPriceFilter(e.target.value);
  };

  // @ts-ignore
  const handleMinPriceFilter = (e) => {
    console.log("The user changed the min price filter to: " + e.target.value);
    setMinPriceFilter(e.target.value);
  };

  const handleMoveInDateFilter = (selectedDate) => {
    if (!selectedDate) {
      // Handle the case when selectedDate is null or undefined
      setMoveInDate(null);
      return;
    }
  
    // Ensure selectedDate is a Dayjs object
    const date = dayjs(selectedDate);
  
    // Format the date as YYYY-MM-DD
    const formattedDate = date.format('YYYY-MM-DD');
  
    console.log("The user changed the move-in date price filter to: " + formattedDate);
  
    setMoveInDate(date);
  };

  const iconStyle = {
    fontSize: 50,
    color: '#4CAF50',
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Badge
          color="primary"
          badgeContent={countEnabledSearchFilters}
          invisible={badgeFilterShow}
        >

    <FilterAltIcon onClick={handleClickOpen} className='cursor-pointer' style={iconStyle}/>

        </Badge>
      </ThemeProvider>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, width: 600 }}
          id="customized-dialog-title"
        >
          Filters
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div className="row">
            <h3 className="search-filter-modal-heading">Price Ranges</h3>
            <p className="search-filter-modal-helper-text">
              Roomates with budgets for everyone!
            </p>
            <div className="row" style={{ width: '100%' }}>
                {/* ------------------------- Min Price -------------------------*/}

                <FormControl className="min-max-price" style={{ marginLeft: "10px" , width: '45%' }}>
                  <InputLabel id="min-price"> $ Min</InputLabel>
                  <Select
                    sx={{
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "blue",
                      },
                    }}
                    labelId="min-price"
                    id="demo-simple-select"
                    label=" $ Min"
                    onChange={handleMinPriceFilter}
                    value={minPriceFilter}
                  >
                    <MenuItem value="0">0</MenuItem>
                    <MenuItem value="500">500</MenuItem>
                    <MenuItem value="1000">1000</MenuItem>
                    <MenuItem value="1500">1500</MenuItem>
                    <MenuItem value="2000">2000</MenuItem>
                    <MenuItem value="3000">3000</MenuItem>
                    <MenuItem value="4000">4000</MenuItem>
                    <MenuItem value="5000">5000</MenuItem>
                    <MenuItem value="10000">10000</MenuItem>
                  </Select>
                </FormControl>


                {/* ------------------------- Max Price -------------------------*/}
                <FormControl className="min-max-price" style={{ marginLeft: "10px", width: '45%' }}>
                  <InputLabel id="max-price">$ Max</InputLabel>
                  <Select
                    sx={{
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "blue",
                      },
                      size: "small",
                    }}
                    labelId="max-price"
                    id="demo-simple-select"
                    label="$ Max"
                    onChange={handleMaxPriceFilter}
                    value={maxPriceFilter}
                  >
                    <MenuItem value="500">500</MenuItem>
                    <MenuItem value="1000">1000</MenuItem>
                    <MenuItem value="1500">1500</MenuItem>
                    <MenuItem value="2000">2000</MenuItem>
                    <MenuItem value="3000">3000</MenuItem>
                    <MenuItem value="4000">4000</MenuItem>
                    <MenuItem value="5000">5000</MenuItem>
                    <MenuItem value="10000">10000</MenuItem>
                  </Select>
                </FormControl>
                </div>
            
          </div>
          {/* ---------------------------- CONTENT OF MODAL START ---------------------------- */}

          <div className="row">
            <h3 className="search-filter-modal-heading"> Move-In Date </h3>
            <p className="search-filter-modal-helper-text">
              Tell us when you're ready or plan to move in!
            </p>
            <div className="col-12">
              <div
                // @ts-ignore
                style={{ "padding-top": "10px" }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    onChange={handleMoveInDateFilter}
                    slotProps={{ textField: { size: "medium" } }}
                    value={moveInDate}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>

          <div className="row">
            <h3 className="search-filter-modal-heading"> Amenities</h3>
            <p className="search-filter-modal-helper-text">
              Customize your stay as you like!
            </p>
            {/* ----------------------------- FIRST COLUMN OF FILTERS ------------------------- */}
            <div className="col-6">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.privateBathroom}
                      onChange={handleChange}
                      name="privateBathroom"
                    />
                  }
                  label={
                    <Box
                      component="div"
                    >
                      {" "}
                      Private Bathroom{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.privateParking}
                      onChange={handleChange}
                      name="privateParking"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Private Parking{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.publicParking}
                      onChange={handleChange}
                      name="publicParking"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Public Parking{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.wheelChairAccessibility}
                      onChange={handleChange}
                      name="wheelChairAccessibility"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Wheel Chair
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.internetConnection}
                      onChange={handleChange}
                      name="internetConnection"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      WiFi{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.furnished}
                      onChange={handleChange}
                      name="furnished"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Smoking Allowed{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.television}
                      onChange={handleChange}
                      name="television"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Television{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.airConditionning}
                      onChange={handleChange}
                      name="airConditionning"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Air Conditionning{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.heating}
                      onChange={handleChange}
                      name="heating"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Heating{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.fireplace}
                      onChange={handleChange}
                      name="fireplace"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Fireplace{" "}
                    </Box>
                  }
                />
              </FormGroup>
            </div>

            {/* ----------------------------- SECOND COLUMN OF FILTERS ------------------------- */}
            <div className="col-6">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.washer}
                      onChange={handleChange}
                      name="washer"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Washer{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.dryer}
                      onChange={handleChange}
                      name="dryer"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Dryer{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.refrigerator}
                      onChange={handleChange}
                      name="refrigerator"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Refrigerator
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.dishWasher}
                      onChange={handleChange}
                      name="dishWasher"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Dish Washer{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.petFriendly}
                      onChange={handleChange}
                      name="petFriendly"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Pet Friendly{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.smokeAlarm}
                      onChange={handleChange}
                      name="smokeAlarm"
                    />
                  }
                  label={
                    <Box
                      component="div"
                      
                    >
                      {" "}
                      Smoke Alarm{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.dishes}
                      onChange={handleChange}
                      name="dishes"
                    />
                  }
                  label={
                    <Box
                      component="div"

                    >
                      {" "}
                      Dishes and Silverware{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.toaster}
                      onChange={handleChange}
                      name="toaster"
                    />
                  }
                  label={
                    <Box
                      component="div"

                    >
                      {" "}
                      Toaster{" "}
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={booleanFilter.coffeeMaker}
                      onChange={handleChange}
                      name="coffeeMaker"
                    />
                  }
                  label={
                    <Box
                      component="div"

                    >
                      {" "}
                      Cofffe Maker{" "}
                    </Box>
                  }
                />
              </FormGroup>
            </div>
          </div>

          {/* ---------------------------- CONTENT OF MODAL END ---------------------------- */}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={resetAllListingSearchFilters}>
            Reset Filter
          </Button>

          <Button autoFocus onClick={applyFiltersAndSearch}>
            Apply Filter
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default SearchFilterModal;
