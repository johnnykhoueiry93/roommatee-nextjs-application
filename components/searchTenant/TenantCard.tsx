/**
 * This is the tenant card that will be displayed when the
 * user is searching for tenants
 * Each tenant will be represented by a single TenantCard
 */

import { SiteData } from "../../context/SiteWrapper";
import { useRouter } from 'next/navigation';
// import BackendAxios from "../../backend/BackendAxios";
import { useEffect, useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import "../../styles/searchTenant/TenantCard.css";
import CircleIcon from "@mui/icons-material/Circle";
import Tooltip from '@mui/material/Tooltip';


//@ts-ignore
const TenantCard = ({ result }) => {
  // @ts-ignore
  const { setLatitude, setLongitude, setMapAddress, userAuth, intendedDestination, setIntendedDestination } = SiteData();


const router = useRouter();
const navigateToPage = (path) => {
  router.push(path);
};

  const [tenantProfilePicture, setTenantProfilePicture] = useState(""); // State to manage the avatar source

  const iconStyle = {
    fontSize: 25, // Adjust the size as needed
    color: "var(--roomatee-theme-color)", // Change the color to your desired color
  };

  const onlineIconStyle = {
    fontSize: 18,
    color: "orange",
  };

  //@ts-ignore
  const calculateTimeDifference = (lastLoginDate) => {
    const now = new Date(); // Current time
    const loginTime = new Date(lastLoginDate); // Last login time
    const timezoneOffset = now.getTimezoneOffset(); // Get timezone offset in minutes
    const adjustedNow = new Date(now.getTime() + timezoneOffset * 60000); // Adjusted current time

    // Difference in milliseconds without timezone offset
    //@ts-ignore
    const timeDifference = adjustedNow - loginTime;

    // Convert milliseconds to hours, minutes, and days
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const days = Math.floor(hours / 24);

    // Return formatted time difference
    if (hours < 1) {
      if (minutes < 5) {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <CircleIcon style={onlineIconStyle} />
            <span>‎ online</span>
          </div>
        );
      } else {
        return `Active ${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
      }
    } else if (hours < 24) {
      return `Active ${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      return `Active ${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

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

  // this useEffect will get the recipient's picture on load once
  useEffect(() => {
    const key = `${result.id}-profile-picture.png?folder=profile-picture`;
    // console.log(`The useEffect triggered with key: ${key}`);

    // BackendAxios.post(`/getS3PictureUrl/${key}`)
    //   .then((response) => {
    //     console.log(
    //       "Setting the user profile picture to URL: " + response.data.s3Url
    //     );
    //     setTenantProfilePicture(response.data.s3Url); // Set the avatar source
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
  }, []); // Empty dependency array to run the effect only once

  const getRandomAvatarUrl = () => {
    // Generate a random number between 1 and 60 for the avatar
    const randomNumber = Math.floor(Math.random() * 60) + 1;

    // Generate a random number (0 for male, 1 for female)
    const randomGender = Math.floor(Math.random() * 2);

    // Determine the gender based on the random number
    let gender;
    if (randomGender === 0) {
      gender = "male";
    } else {
      gender = "female";
    }

    // Construct the URL based on the gender and random number
    const imageUrl = `https://xsgames.co/randomusers/assets/avatars/${gender}/${randomNumber}.jpg`;

    return imageUrl;
  };

  const handleOnSearchCardClick = () => {
    console.log(`The user clicked on the Tenant Card with id: ${result.id}`);

    // Reset and nullify the selectedCardDetails in session storage
    // Why doing this? because once I open the TenantCardDetails if the user refreshes 
    // I dont lose the data and error out. But since I'm saving that data in a cookie, 
    // every time I change the tenant selection I need to reset that cookie and save the 
    // new cookie value so that I'm not always showing the same tenant for any selected
    // card.
    localStorage.removeItem('selectedCardDetails');

    
    navigateToPage(`/tenant/${result.id}`);
    setIntendedDestination(`/tenant/${result.id}`);
  };

  function returnAge() {
    let age= '';
    if(result.showAgeToPublic == 1) {
      age = ', ' + result.age;
    }

    return age;
  }

  return (
    <div className="tenant-card-body" onClick={handleOnSearchCardClick}>
      {/* ------------------------------------------ IMAGE ------------------------------------------ */}
      <div className="tenant-image-container">
        <img
          className="tenant-card-image-preview"
          // src={tenantProfilePicture}
          src={getRandomAvatarUrl()} //TODO comment out this section and uncomment the one above
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = '/images/profilePicture_placeholder.png';
          }}
          alt={`Listing ${result.id}`}
        />

        {/* ------------------------------------------ LAST ACTIVITY ------------------------------------------ */}
        <div className="tenant-last-active-since">
          {calculateTimeDifference(result.lastLoginDate)}
        </div>
      </div>



      
      <div className="search-card-details-container">
        {/* ------------------------------------------ FIRST NAME, AGE ------------------------------------------ */}
        <div style={{ display: "flex" }}>
          <span style={{fontSize: '26px'}}>{result.firstName}{returnAge()}</span>
     

          {result.isProfileVerified === 1 && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "10px",
              }}
            >
              <Tooltip title="ID Verified">
              <VerifiedIcon style={iconStyle} />
              </Tooltip>
            </span>
          )}
          {result.isEmailVerified === 1 && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "10px",
              }}
            >
              <Tooltip title="Email Verified">
                <MarkEmailReadIcon style={iconStyle} />
              </Tooltip>
            </span>
          )}
        </div>

        {/* ------------------- Last time seen active ---------------------*/}

        <div className='mt-3'>
          Looking for {getArticle(result.typeOfPlace)}{" "}
          <span style={{ fontWeight: "bold" }}>{result.typeOfPlace}</span> in{" "}
          <span style={{ fontWeight: "bold" }}>
            {result.citiesLookingToLiveIn}
          </span>{" "}
          with a budget of{" "}
          <span style={{ fontWeight: "bold" }}>
            ${new Intl.NumberFormat().format(result.budget)}/mo
          </span>
        </div>
      </div>
    </div>
  );
};

export default TenantCard;
