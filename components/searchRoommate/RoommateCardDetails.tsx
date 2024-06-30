"use client";

import React from "react";
import BackToResultsBtn from "../modals/BackToResultsBtn";
import "../../styles/searchTenant/TenantCardDetails.css";
import { SiteData } from "../../context/SiteWrapper";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import SendMessage from "../search/SendMessage";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CakeIcon from "@mui/icons-material/Cake";
import SmokingRoomsIcon from "@mui/icons-material/SmokingRooms";
import SmokeFreeIcon from "@mui/icons-material/SmokeFree";
import PetsIcon from "@mui/icons-material/Pets";
import LanguageIcon from "@mui/icons-material/Language";
import CottageIcon from "@mui/icons-material/Cottage";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PaidIcon from "@mui/icons-material/Paid";
import WashIcon from "@mui/icons-material/Wash";
import ChairIcon from "@mui/icons-material/Chair";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import InfoPopup from "../modals/InfoPopup";
import ReactResponsiveCarousel from "../modals/ReactResponsiveCarousel";
import AccomodationsSection from "../search/AccomodationsSection";
import AccessibilityPerks from "../search/AccessibilityPerks";
import LeaseTerms from "../search/LeaseTerms";
import GoogleMap from "../search/GoogleMap";
import SectionHeading from "../modals/SectionTitle";
import { useRouter } from 'next/navigation';
import MessageComponentLoader from "../loaders/MessageComponentLoader";

