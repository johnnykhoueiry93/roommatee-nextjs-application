"use client";

import React, { useState, useEffect } from "react";
import { SiteData } from "../../context/SiteWrapper";
import SearchCard from "./SearchCard";
import ResultsSearchBar from "./ResultsSearchBar";
import FiltersBar from "../modals/FiltersBar";
import GoogleMap from "./GoogleMap";
import "../../styles/SearchResults.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const SearchResults = () => {
  // @ts-ignore
  const { isMobile, isTablet, userInfo, userAuth, searchResults, priceSortDirection, searchValue, searchFilterType, listingCreatedDateSortDirection,
  } = SiteData();

  /**
   * This logic here will be exluding all the listings of the current user
   * Meaning if User X posted listing A
   * User X will not be able to see listing A but other users will be able to see it
   */
  let sortedSearchResults = [...searchResults];

  // Check if userAuth is present
  if (userAuth) {
    // If userAuth exists, perform the filter
    sortedSearchResults = sortedSearchResults.filter(
      (result) => result.userId !== userInfo.id
    );
  }

  sortedSearchResults.sort((a, b) => {
    if (searchFilterType === "price") {
      if (priceSortDirection === "asc") {
        return a.price - b.price; // Ascending order
      } else {
        return b.price - a.price; // Descending order
      }
    } else {
      const dateA = new Date(a.createdDate);
      const dateB = new Date(b.createdDate);

      // @ts-ignore
      const dateComparison = dateA - dateB;
      if (listingCreatedDateSortDirection === "asc") {
        return -dateComparison; // Ascending order
      } else {
        return dateComparison; // Descending order
      }
    }
  });

  const containerStyles = {
    overflowY: "auto",
    // Conditionally set minHeight or maxHeight based on the screen width
    ...(isMobile ? { minHeight: "100vh" } : { maxHeight: "100vh" }),
  };

  /**
   * Configuration and properties for the pagination
   */
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  //@ts-ignore
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // Scroll back to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = sortedSearchResults.slice(startIndex, endIndex);


  function calculateScreenSizeWithoutTopNavBar() {
    const navBar = document.getElementById('topNavBarId'); // Replace 'yourNavBarId' with the actual ID of your navigation bar
    const searchFilterResult = document.getElementById('searchFilterResultsId'); // Replace 'yourNavBarId' with the actual ID of your navigation bar
    const screenHeight = window.innerHeight;
    const navBarHeight = navBar ? navBar.offsetHeight : 0;
    const searchFilterResultHeight = searchFilterResult ? searchFilterResult.offsetHeight : 0;
    let containerHeight = screenHeight - navBarHeight - searchFilterResultHeight - 100;
    console.log('Returning chat screen height: ' + containerHeight);

    return containerHeight;
  }
  const mapHeight = calculateScreenSizeWithoutTopNavBar() -20;


  function calculateContainerHeight() {
    const navBar = document.getElementById('topNavBarId'); // Replace 'yourNavBarId' with the actual ID of your navigation bar
    const screenHeight = window.innerHeight;
    const navBarHeight = navBar ? navBar.offsetHeight : 0;
    let containerHeight = screenHeight - navBarHeight;
    console.log('Returning chat screen height: ' + containerHeight);

    return containerHeight;
  }


  return (
    <div className="container-flex">
      <div  id="searchFilterResultsId" style={{ width: "100%" }}>
        <div className="col-12 col-lg-6">
          {/* SEARCH BAR */}
          <ResultsSearchBar />

          {/* SEARCH FILTERS */}
          <FiltersBar filterRouter={"listings"} />
        </div>

        <div className="col-12 col-lg-6">
          {sortedSearchResults.length > 0 ? (
            <div className="returned-results-counter">
              <h4>
                {sortedSearchResults.length}{" "}
                {sortedSearchResults.length === 1 ? "result" : "results"} for
                places in "{searchValue.rawAddressValue}"
              </h4>
            </div>
          ) : null}
        </div>
      </div>

      {sortedSearchResults && sortedSearchResults.length > 0 ? (
        // [ROOMT-88] - Conditional formatting included
        <div
          className={`${isMobile ? "" : "row"}`}
          style={{
            width: "100%",
            ...(isMobile ? {} : { paddingLeft: "10px" }),
          }}
        >
          {/* ############################################  GOOGLE MAP ############################################*/}
          {/* If the platform is a mobile disable showing the google map */}
          {!isMobile && (
            <div className="col-md-6">
              <GoogleMap mapHeight={`${mapHeight}px`} />
            </div>
          )}

          {/* ############################################  CARDS ############################################ */}
          <div
            className="col-12 col-md-6 listing-panels"
             // Mobile allow full screen scroll 
            style={{height: `${calculateScreenSizeWithoutTopNavBar()}px`,  // @ts-ignore
            overflowY: isMobile ? '' : 'scroll', 
            paddingLeft: isMobile ? '10px' : '', 
            paddingRight: isMobile ? '10px' : ''}} 
          >
            <div>
              <div className={`${isMobile ? "" : "row"}`}>
                {paginatedResults.map((result, index) => (
                  <div className="col-12 col-lg-6" key={index}>
                    <SearchCard result={result} />
                  </div>
                ))}
              </div>

              <div className="mb-5 pb-1">
                <Stack spacing={2} justifyContent="center" mt={3}>
                  <Pagination
                    count={Math.ceil(sortedSearchResults.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    shape="rounded"
                  />
                </Stack>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-search-result-container">
          <p className="no-search-results-returned">
            Oops. No search results found. Please update your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
