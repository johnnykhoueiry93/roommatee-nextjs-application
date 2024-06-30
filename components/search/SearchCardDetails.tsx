import "../../styles/SearchCardDetails.css";
import { useParams, Link } from "react-router-dom";
import { SiteData } from "../../context/SiteWrapper";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import GoogleMap from "./GoogleMap";
import AccomodationsSection from "./AccomodationsSection";
import AccessibilityPerks from "./AccessibilityPerks";
import { useRouter } from 'next/navigation';
import SendMessage from "./SendMessage";
import ReactResponsiveCarousel from "../modals/ReactResponsiveCarousel";
import BackToResultsBtn from "../modals/BackToResultsBtn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { calculateDaysSinceCreation } from '../../utils/utilities'
import MessageComponentLoader from "../loaders/MessageComponentLoader";

const SearchCardDetails = ({listingId}) => {
  //@ts-ignore
  const [selectedCardDetails, setSelectedCardDetails] = useState<CardDetails | null>(null);
  const [hostAvatarImgSource, setHostAvatarImgSource] = useState(""); // State to manage the avatar source

  // this is the ID picked up from the URL parameter
  const { tt } = useParams();
  const router = useRouter();

  const navigateToPage = (path) => {
    router.push(path);
  };

  // @ts-ignore
  const { isMobile, userAuth, userInfo, searchResults, setLatitude, setLongitude, setMapAddress } = SiteData();
  
  useEffect(() => {
    // Scroll to the top when the component mounts or updates
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs only once when the component mounts
 

  useEffect(() => {
    if (!userAuth) {
      navigateToPage("/login");
    } 
  }, []);



     useEffect(() => {
      // Logic 1: Check if selectedCardDetails exists in local storage
      // @ts-ignore
      let selectedCardDetailsFromStorage = JSON.parse(localStorage.getItem("selectedCardDetails"));
  
      // Logic 2: If not found in local storage, check searchResults from drilldown click
      if (!selectedCardDetailsFromStorage) {
        // @ts-ignore
        const foundCard = searchResults.find((selectedCard) => selectedCard.listingId.toString() === listingId);
        if (foundCard) {
          console.log('Logic #2 return the selectedCardDetails from drilldown searchResults')
          setSelectedCardDetails(foundCard);
          setLatitude(foundCard.latitude);
          setLongitude(foundCard.longitude);
          setMapAddress(foundCard.address);

          localStorage.setItem("selectedCardDetails", JSON.stringify(foundCard));
          getAvatar(foundCard);
          return; // Exit the useEffect early if card is found in searchResults
        }
      } else {
        setSelectedCardDetails(selectedCardDetailsFromStorage);
        setLatitude(selectedCardDetailsFromStorage.latitude);
        setLongitude(selectedCardDetailsFromStorage.longitude);
        setMapAddress(selectedCardDetailsFromStorage.address);

        console.log('Logic #1 return the selectedCardDetails in the local storage: ' , selectedCardDetailsFromStorage);
        getAvatar(selectedCardDetailsFromStorage);
        return; // Exit the useEffect early if card is found in local storage
      }
  
      // Logic 3: If neither logic 1 nor logic 2 finds the card, fetch it
      // Also required for sharing the link only.
      const fetchData = async () => {
        console.log('Logic #3 return the selectedCardDetails from WS call to backend')

        let requestedData = { listingId };

        if(userAuth) {
          // if the user is authenticated send the user info as well
          //@ts-ignore
          requestedData = { ...requestedData, userInfo };
        }

        try {
          const response = await fetch('/api/searchListingById', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requestedData })
          });
          const data = await response.json();

          const fetchedCard = data[0];
          setSelectedCardDetails(fetchedCard);
          setLatitude(fetchedCard.latitude);
          setLongitude(fetchedCard.longitude);
          setMapAddress(fetchedCard.address);

          getAvatar(fetchedCard);
          
          console.log("[DEBUG] - [SearchCardDetails.tsx] - Setting the user profile picture to URL: " + data.s3Url);
          setHostAvatarImgSource(data.s3Url)
          console.log("[DEBUG] - [SearchCardDetails.tsx] - Setting in storage hostAvatarProfilePicture: " + data.s3Url);
          localStorage.setItem("hostAvatarProfilePicture", JSON.stringify(data.s3Url));
        } catch (error) {
          console.error("Error:", error);
        }
      }
  
      fetchData();

    }, [listingId, searchResults]); // Include listingId and searchResults in the dependency array






     async function getAvatar(fetchedCard) {
      const key = `${fetchedCard.userId}-profile-picture.png&folder=profile-picture`;
      
      try {
        const response = await fetch(`/api/getS3PictureUrl?key=${key}`, {
          method: 'POST',
        });
        const data = await response.json();
        
        console.log("Setting the user profile picture to URL: " + data.s3Url);
        setHostAvatarImgSource(data.s3Url)
        console.log("[SearcCardDetails] - Setting in storage hostAvatarProfilePicture: " + data.s3Url);
        localStorage.setItem("hostAvatarProfilePicture", JSON.stringify(data.s3Url));
      } catch (error) {
        console.error("Error:", error);
      }
    }

  if (!selectedCardDetails) {
    return (<div><MessageComponentLoader loadingMessage={"Loading listing..."}/></div>)
  }

  const searchResultChipAvatarStyle = {
    ...(isMobile
      ? { height: "70px", width: "70px" }
      : { height: "60px", width: "60px" }),
  };


  //@ts-ignore
  function convertToYesNo(value) {
    return value === 1 ? "Yes" : "No";
    }

    function returnListingImages() {
      let carouselHeight = isMobile ? 255 : 600;
      return (
        <>
          <div>
            <ReactResponsiveCarousel
              selectedCardDetails={selectedCardDetails}
              carouselHeight={carouselHeight}
            />
          </div>
        </>
      );
    }
    
    
    function returnRoomListingPriceAndAddressSection() {
      return (
        <div className='section-grouping-border'>
        <h2><div className="price mb-2">${new Intl.NumberFormat().format(selectedCardDetails.price)} USD</div></h2>
        <h2>{selectedCardDetails.listingType}</h2>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span><LocationOnIcon/>{selectedCardDetails.address}, {selectedCardDetails.city},{selectedCardDetails.zip} {selectedCardDetails.state}{" "}</span>
          <span>{calculateDaysSinceCreation(selectedCardDetails.createdDate)}</span>
        </div>
      </div>
      )
    }

    function returnHostSection() {
      return (
        <div className='section-grouping-border'>
      <div className="row ">
        <div className="col-12 col-lg-7 col-md-7 ">
          <div className="avatar">
            <Avatar
              alt={selectedCardDetails.firstName}
              src={hostAvatarImgSource}
              style={searchResultChipAvatarStyle}
            />
            <span className="hosted-by">
              Hosted by {selectedCardDetails.firstName}
              <br />
              {selectedCardDetails.isProfileVerified === 1 && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <VerifiedIcon sx={{ color: "blue" }} />
                  <span style={{ marginLeft: "4px" }}>Verified User</span>
                </div>
              )}
            </span>
            </div>
          <div className="description">{selectedCardDetails.description}</div> 
        </div>

        {/* Without checking if the user is authenticated the page was
        erroring out on the firebase usage in SendMessage component */}
        {
          userAuth && (
            <div className="col-12 col-lg-5 col-md-5">
              <SendMessage
                selectedCardDetails={selectedCardDetails}
                targetUserId={selectedCardDetails.userId}
                cardId={selectedCardDetails.listingId}
                topicUrl={window.location.href}
              />
            </div>
          )
        }


      </div>
      </div>
      )
    }

    function returnAdditionalInfo() {
      return (
        <div className='section-grouping-border'>
        <div className="row">
          <div className="col-4"><span className="span-section">Move-In Ready</span><br /><span className="span-section-result">Immediatly</span></div>
          <div className="col-4"><span className="span-section">Housing Type</span><br /><span className="span-section-result">{selectedCardDetails.listingType}</span></div>
          <div className="col-4"><span className="span-section">Furnished</span><br /><span className="span-section-result">{convertToYesNo(selectedCardDetails.furnished)}</span></div>
        </div>
        </div>
      )
    }

    if (userAuth) {
  return (
    <div className="container container-elements">

      <BackToResultsBtn prevPage={"/find-a-room-results"} text={"Back to search results"}/>

      {/* -----------ROOM LISTING IMAGE GALLERY SECTION ----------- */}
      {returnListingImages()}
      
      {/* ----------- ROOM LISTING PRICE ----------- */}
      {returnRoomListingPriceAndAddressSection()}

      {/* ----------- ROOM LISTING HOST DETAILS ----------- */}
      {returnHostSection()}

      {/* ----------- ROOM LISTING DESCRIPTION ----------- */}
      {returnAdditionalInfo()}

      {/* ------------------------------ Accomodation Includes ------------------------------ */}
      <div className='section-grouping-border'>
      <AccomodationsSection selectedCardDetails={selectedCardDetails}/>
      </div>

      {/* ------------------------------ Accessibility Perks ------------------------------ */}
      <div className='section-grouping-border'>
      <AccessibilityPerks selectedCardDetails={selectedCardDetails}/>
      </div>

      <div className='section-grouping-border'>
      <h2>Location</h2>
        <GoogleMap mapHeight="500px"/>
    </div>
    </div>
  );
    }
  
 
};

export default SearchCardDetails;
