"use client";

import React, { useState, useEffect } from "react";
import { SiteData } from "../../context/SiteWrapper";
import TenantCard from "./TenantCard";
import FiltersBar from "../modals/FiltersBar";
import "../../styles/SearchResults.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "../../styles/searchTenant/SearchTenantResults.css";
import "../../styles/SearchResults.css";
import AutocompleteSearchBar from "../modals/AutocompleteSearchBar";

const SearchTenantResults = () => {
  // @ts-ignore
  const { isMobile, userInfo, userAuth, searchResults, priceSortDirection, searchFilterType, listingCreatedDateSortDirection, searchValue } = SiteData();

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
      (result) => result.id !== userInfo.id
    );
  }

  sortedSearchResults.sort((a, b) => {
    if (searchFilterType === "price") {
      if (priceSortDirection === "asc") {
        return a.budget - b.budget; // Ascending order
      } else {
        return b.budget - a.budget; // Descending order
      }
    } else {
      const dateA = new Date(a.lastLoginDate);
      const dateB = new Date(b.lastLoginDate);

      // @ts-ignore
      const dateComparison = dateA - dateB;
      if (listingCreatedDateSortDirection === "asc") {
        return -dateComparison; // Ascending order
      } else {
        return dateComparison; // Descending order
      }
    }
  });

  console.log(searchResults);

  /**
   * Configuration and properties for the pagination
   */
  const itemsPerPage = 18;
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

  return (
    <div className="container-flex">
      <div style={{ width: "100%" }}>
        
        <div className="col-12 col-lg-6 p-2 " style={{width: isMobile ? '100%' : '50%'}}>
          {/* ------------------------- TENANT SEARCH BAR ------------------------- */}
          <AutocompleteSearchBar
            searchRouter={"/searchProfile"}
            nextPage={"/find-a-tenant-results"}
            profileType={'tenant'}
          />
        </div>

        <div className='pt-1'>
          {/* ------------------------- TENANT FILTERS ------------------------- */}
          <FiltersBar filterRouter ={'tenant'}/>
        </div>

        <div className="mb-3">
          {searchResults.length > 0 ? (
            <div className="returned-results-counter">
               <h4>{sortedSearchResults.length}{" "}{sortedSearchResults.length === 1 ? "result" : "results"} for tenants in "{searchValue.rawAddressValue}"</h4>
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
          {/* ############################################  CARDS ############################################ */}
          <div
            className="listing-panels"
            // @ts-ignore
          >
            <div>
              <div className="profiles-conatiner">
                <div className="row">
                  {paginatedResults.map(
                    //@ts-ignore
                    (result, index) => (
                      <div className="col-12 col-md-6 col-lg-2" key={index}>
                        <TenantCard result={result} />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className='mb-5'>
                <Stack spacing={2} justifyContent="center" mt={-1}>
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

export default SearchTenantResults;