const RoommateCardDetails = ({roommateId}) => {
  // @ts-ignore
  const { isMobile, userInfo, userAuth, searchResults, setLatitude, setLongitude, setMapAddress } = SiteData();

  const router = useRouter();

  const navigateToPage = (path) => {
    router.push(path);
  };


  useEffect(() => {
    // Scroll to the top when the component mounts or updates
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  useEffect(() => {
    if (!userAuth) {
      navigateToPage("/login");
    } 
  }, []);
  
  //@ts-ignore
  const [selectedCardDetails, setSelectedCardDetails] = useState<CardDetails | null>(null);
  const [recipientAvatarImgSource, setRecipientAvatarImgSource] = useState(""); // State to manage the avatar source
  const [messageSent, setMessageSent] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleSendMessage = () => {
    // Logic to handle sending the message
    // For example:
    // sendTheMessage();
    setMessageSent(true); // Update state to show the second div
  };

  useEffect(() => {
    // Logic 1: Check if selectedCardDetails exists in local storage
    // @ts-ignore
    let selectedCardDetailsFromStorage = JSON.parse( localStorage.getItem("selectedCardDetails") );

    // Logic 2: If not found in local storage, check searchResults from drilldown click
    if (!selectedCardDetailsFromStorage) {
      // @ts-ignore
      const foundCard = searchResults.find( (selectedCard) => selectedCard.id.toString() === roommateId );
      if (foundCard) {
        console.log(
          "Logic #2 return the selectedCardDetails from drilldown searchResults"
        );
        setSelectedCardDetails(foundCard);
        setLatitude(foundCard.latitude);
        setLongitude(foundCard.longitude);
        setMapAddress(foundCard.address);
        localStorage.setItem("selectedCardDetails", JSON.stringify(foundCard));
        getAvatar(foundCard);
        return; // Exit the useEffect early if card is found in searchResults
      }
    } else {
      console.log(
        "Logic #1 return the selectedCardDetails in the local storage"
      );
      setSelectedCardDetails(selectedCardDetailsFromStorage);
      setLatitude(selectedCardDetailsFromStorage.latitude);
      setLongitude(selectedCardDetailsFromStorage.longitude);
      setMapAddress(selectedCardDetailsFromStorage.address);
      getAvatar(selectedCardDetailsFromStorage);
      return; // Exit the useEffect early if card is found in local storage
    }

    // Logic 3: If neither logic 1 nor logic 2 finds the card, fetch it
    const fetchData = async () => {
      console.log("Logic #3 return the selectedCardDetails from WS call to backend using url param: " + roommateId);
      let emailAddress = userInfo.emailAddress;
      let idToSearchFor = roommateId;
      let querytype = "roommate"

      try {
        const response = await fetch('/api/searchTenantById', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ idToSearchFor, emailAddress, querytype })
        });
        const data = await response.json();

        const fetchedCard = data.results[0];
        console.log('[RoommateCardDetails] Returned fetchedCard: ' , fetchedCard);

        setSelectedCardDetails(fetchedCard);
        setLatitude(fetchedCard.latitude);
        setLongitude(fetchedCard.longitude);
        setMapAddress(fetchedCard.address);

        getAvatar(fetchedCard);
        
        // console.log("Setting the user profile picture to URL: " + data.s3Url);
        // setHostAvatarImgSource(data.s3Url)
        // console.log("[SearcCardDetails] - Setting in storage hostAvatarProfilePicture: " + data.s3Url);
        // localStorage.setItem("hostAvatarProfilePicture", JSON.stringify(data.s3Url));
      } catch (error) {
        console.error("Error:", error);
      }

    };

    fetchData();

  }, [roommateId, searchResults]); // Include id and searchResults in the dependency array

  //@ts-ignore
  async function getAvatar(fetchedCard) {
    
    const key = `${fetchedCard.id}-profile-picture.png&folder=profile-picture`;
    
    try {
      const response = await fetch(`/api/getS3PictureUrl?key=${key}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      console.log("[DEBUG] - [RoommateCardDetauls.tsx] - Setting the user profile picture to URL: " + data.s3Url);
      setRecipientAvatarImgSource(data.s3Url)
      console.log("[DEBUG] - [RoommateCardDetauls.tsx] - Setting in storage hostAvatarProfilePicture: " + data.s3Url);
      localStorage.setItem("hostAvatarProfilePicture", JSON.stringify(data.s3Url));
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if(!userInfo) {
    return (<div><MessageComponentLoader loadingMessage={"Loading user info..."}/></div>)
  }

  if (!selectedCardDetails) {
    return (<div><MessageComponentLoader loadingMessage={"Loading user"}/></div>)
  }

  const avatarStyle = {
    ...(isMobile
      ? { height: "130px", width: "130px" }
      : { height: "200px", width: "200px" }),
  };

  const aboutMeIconStyle = {
      fontSize: 35, 
      marginRight: "3px", 
      marginBottom: "10px",
      color: "#4CAF50",
  };

  const socialIconStyle = {
    ...(isMobile
      ? { height: "35px", width: "35px" }
      : { height: "40px", width: "40px" }),
    marginLeft: "9px",
    marginRight: "9px",
  };

  const muiSocialIconStyle = {
    ...(isMobile
      ? { height: "35px", width: "35px" }
      : { height: "35px", width: "35px" }),
    marginLeft: "8px",
    marginRight: "8px",
    color: "var(--roomatee-theme-color)",
  };

  function returnSocialStatus() {
    let valueToReturn;

    if (selectedCardDetails.socialStatus === "Employee") {
      valueToReturn = selectedCardDetails.socialstatusDetails;
    } else if (selectedCardDetails.socialStatus === "Student") {
      valueToReturn =
        selectedCardDetails.socialStatus +
        " at " +
        selectedCardDetails.socialstatusDetails;
    } else {
      valueToReturn = selectedCardDetails.socialStatus;
    }

    return (
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <p style={{ fontSize: "18px", color: "grey" }}>{valueToReturn}</p>
      </div>
    );
  }

  function returnGenderIcon() {
    if (selectedCardDetails.gender == "Male") {
      return (
        <>
          <MaleIcon style={aboutMeIconStyle} /> {selectedCardDetails.gender}
        </>
      );
    } else if (selectedCardDetails.gender == "Female") {
      return (
        <>
          <FemaleIcon style={aboutMeIconStyle} /> {selectedCardDetails.gender}
        </>
      );
    } else if (selectedCardDetails.gender == "Transgender") {
      return (
        <>
          <TransgenderIcon style={aboutMeIconStyle} />{" "}
          {selectedCardDetails.gender}
        </>
      );
    } else {
      return null;
    }
  }

  //@ts-ignore
  function openSocialMedia(platform) {
    let urlToOpen;

    if (platform === "instagram") {
      urlToOpen = selectedCardDetails.instagram;
    } else if (platform === "facebook") {
      urlToOpen = selectedCardDetails.facebook;
    } else {
      urlToOpen = selectedCardDetails.twitter;
    }

    if (urlToOpen) {
      window.open(urlToOpen, "_blank"); // Open the URL in a new tab
    }
  }

  function returnSocialIcons() {
    let icons = [];

    if (selectedCardDetails.isEmailVerified === 1) {
      icons.push(
        //@ts-ignore
        <Tooltip title="Email verified" placement="top-start">
          <img
            key="emailVerified"
            src={"/images/email-verified-icon.png"}
            style={socialIconStyle}
            alt="Email Verified"
          />
        </Tooltip>
      );
    }

    if (selectedCardDetails.isProfileVerified === 1) {
      icons.push(
        //@ts-ignore
        <Tooltip title="ID verified" placement="top-start">
          <img
            key="profileVerified"
            src={"/images/id-checked-icon.png"}
            style={socialIconStyle}
            alt="ID Verified"
          />
        </Tooltip>
      );
    }
    if (selectedCardDetails.showEmailAddressToPublic === 1) {
      icons.push(
        //@ts-ignore
        <Tooltip title="Email Address" placement="top-start">
          <MarkunreadIcon
            style={muiSocialIconStyle}
            onClick={() => {
              setShowInfoPopup(true),
                setPopupMessage("Email: " + selectedCardDetails.emailAddress);
            }}
            className="cursor-pointer"
          />
        </Tooltip>
      );
    }

    if (selectedCardDetails.showPhoneNumberToPublic === 1) {
      icons.push(
        //@ts-ignore
        <Tooltip title="Phone Number" placement="top-start">
          <PhoneAndroidIcon
            style={muiSocialIconStyle}
            onClick={() => {
              setShowInfoPopup(true),
                setPopupMessage(
                  "Phone Number: " + selectedCardDetails.phoneNumber
                );
            }}
            className="cursor-pointer"
          />
        </Tooltip>
      );
    }

    // Check if the user wants to share their social media accounts
    if (selectedCardDetails.showSocialMediatoPublic === 1) {
      if (selectedCardDetails.instagram) {
        icons.push(
          //@ts-ignore
          <Tooltip title="Instagram" placement="top-start">
            <img
              key="instagram"
              className="cursor-pointer"
              src={"/images/instagram-icon.png"}
              style={socialIconStyle}
              alt="Instagram"
              onClick={() => openSocialMedia("instagram")}
            />
          </Tooltip>
        );
      }

      if (selectedCardDetails.facebook) {
        icons.push(
          //@ts-ignore
          <Tooltip title="Facebook" placement="top-start">
            <img
              key="facebook"
              className="cursor-pointer"
              src={"/images/facebook-icon.png"}
              style={socialIconStyle}
              alt="Facebook"
              onClick={() => openSocialMedia("facebook")}
            />
          </Tooltip>
        );
      }

      if (selectedCardDetails.twitter) {
        icons.push(
          //@ts-ignore
          <Tooltip title="Twitter" placement="top-start">
            <img
              key="twitter"
              className="cursor-pointer"
              src={"/images/twitterx-icon.png"}
              style={socialIconStyle}
              alt="Profile Verified"
              onClick={() => openSocialMedia("twitter")}
            />
          </Tooltip>
        );
      }
    }

    return (
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <span style={{ marginBottom: "10px" }}>{icons}</span>
      </div>
    );
  }

  function returnUserSmokerHabits() {
    if (selectedCardDetails.isSmoker === 0) {
      return (
        <>
          <SmokeFreeIcon /> Smokes{" "}
        </>
      );
    } else {
      return (
        <>
          <SmokingRoomsIcon style={aboutMeIconStyle} /> Doesn't Smoke
        </>
      );
    }
  }

  function returnAgeField() {
    if (selectedCardDetails.showAgeToPublic == 1) {
      return (
        <>
          <CakeIcon style={aboutMeIconStyle} /> {selectedCardDetails.age} years
          old
        </>
      );
    }
  }

  function returnGenderField() {
    if (selectedCardDetails.showGenderToPublic == 1) {
      return <>{returnGenderIcon()}</>;
    }
  }

  function returnPets() {
    if (selectedCardDetails.hasPet == 1) {
      return (
        <>
          <PetsIcon style={aboutMeIconStyle} /> Has a pet
        </>
      );
    } else {
      return (
        <>
          <PetsIcon style={aboutMeIconStyle} /> No pets
        </>
      );
    }
  }

  function returnCleanlinessLevel() {
    return (
      <>
        <WashIcon style={aboutMeIconStyle} />{" "}
        {selectedCardDetails.cleanlinessLevel}
      </>
    );
  }

  function returnLanguages() {
    return (
      <>
        <LanguageIcon style={aboutMeIconStyle} />{" "}
        {selectedCardDetails.languages}
      </>
    );
  }

  function returnHasKids() {
    let valueToReturn;
    if (selectedCardDetails.hasKids === 0) {
      valueToReturn = "Do not have any kids";
    } else {
      valueToReturn = "Have kids";
    }

    return (
      <>
        <EscalatorWarningIcon style={aboutMeIconStyle} /> {valueToReturn}
      </>
    );
  }

  function returnHousingPreference() {
    return (
      <>
        <CottageIcon style={aboutMeIconStyle} />{" "}
        {selectedCardDetails.typeOfPlace}
      </>
    );
  }

  function returnPreferredLeaseTerm() {
    return (
      <>
        <CalendarMonthIcon style={aboutMeIconStyle} />{" "}
        {selectedCardDetails.preferredLeaseTerm} month lease
      </>
    );
  }

  function returnBudget() {
    return (
      <>
        <PaidIcon style={aboutMeIconStyle} /> $
        {new Intl.NumberFormat().format(selectedCardDetails.budget)}/mo{" "}
      </>
    );
  }

  function returnPreferredAgeRange() {
    return (
      <>
        <ManageAccountsIcon style={aboutMeIconStyle} /> Age between{" "}
        {selectedCardDetails.minAge} and {selectedCardDetails.maxAge} years old
      </>
    );
  }

  function returnFurniturePreference() {
    let returnValue;
    if (selectedCardDetails.preferredFurnishedPlace == 1) {
      returnValue = "Furnished place";
    } else {
      returnValue = "Non furnished place";
    }

    return (
      <>
        <ChairIcon style={aboutMeIconStyle} /> {returnValue}
      </>
    );
  }

  function returnLookingForRoommates() {
    let valueToReturn;
    if (selectedCardDetails.isLookingForRoommate == 1) {
      return (
        <>
          <Diversity3Icon style={aboutMeIconStyle} /> I'm looking looking for{" "}
          {selectedCardDetails.roommateCount > 1
            ? selectedCardDetails.roommateCount
            : "a"}{" "}
          {selectedCardDetails.roommateCount > 1 ? "roommates" : "roommate"}
        </>
      );
    } else {
      return (
        <>
          <Diversity3Icon style={aboutMeIconStyle} /> No roommates
        </>
      );
    }
  }

  function splitcitiesByOrIfNeeded() {
    const citiesString = selectedCardDetails.citiesLookingToLiveIn; // Get the string value

    // Split the string into an array of city-state pairs
    const citiesArray = citiesString.split(", ");

    if (citiesArray.length > 2) {
      // Create an array to hold the formatted pairs
      const formattedCities = [];

      // Iterate through the citiesArray and format each pair
      for (let i = 0; i < citiesArray.length; i += 2) {
        const cityStatePair = citiesArray[i] + ", " + citiesArray[i + 1];
        //@ts-ignore
        formattedCities.push(cityStatePair);
      }

      // Join the formatted pairs with " or " between each pair
      const result = formattedCities.join(" or ");

      return result; // In case of mutliple areas: Output: "Wellesley, MA or Concord, MA"
    } else { 
      return citiesString; // In case of a single area: Output: "Concord, MA"
    }
  }

  //@ts-ignore
  function getArticle(typeOfPlace) {
    if (typeOfPlace === null) {
      return null;
    }

    // Convert typeOfPlace to lowercase for case-insensitive comparison
    const lowercaseType = typeOfPlace.toLowerCase();

    // Check if the word starts with a vowel sound
    if (
      lowercaseType.startsWith("a") ||
      lowercaseType.startsWith("e") ||
      lowercaseType.startsWith("i") ||
      lowercaseType.startsWith("o") ||
      lowercaseType.startsWith("u")
    ) {
      return "an";
    } else {
      return "a";
    }
  }

  function returnLookingForHousingType() {
    // User is looking for a roommate and DOES NOT have a place
    if (selectedCardDetails.userHasAPlace == 0) {
      return (
        <div
          style={{
            textAlign: "center",
            width: isMobile ? "100%" : "70%",
            margin: "auto",
          }}
        >
          Looking to join roommates in{" "}
          {getArticle(selectedCardDetails.typeOfPlace)}{" "}
          <span style={{ fontWeight: "bold" }}>
            {selectedCardDetails.typeOfPlace}
          </span>{" "}
          in{" "}
          <span style={{ fontWeight: "bold" }}>
            {selectedCardDetails.citiesLookingToLiveIn}
          </span>{" "}
          with a budget of{" "}
          <span style={{ fontWeight: "bold" }}>
            ${new Intl.NumberFormat().format(selectedCardDetails.budget)}/mo
          </span>
        </div>
      );
    } else {
      // User is looking for a roommate and HAS a place
      return (
        <div
          style={{
            textAlign: "center",
            width: isMobile ? "100%" : "70%",
            margin: "auto",
          }}
        >
          I have {getArticle(selectedCardDetails.typeOfPlace)}{" "}
          <span style={{ fontWeight: "bold" }}>
            {selectedCardDetails.typeOfPlace}
          </span>{" "}
          in{" "}
          <span style={{ fontWeight: "bold" }}>
            {selectedCardDetails.citiesLookingToLiveIn}
          </span>{" "}
          and looking for{" "}
          <span style={{ fontWeight: "bold" }}>
            {selectedCardDetails.roommateCount > 1
              ? selectedCardDetails.roommateCount
              : "a"}{" "}
            {selectedCardDetails.roommateCount > 1 ? "roommates" : "roommate"}
          </span>
        </div>
      );
    }
  }

  function returnNameAge() {
    if (selectedCardDetails.showAgeToPublic == 1) {
      return (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%"}}
        >
          <h1>
            {selectedCardDetails.firstName}, {selectedCardDetails.age}{" "}
          </h1>
        </div>
      );
    } else {
      return (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <h1>{selectedCardDetails.firstName}</h1>
        </div>
      );
    }
  }

  function returnBackBanner() {
    return (
      <div
        style={{
          backgroundColor: "#4CAF50",
          height: isMobile ? "100px" : "150px",
          marginBottom: isMobile ? "20px" : "50px",
        }}
      >
      </div>
    );
  }

  function returnChatComponentDisplay() {
    /**
     * once the user clicks on the Send Message button, the button dissapears
     * and the SendMessage component shows up for the user to write a message
     * and send it.
     */
    return (
      <>
        {!messageSent && (
          <div style={{ width: "50%", margin: "auto", textAlign: "center" }}>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              style={{ backgroundColor: "#4CAF50" }}
            >
              Send Message
            </Button>
          </div>
        )}

        {messageSent && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: isMobile ? "100%" : "70%",
              margin: "auto",
            }}
          >
            <SendMessage
              selectedCardDetails={selectedCardDetails}
              targetUserId={selectedCardDetails.id}
              cardId={selectedCardDetails.id}
              topicUrl={window.location.href}
            />
          </div>
        )}
      </>
    );
  }

  function returnBio() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fontStyle: "italic",
          paddingLeft: "30px",
          paddingRight: "30px",
          margin: "auto",
          textAlign: "center",
          width: isMobile ? "100%" : "80%",
        }}
      >
        <p>
          <span
            style={{ transform: "rotate(180deg)", display: "inline-block" }}
          >
            <FormatQuoteIcon />
          </span>
          {selectedCardDetails.bio}
          <FormatQuoteIcon />
        </p>
      </div>
    );
  }

  function returnProfilePicture() {
    return (
      <div
        style={{
          position: "absolute",
          top: isMobile ? "30px" : "50px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Avatar
            alt={selectedCardDetails.firstName}
            src={recipientAvatarImgSource}
            style={avatarStyle}
          />
        </div>
      </div>
    );
  }

  function returnProfileCard() {
    return (
      <>
        <div style={{ position: "relative", paddingBottom: "50px" }}>
          {/* ------------------------- BACK BANNER DISPLAY ------------------------- */}
          {returnBackBanner()}
          {returnProfilePicture()}
        </div>
        {/* ---------------------------------- FIRST NAME AND AGE --------------------*/}
        {returnNameAge()}
        {/* ---------------------------------- SOCIAL STATUS ------------------------ */}
        {returnSocialStatus()}
        {/* ---------------------------------- LOOKING FOR  --------------------------*/}
        {returnLookingForHousingType()}
        <div>
          <hr />
        </div>
        {/* ---------------------------------- SOCIAL ICONS --------------------------*/}
        {returnSocialIcons()}
        {/* ---------------------------------- BIOGRAPHY -----------------------------*/}
        {returnBio()}
        {/* ---------------------------------- CHAT ----------------------------------*/}
        {returnChatComponentDisplay()}
      </>
    );
  }

  //@ts-ignore
  function formatMoveInDate(selectedDate) {
    const date = new Date(selectedDate);

    // Format the date as YYYY-MM-DD
    const formattedDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    return formattedDate;
  }

  function returnListingCard() {
    return (
      // <div className="tenant-card-details-container">
      <div>
        <ReactResponsiveCarousel
          selectedCardDetails={selectedCardDetails}
          carouselHeight={isMobile ? 250 : 350}
        />
        <div className='section-grouping-border'>

          <h3>{selectedCardDetails.address}</h3>
          <div className="price">
            {" "}
            ${new Intl.NumberFormat().format(selectedCardDetails.price)} USD
          </div>
          <div>{selectedCardDetails.description}</div>
        </div>

        <div className='section-grouping-border'>

        <div className="row ">
          <div className="col-4">
            <div>
              <span className="span-section">Move-In Ready</span>
              <br />
              <p>{formatMoveInDate(selectedCardDetails.moveInDate)}</p>
            </div>
          </div>
          <div className="col-4">
            <div>
              <span className="span-section">Housing Type</span>
              <br />
              <p>{selectedCardDetails.listingType}</p>
            </div>
          </div>
          <div className="col-4">
            <div>
              <span className="span-section">Furnished</span>
              <br />
              <p>{selectedCardDetails.furnished == 1 ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
        </div>

        <div className='section-grouping-border'>
          <div>
            <LeaseTerms selectedCardDetails={selectedCardDetails} />
          </div>
          </div>

          <div className='section-grouping-border'>
          <div>
            <AccomodationsSection selectedCardDetails={selectedCardDetails} />
          </div>
          </div>

          <div className='section-grouping-border'>
          <div>
            <AccessibilityPerks selectedCardDetails={selectedCardDetails} />
          </div>
        </div>
      </div>
    );
  }

  function returnProfileCardAndListing() {
    return (
      <>
        <div className="row">
          <div className="col-12 col-lg-4 tenant-card-details-container">
            {returnProfileCard()}
            {returnAboutMeSection()}
            <div style={{ fontWeight: "bold" }}>
              {returnLookingForRoommates()}
            </div>
            <div style={{ fontWeight: "bold" }}>
              {returnPreferredAgeRange()}
            </div>
          </div>

          <div className="col-12 col-lg-8">{returnListingCard()}</div>
        </div>

        <div className="row pt-4">
          <h2>Location</h2>
          <div>
            <GoogleMap mapHeight="500px"/>
          </div>
        </div>
      </>
    );
  }

  function returnAboutMeSection() {
    return (
      <>
      {/* -------------------------------- ABOUT ME --------------------------------*/}
      <SectionHeading title="About Me" paddingTop="5"/>
        <div style={{ fontWeight: "bold" }}>
          <div>{returnAgeField()}</div>
          <div>{returnGenderField()}</div>
          <div>{returnLanguages()}</div>
          <div>{returnUserSmokerHabits()}</div>
          <div>{returnPets()}</div>
          <div>{returnCleanlinessLevel()}</div>
          <div>{returnHasKids()}</div>
        </div>
      </>
    );
  }

  function returnIdealHome() {
    return (
      <>
      <SectionHeading title="MY IDEAL HOME" paddingTop="3"/>
        {/* <hr /> */}
        <div style={{ fontWeight: "bold" }}>
          <div>{returnHousingPreference()}</div>
          <div>{returnPreferredLeaseTerm()}</div>
          <div>{returnBudget()}</div>
          <div>{returnLookingForRoommates()}</div>
          <div>{returnPreferredAgeRange()}</div>
          <div>{returnFurniturePreference()}</div>
        </div>
      </>
    );
  }

  function returnProfileOnly() {
    return (
      <>
        <div className="tenant-card-details-container">
          {returnProfileCard()}
        </div>

        <div className="row mt-3 ">
          <div className="col-12 col-lg-6 tenant-card-details-container">
            {returnAboutMeSection()}
          </div>

          {/* -------------------------------- MY IDEAL HOME --------------------------------*/}
          <div className="col-12 col-lg-6 tenant-card-details-container">
            {returnIdealHome()}
          </div>
        </div>
      </>
    );
  }

  function returnInfoPopupUpOnClick() {
    return (
      <InfoPopup
        show={showInfoPopup}
        setShow={setShowInfoPopup}
        popupMessage={popupMessage}
      />
    );
  }

  function returnBackButton() {
    return (
      <BackToResultsBtn prevPage={"/find-a-roommate-results"} text={"Back to search results"} />
    );
  }

  return (
    <div className="container container-elements" style={{ width: "100%" }}>
      {returnInfoPopupUpOnClick()}

      {returnBackButton()}

      {/* Checking if the user has listed their place yet or not */}
      {selectedCardDetails.listingId != null
        ? returnProfileCardAndListing()
        : returnProfileOnly()}
    </div>
  );
};

export default RoommateCardDetails;
