"use client";

import { SiteData } from "../../context/SiteWrapper";
import { useEffect, useState } from "react";
import RommateCard from "../searchRoommate/RommateCard";
import HomePageTitle from "./HomePageTitle";

const RoommatesHighlight = () => {
    //@ts-ignore
    const { isMobile, homepageRoommatesResults, setHomepageRoommatesResults, searchValue, tenantFilters } = SiteData();
    // const cachedResults = localStorage.getItem('homePageRoommates');
    
      // @ts-ignore
      const returnHomePageRoommates = async () => {
      
        // if (cachedResults) {
        // try {
        //     const parsedResults = JSON.parse(cachedResults);
        //     setHomepageRoommatesResults(parsedResults);
        //     console.log('Loaded search results from local storage');
        //     return; // Exit function if results found in local storage
        // } catch (error) {
        //     console.error('Error parsing cached search results:', error);
        //     // Consider clearing the cached data if parsing fails consistently
        //     localStorage.removeItem('homePageRoommates');
        // }
        // }
      
        console.log(`############## Searching with value: >${searchValue.rawAddressValue}<`);
      
        let profileType = 'roommate';
        let profileLimit = 12;
        let homePageRequest = true;
        let requestedData = { searchValue, tenantFilters, profileType, profileLimit, homePageRequest};
      

        try {
          console.log('frontend requestedData: ' , requestedData)
          const response = await fetch(`/api/searchProfile`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestedData),
            // cache: 'no-store'
          });
        
          if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
          }
        
          const data = await response.json();
      
          if (response.status === 200) {
            setHomepageRoommatesResults(data);
            localStorage.setItem('homePageRoommates', JSON.stringify(data));
            console.log("The search returned results of count: ", data.length);
            console.log("The search returned object: ", data);
          } else {
            console.log("Error completing the search: ");
      
          }
        } catch (error) {
          // Handle the error here
          console.error("Error:", error);
        }
      };

  useEffect(() => {
    returnHomePageRoommates();
  },[])

  const itemsPerPage = 18;
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = homepageRoommatesResults.slice(startIndex, endIndex);
    return (
        <div>
            <HomePageTitle title={'Find Local Rommates'}/>
    
{homepageRoommatesResults && homepageRoommatesResults.length > 0 ? (
        // [ROOMT-88] - Conditional formatting included
        <div
          className={`${isMobile ? "" : "row"}`}
          style={{
            width: "100%",
            ...(isMobile ? {} : { paddingLeft: "10px" }),
          }}
        >
          {/* ############################################  CARDS ############################################ */}
          <div className="listing-panels">
            <div>
            <div className="profiles-conatiner container">
  <div className="row">
    {/* Get the first 12 records only */}
    {paginatedResults.slice(0, 12).map(
        //@ts-ignore
      (result, index) => (
        <div className="col-12 col-md-6 col-lg-2" key={index}>
          <RommateCard result={result} />
        </div>
      )
    )}
  </div>
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
    )
}

export default RoommatesHighlight;