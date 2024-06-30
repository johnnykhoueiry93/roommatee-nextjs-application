"use client";

import React from "react";
import { useEffect, useState } from "react";
import "../../styles/Listings.css";
import SnackBarAlert from "../alerts/SnackBarAlerts";
import { SiteData } from "../../context/SiteWrapper";
import AddIcon from '@mui/icons-material/Add';
import NoListingFound from "./NoListingFound";
import ListingCard from "./ListingCard";
import { Fab } from "@mui/material";
import { useRouter } from 'next/navigation';
import "../../styles/Listings.css"
import MessageComponentLoader from "../loaders/MessageComponentLoader";


const UserListings = () => {
  //@ts-ignore
  const {  userInfo, userAuth, listing, setListing, listingsCreated, scrollToTop, setShowListingCreatedAlert, createListingStatus, setCreateListingStatus, setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity, snackbarMessage, snackbarOpen, snackbarSeverity } = SiteData();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // scrollToTop();
  
  const navigateToPage = (path) => {
    router.push(path);
  };

  const redirectUserToCreateNewListing = () => {
    console.log( 'The user clicked on the plus button from the listings screen to create a new listing' );
    navigateToPage('/list-a-room');
  };


  useEffect(() => {
    if (!userAuth) {
      navigateToPage("/login");
    } 
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

      /**
   * GET ALL USER LISTINGs
   */
       useEffect(() => {
        // This delay allows the record to get inserted before we try to retrieve everything again.
        const delay = 100; // 100ms
    
        async function getUserListings(user) {
          if (!user) return;
          
          const { id: userProfileId, emailAddress } = user;
    
          try {
            const response = await fetch('/api/getUserListings', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userProfileId, emailAddress }),
            });
    
            if (!response.ok) {
              throw new Error('Failed to fetch user listings');
            }
    
            const data = await response.json();
    
            setListing(data);
            localStorage.setItem('userListings', JSON.stringify(data));
            console.log('getUserListings:', data);
            return data;
          } catch (error) {
            console.error('Error fetching user listings:', error);
            throw error;
          }
        }
    
        // Ensure userInfo is available before calling the function
        if (userInfo) {
          const timeout = setTimeout(() => {
            getUserListings(userInfo);
          }, delay);
    
          // Cleanup timeout on component unmount or on dependency change
          return () => clearTimeout(timeout);
        }
      }, [listingsCreated]);



  if (!isHydrated) {
    return <div><MessageComponentLoader loadingMessage={"Loading user listing..."}/></div>; 
  }




    return (
    // @ts-ignore
    <div className="container-fluid" style={{'paddingBottom': '100px'}}>
      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />

    {/* You HAVE X LISTINGS HEADER */}
      <h2 className="card-user-count-heading">
        You have {listing.length}{" "}
        {listing.length > 1 ? "listings" : "listing"}
      </h2>

      <p className="listings-view-plus-icon" > 
      <Fab color="secondary" aria-label="delete" size="medium" style={{ zIndex: 0 }} onClick={redirectUserToCreateNewListing}>
              <AddIcon  />
            </Fab>
      </p>

      {listing.length > 0 ? (
        <ListingCard listing={listing} />
      ) : (
        <NoListingFound />
      )}
    </div>
  );
};

export default UserListings;
