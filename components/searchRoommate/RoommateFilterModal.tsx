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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Box } from "@mui/material";
import Slider from "@mui/material/Slider";
import MultiSelect from "./MultiSelect";
import "../../styles/SearchFilters.css";
import StaticFrontendLabel from "../../StaticFrontend";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const socialStatusList = [
  'Employee',
  'Student',
  'Parent',
  'Military',
  'Unemployed',
  'Retired',
  'Business Owner',
  'Any',
];

const hasPetList = [
  'Yes',
  'No',
  'Any',
];

const cleanlinessLevelList = [
  'Normal',
  'Neat',
  'Messy',
  'Any',
];

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

const RoommateFilterModal = () => {
  //@ts-ignore
    const { userAuth, userInfo, badgeFilterShow,setBadgeFilterShow,countEnabledSearchFilters,setCountEnabledSearchFilters,setSearchResults,searchValue, tenantFilters, setTenantFilters, resetAllTenantSearchFilters } = SiteData();
  
  /**
 * Initialize previous values using the initial state or values
 * This will hold the previous values so we can prevent the search from
 * triggering over and over if the user did not mofify his filter or
 * input
 */
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [prevMinBudgetFilter, setPrevMinBudgetFilter] = useState("");
  const [preMaxBudgetFilter, setPrevMaxBudgetFilter] = useState("");
  const [prevBooleanFilter, setPrevBooleanFilter] = useState({});
  const HOUSING_TYPE_LIST = StaticFrontendLabel.HOUSING_TYPE_LIST;
  const GENDER_LIST = StaticFrontendLabel.GENDER_LIST;

  // Handle the hide/show
  const [open, setOpen] = useState(false);
  
 const applyFiltersAndSearch = () => {
    setOpen(false);
    handleSearchWithFilter();
  };

    const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

    const iconStyle = {
    fontSize: 50,
    color: '#4CAF50',
  };

  const [value, setValue] = useState([18, 99]);

  //@ts-ignore
  const handleAgeChange = (event, newValue) => {
    setValue(newValue);
    setTenantFilters({
      ...tenantFilters,
      minAge: newValue[0],
      maxAge: newValue[1],
    });
  };

  useEffect(() => {
    setTenantFilters(tenantFilters);
  }, [tenantFilters]);

  //@ts-ignore
  const handleBooleanChange = (event) => {
    const { name, checked } = event.target;
    setTenantFilters({
      ...tenantFilters,
      [name]: checked,
    });
  };

  //@ts-ignore
  const handleMaxPriceFilter = (e) => {
    setTenantFilters({
      ...tenantFilters,
      maxBudgetFilter: e.target.value,
    });
  };

  //@ts-ignore
  const handleMinPriceFilter = (e) => {
    setTenantFilters({
      ...tenantFilters,
      minBudgetFilter: e.target.value,
    });
  };




  // @ts-ignore
  // Check for changes and trigger the API call
  const handleSearchWithFilter = async () => {
    //e.preventDefault(); // Prevents the form from submitting (reloading the page)
    // Check if the search should be performed
    const profileType = 'roommate';

    let requestedData = { searchValue, tenantFilters, profileType};

    if(userAuth) {
      // if the user is authenticated send the user info as well
      //@ts-ignore
      requestedData = { ...requestedData, userInfo };
    }

    try {
      console.log('frontend requestedData: ' , requestedData)
      const response = await fetch('/api/searchProfile', {
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
    } catch (error) {
      // Handle the error here
      console.error("Error:", error);
    }
      setPrevSearchValue(searchValue);
      
  };


   /**
   * If any of the below fields are enabled the tenantFilters button
   * will enable the badge and display it using the boolean value
   * isAnyTrue
   */
    useEffect(() => {
      const countAllFiltersSet =
        (tenantFilters.minBudgetFilter !== "" ? 1 : 0) +
        (tenantFilters.maxBudgetFilter !== "" ? 1 : 0) +
        (tenantFilters.socialStatus.length !== 0 ? 1 : 0) +
        (tenantFilters.typeOfPlace.length !== 0 ? 1 : 0) +
        (tenantFilters.hasPet.length !== 0 ? 1 : 0) +
        (tenantFilters.cleanlinessLevel.length !== 0 ? 1 : 0) +
        (tenantFilters.gender.length !== 0 ? 1 : 0) +
        (tenantFilters.minAge !== 18 ? 1 : 0) +
        (tenantFilters.maxAge !== 99 ? 1 : 0) + 
        (tenantFilters.isSmoker !== false ? 1 : 0) + 
        (tenantFilters.isEmailVerified !== false ? 1 : 0) + 
        (tenantFilters.isProfileVerified !== false ? 1 : 0)
        ;
  
      setCountEnabledSearchFilters(countAllFiltersSet);
      const isAnyTrue = countAllFiltersSet > 0;
  
      setBadgeFilterShow(!isAnyTrue);
    }, [tenantFilters.minBudgetFilter, tenantFilters.maxBudgetFilter, tenantFilters.socialStatus, tenantFilters.hasPet, tenantFilters.cleanlinessLevel, tenantFilters.gender, tenantFilters.minAge, tenantFilters.maxAge, tenantFilters.isSmoker, tenantFilters.isEmailVerified, tenantFilters.isProfileVerified, tenantFilters.typeOfPlace]);

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Badge color="primary" badgeContent={countEnabledSearchFilters} invisible={badgeFilterShow}>
          <FilterAltIcon onClick={handleClickOpen} className='cursor-pointer' style={iconStyle}/>
        </Badge>
      </ThemeProvider>

      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
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
          {/* Filter components */}
          {/* Budget Range */}
          <div className="row" style={{ width: '100%' }}>
            <h4 >Budget Range</h4>
            
            <FormControl className="min-max-price" style={{ marginLeft: "10px" , width: '45%' }}>
              <InputLabel id="max-price">$ Min</InputLabel>
              <Select
                labelId="max-price"
                label="Min Price"
                onChange={handleMinPriceFilter}
                value={tenantFilters.minBudgetFilter}
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
            <FormControl className="min-max-price" style={{ marginLeft: "10px", width: '45%' }}>
              <InputLabel id="max-price">$ Max</InputLabel>
              <Select
                labelId="max-price"
                label="Max Price"
                onChange={handleMaxPriceFilter}
                value={tenantFilters.maxBudgetFilter}
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

          {/* Tenant Preferences */}
          <div className="row">
            <h4>Tenant Preferences</h4>
            <div>
              <div>
                <MultiSelect
                  state={tenantFilters.typeOfPlace}
                  //@ts-ignore
                  setState={(value) => setTenantFilters({ ...tenantFilters, typeOfPlace: value })}
                  options={HOUSING_TYPE_LIST}
                  label="Housing Type"
                />

                <MultiSelect
                  state={tenantFilters.socialStatus}
                  //@ts-ignore
                  setState={(value) => setTenantFilters({ ...tenantFilters, socialStatus: value })}
                  options={socialStatusList}
                  label="Social Status"
                />
                <MultiSelect
                  state={tenantFilters.hasPet}
                  //@ts-ignore
                  setState={(value) => setTenantFilters({ ...tenantFilters, hasPet: value })}
                  options={hasPetList}
                  label="Pet Preferences"
                />
                <MultiSelect
                  state={tenantFilters.cleanlinessLevel}
                  //@ts-ignore
                  setState={(value) => setTenantFilters({ ...tenantFilters, cleanlinessLevel: value })}
                  options={cleanlinessLevelList}
                  label="Cleanliness Level"
                />
                <MultiSelect
                  state={tenantFilters.gender}
                  //@ts-ignore
                  setState={(value) => setTenantFilters({ ...tenantFilters, gender: value })}
                  options={GENDER_LIST}
                  label="Gender"
                />
              </div>

              {/* Age Range */}
              <div>
                <span>Age Range</span>
                <div className="mt-4" style={{ width: "96%" }}>
                  <Slider
                    getAriaLabel={() => "Age range"}
                    value={[tenantFilters.minAge, tenantFilters.maxAge]}
                    onChange={handleAgeChange}
                    min={18}
                    max={99}
                    valueLabelDisplay="on"
                  />
                </div>
              </div>

              {/* Boolean Filters */}
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={tenantFilters.isSmoker} onChange={handleBooleanChange} name="isSmoker"/>}
                  label={ <Box  component="div">Non Smoker</Box> }
                />
                <FormControlLabel
                  control={<Switch checked={tenantFilters.isEmailVerified} onChange={handleBooleanChange} name="isEmailVerified"/>}
                  label={ <Box  component="div">Email Verified</Box> }
                />
                <FormControlLabel
                  control={<Switch checked={tenantFilters.isProfileVerified} onChange={handleBooleanChange} name="isProfileVerified"/>}
                  label={ <Box  component="div">Profile Verified</Box> }
                />
              </FormGroup>
            </div>
          </div>

          {/* Filter modal content ends */}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={resetAllTenantSearchFilters}>
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

export default RoommateFilterModal;
