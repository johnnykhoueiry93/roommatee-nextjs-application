"use client";

import SnackBarAlert from "../alerts/SnackBarAlerts";
import { SiteData } from "../../context/SiteWrapper";
import AddIcon from '@mui/icons-material/Add';
import { Fab } from "@mui/material";
import { useRouter } from 'next/navigation';

const UserListings = () => {
  //@ts-ignore
  const {  listing, showListingCreatedAlert, setShowListingCreatedAlert, createListingStatus, setCreateListingStatus, setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity, snackbarMessage, snackbarOpen, snackbarSeverity } = SiteData();
  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };

  const redirectUserToCreateNewListing = () => {
    console.log( 'The user clicked on the plus button from the listings screen to create a new listing' );
    navigateToPage('/list-a-room');
  };


    return (
    // @ts-ignore
    <div className="container-fluid" style={{'padding-bottom': '100px'}}>
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

      {/* {listing.length > 0 ? (
        <ListingCard listing={listing} />
      ) : (
        <NoListingFound />
      )} */}
    </div>
  );
};

export default UserListings;
