import React from "react";
import { useRouter } from 'next/navigation';
// import BackendAxios from "../../backend/BackendAxios";
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

// @ts-ignore
const Card = ({ listingItem, index, listing }) => {
  const router = useRouter();

  // @ts-ignore
  const { setListing, userInfo } = SiteData([]);
  const [deleteConfirmationShow, setDeleteConfirmationShow] = useState(false);


  const navigateToPage = (path) => {
      router.push(path);
    };


  // @ts-ignore
  const bufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const redirectUserToFullCardDetails = () => {
    console.log(
      `The user clicked on Edit button for listing item with ID: ${listingItem.id}`
    );
    navigateToPage(`/editRoomListing/${listingItem.id}`);
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
    // try {
    //   await BackendAxios.delete(`/deleteRoomListing/${id}`);
    //   // @ts-ignore
    //   const newListingAfterDelete = listing.filter((card) => card.id !== id);
    //   setListing(newListingAfterDelete);
    // } catch (err) {
    //   // @ts-ignore
    //   console.log(`Error: ${err.message}`);
    // }
  };

    //@ts-ignore
    function shortenAddress(address, maxLength = 65) {
      if (address.length <= maxLength) {
        return address;
      } else {
        return `${address.substring(0, maxLength)}...`;
      }
    }

    // This is the pirmary preview picture
    const [ s3UrlPicture1, setS3UrlPicture1] = useState("");

    //@ts-ignore
    async function fetchS3Url(pictureFilename) {

      const key = `${pictureFilename}`;
      console.log(`Trying to fetch the S3 url for key: ${key}`);
    
      try {
        const response = await fetch(`/api/getS3PictureUrl?key=${key}`, {
          method: 'POST',
        });
        const data = await response.json();
        
        console.log("Setting the user profile picture to URL: " + data.s3Url);
        // setUserProfilePicture(data.s3Url);
        // console.log("setting in storage userProfilePicture: " + data.s3Url);
        // localStorage.setItem("userProfilePicture", JSON.stringify(data.s3Url));
      } catch (error) {
        console.error("Error:", error);
      }
  }


    // useEffect(() => {
    //   console.log('listingItem.pictures', listingItem.pictures);

    //   if (listingItem.pictures) {
    //     const picturesArray = listingItem.pictures.split(',');

    //     if (picturesArray.length > 0) {
    //       picturesArray.forEach(picture => {
    //         console.log(picture);
    //         fetchS3Url(picture);
    //       });
    //     } else {
    //       console.log('No pictures found');
    //     }
    //   } else {
    //     console.log('No pictures available');
    //   }
    //   // then fetchS3Url(48_230_1.PNG); // using the first iteration, then second then third...

    // }, []);

    function returnPriceEditDeleteSection() {
      return (
        <div className="row p-1" style={{bottom: '0', display: 'flex', width: '100%'}}>
          <div className="col-6">
            <Typography gutterBottom variant="h5" component="div">
              ${listingItem.price}
            </Typography>
          </div>
          
          <div className="col-2 ml-auto" >
            <p
              className="details-button"
              onClick={redirectUserToFullCardDetails}
            >
              <Fab
                color="secondary"
                aria-label="edit"
                size="small"
                style={{ zIndex: 0 }}
              >
                <EditIcon />
              </Fab>
            </p>
          </div>

          <div className="col-2">
            <p className="details-button" onClick={showDeleteConfirmationPopup}>
              <Fab
                color="secondary"
                aria-label="delete"
                size="small"
                style={{ zIndex: 0 }}
              >
                <DeleteForeverIcon />
              </Fab>
            </p>
          </div>
          
        </div>
      )
    }

    function returnPrimaryImagePreview() {
      // return (
      //   <div>
      //   <img
      //     className="card-image-preview"
      //     src={s3UrlPicture1}
      //     onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
      //       (e.target as HTMLImageElement).onerror = null;
      //       (e.target as HTMLImageElement).src = "/images/listing_placeholder.jpg";
      //     }}
      //     alt={`Listing ${listingItem.id}`}
      //   />
      // </div>
      // )

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
      {returnPrimaryImagePreview()}

      <div className="card-details-container">
        {/* ------------------------------- TITLE ------------------------------- */}
        {returnCardTitleHeader()}
        <hr />

        {/* ------------------------------- CHIP ICON DETAILS ------------------------------- */}

        {/* <hr /> */}

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
