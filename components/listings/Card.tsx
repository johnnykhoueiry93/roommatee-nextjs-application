import React from "react";
import { useRouter } from 'next/navigation';
import ReactResponsiveCarousel from "../modals/ReactResponsiveCarousel";
import { SiteData } from "../../context/SiteWrapper";
import { useState, useEffect } from "react";
import "../../styles/Card.css";
import "../../styles/Chip.css";
import DeleteListing from "../modals/DeleteListing";
import { Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Typography from "@mui/material/Typography";
import Skeleton from '@mui/material/Skeleton';


// @ts-ignore
const Card = ({ listingItem, index, listing }) => {
  const router = useRouter();

  // @ts-ignore
  const { setListing, userInfo, setEditListingId, setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity, setEditListingDetails, snackbarOpen, snackbarSeverity } = SiteData([]);
  const [deleteConfirmationShow, setDeleteConfirmationShow] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading status

  const navigateToPage = (path) => {
    localStorage.setItem('navigatedToEditListing', 'true');
      router.push(path);
    };
    
    useEffect(() => {
      setLoading(false); // Simulating content loaded after some time
    }, []);


  const redirectUserToFullCardDetails = () => {
    console.log( `The user clicked on Edit button for listing item with ID: ${listingItem.id}`);
    setEditListingId(listingItem.id);
    setEditListingDetails(listingItem);
    localStorage.setItem('storedEditListingId', listingItem.id);
    localStorage.setItem('storedEditListingDetails', JSON.stringify(listingItem));
    console.log( `Setting setEditListingId to value: ${listingItem.id}`);
    navigateToPage('/edit-place-listing');
  };

  const showDeleteConfirmationPopup = () => {
    console.log(
      `The user clicked on Delete button for listing item with ID: ${listingItem.id}`
    );
    setDeleteConfirmationShow(true);
  };

  // @ts-ignore
  const deleteRoomListing = async (id) => {
    console.log(`The user clicked on Delete for listing item with ID: ${id}`);
    const formData = new FormData();
    formData.append("userProfileId", userInfo.id);
    formData.append("id", listingItem.id);
    formData.append("emailAddress", userInfo.emailAddress);


    try {
      const response = await fetch("/api/deleteRoomListing", {
        method: "POST",
        body: formData, 
        cache: 'no-store'
      });
    
      if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText);
      }
    
      const data = await response.json();

      if (response.status === 200) {
        console.log("Place listing added successfully");
        const newListingAfterDelete = listing.filter((card) => card.id !== id);
        setListing(newListingAfterDelete);
        localStorage.setItem("userListings", JSON.stringify(newListingAfterDelete));

        setSnackbarMessage(data.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        console.error("Error room listing: " + data.message);
        setSnackbarMessage("Error creating place listing");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      // Handle the error here
      console.error("Error:", error);
    }
  };

    //@ts-ignore
    function shortenAddress(address, maxLength = 65) {
      if (address.length <= maxLength) {
        return address;
      } else {
        return `${address.substring(0, maxLength)}...`;
      }
    }

    function returnPriceEditDeleteSection() {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '15px' }}>
          <Typography gutterBottom variant="h5" component="div" style={{ margin: 0 }}>
            ${listingItem.price}
          </Typography>
    
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Fab
              color="secondary"
              aria-label="edit"
              size="small"
              onClick={redirectUserToFullCardDetails}
              style={{ zIndex: 0 }}
            >
              <EditIcon />
            </Fab>
    
            <Fab
              color="secondary"
              aria-label="delete"
              size="small"
              onClick={showDeleteConfirmationPopup}
              style={{ zIndex: 0 }}
            >
              <DeleteForeverIcon />
            </Fab>
          </div>
        </div>
      );
    }

    function returnImageCarouselPreview() {
      return (
        <ReactResponsiveCarousel selectedCardDetails={listingItem} carouselHeight={'200'}/>
      )
    }

    function returnCardTitleHeader() {
      return (
        <div className="card-title">
          {index === 0 || listingItem.id !== listing[index - 1].id ? (
            <Typography gutterBottom variant="h6" component="div">
               {shortenAddress(listingItem.address + " " + listingItem.city + " " + listingItem.state )}
            </Typography>
          ) : null}
        </div>
      )
    }

  return (
    <div key={listingItem.imageId} className="card-body">
      {/* ------------------------------- IMAGE PREVIEW ------------------------------- */}
      {returnImageCarouselPreview()}

      <div className="card-details-container">
        {/* ------------------------------- TITLE ------------------------------- */}
        {returnCardTitleHeader()}

        <hr />

        {/* ------------------------------- PRICE ------------------------------- */}
        {returnPriceEditDeleteSection()}
      </div>

      <DeleteListing
        show={deleteConfirmationShow}
        listingItem={listingItem}
        deleteRoomListing={deleteRoomListing}
        onHide={() => setDeleteConfirmationShow(false)}
      />
    </div>
  );
};

export default Card;
