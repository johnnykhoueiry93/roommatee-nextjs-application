"use client";

import "../../styles/ResultsSearchBar.css";
import React, { useState, useEffect } from "react";
import { SiteData } from "../../context/SiteWrapper";
// @ts-ignore
// import BackendAxios from "../../backend/BackendAxios";
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SnackBarAlert from "../alerts/SnackBarAlerts";
import AutocompleteSearchBar from "../modals/AutocompleteSearchBar";

const ResultsSearchBar = () => {

  // @ts-ignore
  const { userInfo,setSearchResults, isMobile, minPriceFilter, setMinPriceFilter, maxPriceFilter, moveInDate, setMaxPriceFilter, moveInDateFilter, setMoveInDateFilter, searchValue, setSearchValue, booleanFilter, setBooleanFilter} = SiteData();
  const [age, setAge] = useState('');
  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  //@ts-ignore
  const showFailureAlert = (message) => {
    console.log(`Displaying to the user error message: ${message}`)
    setSnackbarMessage(message);
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  };

 /**
  * Initialize previous values using the initial state or values
  * This will hold the previous values so we can prevent the search from
  * triggering over and over if the user did not mofify his filter or
  * input
  */
const [prevSearchValue, setPrevSearchValue] = useState('');
const [prevMinPriceFilter, setPrevMinPriceFilter] = useState('');
const [prevMaxPriceFilter, setPrevMaxPriceFilter] = useState('');
const [prevMoveInDateFilter, setPrevMoveInDateFilter] = useState('');
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

  return keys1.every(key => filter1[key] === filter2[key]);
};

// @ts-ignore
  const handleInputChange = (e) => {
    console.log(
      "The user is searching in the primary home search value: " +
        e.target.value
    );
    setSearchValue(e.target.value);
  };


  // @ts-ignore
  // Check for changes and trigger the API call
  const handleSearchWithFilter = async (e) => {
    e.preventDefault(); // Prevents the form from submitting (reloading the page)

        // Trim leading and trailing spaces from the search value
        const trimmedSearchValue = searchValue.trim();

        // Check if the trimmed search value is empty
        if (!trimmedSearchValue) {
          // Display an error message or take appropriate action
          console.log("Showing snackbar to user with message: Please enter a search value");
          showFailureAlert("Please enter a search value");
          return;
        }

        let requestedData = { searchValue, userInfo, minPriceFilter, maxPriceFilter, moveInDate, booleanFilter };

    // Check if the search should be performed if any value changed from the previous value
    if (
      trimmedSearchValue !== prevSearchValue ||
      minPriceFilter !== prevMinPriceFilter ||
      maxPriceFilter !== prevMaxPriceFilter ||
      moveInDateFilter !== prevMoveInDateFilter ||
      !compareBooleanFilters(booleanFilter, prevBooleanFilter)
    ) {
      // try {
      //   const response = await BackendAxios.post(
      //     "/search",
      //     {
      //       requestedData
      //     },
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     }
      //   );

      //   setSearchResults(response.data);
      //   console.log("The search returned: ", response.data.length);
      // } catch (error) {
      //   console.log("Error completing the search: ", error);
      // }

      // Update previous values
      setPrevSearchValue(trimmedSearchValue);
      setPrevMinPriceFilter(minPriceFilter);
      setPrevMaxPriceFilter(maxPriceFilter);
      setPrevMoveInDateFilter(moveInDateFilter);
      setPrevBooleanFilter({ ...booleanFilter });
    } else {
      console.log('No change in search filter, supression call to reduce backend API calls');
    }
  };

  return (
    <div id="resultsSearchBarId" className="results-search-container">
      
      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />

      <div style={{width: isMobile ? '100%' : '100%' }}>
        <AutocompleteSearchBar searchRouter={'/searchListings'} nextPage={'/find-a-room-results'} profileType={''}/>
      </div>

    </div>
  );
};

export default ResultsSearchBar;
