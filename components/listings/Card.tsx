import React from "react";
import { useRouter } from 'next/navigation';
// import BackendAxios from "../../backend/BackendAxios";
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
  const { setListing } = SiteData([]);
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
    const fetchS3Url = (key, setS3Url) => {
      /**
       * Logic update
       * fetch call to backend to get the first picture
       * from the database we need to return all the pictures column and select the first picture as the primary
       */


      // BackendAxios.post(`/getS3PictureUrl/${key}`)
      //   .then((response) => {
      //     setS3Url(response.data.s3Url);
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //   });
    };

    useEffect(() => {
      fetchS3Url(listingItem.picture1, setS3UrlPicture1);
    }, [listingItem.picture1]);

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
      return (
        <div>
        <img
          className="card-image-preview"
          src={s3UrlPicture1}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = "/images/listing_placeholder.jpg";
          }}
          alt={`Listing ${listingItem.id}`}
        />
      </div>
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
