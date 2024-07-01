"use client";

import { SiteData } from "../../context/SiteWrapper";
import { useEffect, useState } from "react";
// import BackendAxios from "../../backend/BackendAxios";
import HomePageTitle from "./HomePageTitle";
import SearchCard from "../search/SearchCard";

const RoomHighlights = () => {
    //@ts-ignore
    const { isMobile, setHomepageRoomResults, homepageRoomResults, searchValue, tenantFilters } = SiteData();
    // const cachedResults = localStorage.getItem('homePageRooms');
    
      // @ts-ignore
      const returnHomePageRooms = async () => {
      
        // console.log('The value of cachedResults is: ', cachedResults);
        // if (cachedResults) {
        // try {
        //     const parsedResults = JSON.parse(cachedResults);
        //     setHomepageRoomResults(parsedResults);
        //     console.log('Loaded search results from local storage');
        //     return; // Exit function if results found in local storage
        // } catch (error) {
        //     console.error('Error parsing cached search results:', error);
        //     // Consider clearing the cached data if parsing fails consistently
        //     localStorage.removeItem('homePageRooms');
        // }
        // }
      
        console.log(`############## Searching with value: >${searchValue.rawAddressValue}<`);
      
        let searchRouter = '/search';
        let profileLimit = 12;
        let requestedData = { searchValue, tenantFilters, profileLimit };
      
        try {
          console.log('frontend requestedData: ' , requestedData)
          const response = await fetch(`/api/searchListings`, {
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
            setHomepageRoomResults(data);
            localStorage.setItem('homePageRooms', JSON.stringify(data));
            console.log("The search returned results of count: ", data.length);
            console.log("The search returned object: ", data);
          } else {
            console.log("Error completing the search: ");
      
          }
        } catch (error) {
          // Handle the error here
          console.error("Error:", error);
        }


        // try {
        //   console.log('Function returnHomePageRooms from homepage started with WS /search');
        //   const response = await BackendAxios.post('/search', { requestedData }, {
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   });
      
        //   setHomepageRoomResults(response.data);
      
        //   localStorage.setItem('homePageRooms', JSON.stringify(response.data));
      
        //   console.log("The search returned results of count: ", response.data.length);
        //   console.log("The search returned object: ", response.data);
        // } catch (error) {
        //   console.log("Error completing the search: ", error);
        // }
      };

  useEffect(() => {
    returnHomePageRooms();
  },[])

  const itemsPerPage = 18;
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = homepageRoomResults.slice(startIndex, endIndex);
    return (
        <div>
            <HomePageTitle title={'Find Local Rooms'}/>
    
{homepageRoomResults && homepageRoomResults.length > 0 ? (
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
            <div className="profiles-conatiner">
            <div className="row">
              {/* @ts-ignore */}
                {paginatedResults.map((result, index) => (
                  <div className="col-12 col-md-6 col-lg-3" key={index}>
                    <SearchCard result={result} />
                  </div>
                ))}
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

export default RoomHighlights;