import React from "react";
import "../../styles/SearchCard.css";
import UserChip from "./UserChip";
import { SiteData } from "../../context/SiteWrapper";
import Stack from "@mui/material/Stack";
import { useRouter } from 'next/navigation';
import { getProfilePictureUrl } from '../../utils/utilities'
import { useEffect, useState } from "react";
import ReactResponsiveCarousel from "../modals/ReactResponsiveCarousel";

//@ts-ignore
import { calculateDaysSinceCreation } from '../../utils/utilities'

// @ts-ignore
const SearchCard = ({ result }) => {
  // @ts-ignore
  const { setLatitude, setLongitude, setMapAddress, userAuth, intendedDestination, setIntendedDestination } = SiteData();
  const [recipientAvatarImgSource, setRecipientAvatarImgSource] = useState(""); // State to manage the avatar source
  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };

  //@ts-ignore
  function shortenAddress(address, maxLength = 65) {
    if(address) {
      if (address.length <= maxLength) {
        return address;
      } else {
        return `${address.substring(0, maxLength)}...`;
      }
    }
  }

  const handleOnSearchCardClick = () => {
    console.log( `The user clicked on the search card with id: ${result.listingId}` );

    // Reset and nullify the selectedCardDetails in session storage
    // Why doing this? because once I open the TenantCardDetails if the user refreshes 
    // I dont lose the data and error out. But since I'm saving that data in a cookie, 
    // every time I change the tenant selection I need to reset that cookie and save the 
    // new cookie value so that I'm not always showing the same tenant for any selected
    // card.
    localStorage.removeItem('selectedCardDetails');
    setIntendedDestination(`/listingView/${result.listingId}`);
    navigateToPage(`/listingView/${result.listingId}`);
    setIntendedDestination(`/listingView/${result.listingId}`);
  };

  // this useEffect will get the recipient's picture on load once
  useEffect(() => {
    const fetchData = async () => {
      const response = await getProfilePictureUrl(result.userId);
      console.log(`[DEBUG] - [SearchCard] - [Listing ID: ${result.listingId} - ${result.address} - ${result.firstName} ${result.lastName}] - For user id: ${result.userId} setting profile picture url: ${response}`);
      setRecipientAvatarImgSource(response); // Set the avatar source
    }

    fetchData();
  }, []); // Empty dependency array to run the effect only once


  function returnCarouselImagePreview() {
    return (
      <div className="image-container">
        <ReactResponsiveCarousel selectedCardDetails={result} carouselHeight={200} />
        <div className="label-posted-since-v2">
          {`${calculateDaysSinceCreation(result.createdDate)}`}
        </div>
      </div>
    )
  }

  return (
    <div
      className="search-card-body"
      onMouseEnter={() => {
        // Update latitude and longitude values when hovering
        // console.log( `[DEBUG] - Setting the longitude to ${result.longitude} and the latitude to ${result.latitude}` );
        setLatitude(result.latitude);
        setLongitude(result.longitude);
        setMapAddress(result.address);
      }}
      onClick={handleOnSearchCardClick}
    >
      {/* ---------------------------------- IMAGE PREVIEW ---------------------------------- */}
      {returnCarouselImagePreview()}

      <div className="search-card-details-container">
        {/* CARD AUTHOR / POSTER */}

        <div className="listing-created-by-label">
          <Stack direction="row" spacing={1}>
            <UserChip
              firstName={result.firstName}
              lastName={result.lastName}
              profilePicture={recipientAvatarImgSource}
            />{" "}
            <span className="result-search-listing-type">
              {result.listingType}
            </span>
          </Stack>
        </div>

        {/* Listing Address */}
        <div className="listing-address">
          {" "}
          {shortenAddress(result.city + ", " + result.state)}{" "}
        </div>

        {/* Listing Price with comma for each thousand */}
        <div className="search-card-price">
          ${new Intl.NumberFormat().format(result.price)}/mo
        </div>

      </div>
    </div>
  );
};

export default SearchCard;
