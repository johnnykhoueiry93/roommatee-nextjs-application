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

const UserListings = () => {
  //@ts-ignore
  const {  userAuth, listing, showListingCreatedAlert, setShowListingCreatedAlert, createListingStatus, setCreateListingStatus, setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity, snackbarMessage, snackbarOpen, snackbarSeverity } = SiteData();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

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
    } else {
      console.log('The value of userAuth is: ' + userAuth);
    }
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <div></div>; //TODO update to something better!!
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
