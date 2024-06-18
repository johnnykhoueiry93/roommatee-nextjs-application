"use client";

import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TenantFilterModal from "../searchTenant/TenantFilterModal";
import SearchFilterModal from "../search/SearchFilterModal";
// import RoommateFilterModal from "../searchRoommate/RoommateFilterModal";
import React, { useState } from "react";
import { SiteData } from "../../context/SiteWrapper";
import "../../styles/SearchFilters.css";

//@ts-ignore
const FiltersBar = ({ filterRouter  }) => {
  const [age, setAge] = useState("");
  const [setOpen] = useState(false);
  // @ts-ignore
  const {isMobile, badgeFilterShow, setBadgeFilterShow, countEnabledSearchFilters, setCountEnabledSearchFilters, priceSortDirection,setPriceSortDirection,listingCreatedDateSortDirection,setListingCreatedDateSortDirection,setSearchFilterType,searchResults} = SiteData();


  // @ts-ignore
  const handlePriceSortChange = (e) => {
    console.log( "The user changed the price/budget sorting order to: " + e.target.value );
    setPriceSortDirection(e.target.value);
    setSearchFilterType("price");
  };

  // @ts-ignore
  const handleListingDateSortChange = (e) => {
    console.log( "The user changed the listing date sorting order to: " + e.target.value );
    setListingCreatedDateSortDirection(e.target.value);
    setSearchFilterType("createdDate");
  };

  function returnPriceOrBudgetLabel() {
    let label = 'Price';
    if(filterRouter == 'tenant') {
      label = 'Budget';
    }
    return label;
   }

  function returnDateLabel() {
    let label = 'Date';
    if(filterRouter == 'tenant') {
      label = 'Last Seen';
    }
    return label;
   }

   function returnFilterModal() {
    if (filterRouter === 'listings') {
      return <SearchFilterModal />;
    }  else if (filterRouter === 'tenant') {
       return <TenantFilterModal />;
    // } else if (filterRouter === 'roommate') {
    //   return <RoommateFilterModal />;
    } else {
      return null; // Or any default component you want to render
    }
   }

   function returnVarticalSeparator() {
    return <div className="verticale-separator"> </div>;
  }
  
  return (
    <div id="filterContainterId" className="filter-container">
      {/* ------------------------- ALL FILTERS -------------------------*/}

      {returnFilterModal()}

      {returnVarticalSeparator()}

      {/* ------------------------- PRICE SORT -------------------------*/}
      <FormControl 
      
        className="price-sort"
      >
        <InputLabel
          id="price-sort"
        >
          {returnPriceOrBudgetLabel()}
        </InputLabel>
        <Select
          sx={{
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "blue",
              fontSize: "20px",
              width: isMobile ? "100%" : undefined
            },
          }}
          value={priceSortDirection}
          labelId="price-sort"
          id="demo-simple-select"
          label={returnPriceOrBudgetLabel()}
          onChange={handlePriceSortChange}
        >
          <MenuItem value="asc">Low to High</MenuItem>
          <MenuItem value="des">High to Low</MenuItem>
        </Select>
      </FormControl>

      {/* ------------------------- DATE SORT -------------------------*/}
      <FormControl 
      style={
        // @ts-ignore
        { "paddingLeft": "10px" }
      }
        className="date-sort"
      >
                <InputLabel
          id="date-sort"
        >{returnDateLabel()}</InputLabel>
        <Select
          sx={{
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "blue",
              fontSize: "20px",
              width: isMobile ? "100%" : undefined
            },
          }}
          labelId="date-sort"
          id="demo-simple-select"
          label={returnDateLabel()}
          onChange={handleListingDateSortChange}
        >
          <MenuItem value="asc">Newest to Oldest</MenuItem>
          <MenuItem value="des">Oldest to Newest</MenuItem>
        </Select>
      </FormControl>


    </div>
  );
};

export default FiltersBar;
