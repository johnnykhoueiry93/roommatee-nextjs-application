"use client";

import React, { useEffect } from 'react';
import DoneAnimation from "../modals/DoneAnimation";
import { useRouter } from 'next/navigation';

import { SiteData } from "../../context/SiteWrapper";
// import BackendAxios from "../../backend/BackendAxios";

const ProfileCompleteScreen = () => {
//@ts-ignore
const { isMobile, userInfo, setUserInfo, welcomeProfileSetupStep, setWelcomeProfileSetupStep, userProfilePicture, setUserProfilePicture, PROFILE_PICTURE_S3_SUB_FOLDER, setPrevProgress, setNextProgress } = SiteData();
const router = useRouter();
const navigateToPage = (path) => {
  router.push(path);
};



setPrevProgress(95);
setNextProgress(99);

  useEffect(() => {
    const timer = setTimeout(() => {
        handleInsertProfileSetupInfo();
        navigateToPage('/'); 
    }, 2000); // Navigate after 2 seconds

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, []);

  function setUserProfileSetupToComplete() {
    //@ts-ignore
    setUserInfo((prevUserInfo) => {
        if (Array.isArray(prevUserInfo) && prevUserInfo.length > 0) {
            const updatedUserInfo = [
                {
                    ...prevUserInfo[0], // Update the first object in the array
                    isProfileComplete: 1,
                },
                ...prevUserInfo.slice(1), // Keep the rest of the array as is
            ];
            return updatedUserInfo;
        } else if (typeof prevUserInfo === 'object' && prevUserInfo !== null) {
            // Handle case where prevUserInfo is an object, not an array
            return {
                ...prevUserInfo,
                isProfileComplete: 1,
            };
        }
        return prevUserInfo; // If userInfo is empty or not an array, return as is
    });
}
  
    /** ROOMT-156
   * This function is very important.
   * 1- Why do I need it? Because when the update happens, if the user refreshes the page they need their updated info to persist
   * without this function, if I refresh, the value would revert back to the previous value but on the database it's updated
   * So before this function, the user needs to logout and then log in to view their changes, this one makes it dynamic by updating the exisitng
   * userInfo locally and if the user refreshes / logs out and back in they have the latest info
   */
     const updateCurrentUserInfo = () => {
        const updatedSubset = {
          typeOfPlace: welcomeProfileSetupStep.typeOfPlace,
          budget: welcomeProfileSetupStep.budget,
          socialStatus: welcomeProfileSetupStep.socialStatus,
          socialstatusDetails: welcomeProfileSetupStep.socialstatusDetails,
          cleanlinessLevel: welcomeProfileSetupStep.cleanlinessLevel,
          isLookingForRoommate: welcomeProfileSetupStep.isLookingForRoommate,
          gender: welcomeProfileSetupStep.gender,
          minAge: welcomeProfileSetupStep.minAge,
          maxAge: welcomeProfileSetupStep.maxAge,
          hasPet: welcomeProfileSetupStep.hasPet,
          hasKids: welcomeProfileSetupStep.hasKids,
          preferredFurnishedPlace: welcomeProfileSetupStep.preferredFurnishedPlace,
          isSmoker: welcomeProfileSetupStep.isSmoker,
          userHasAPlace: welcomeProfileSetupStep.userHasAPlace,
          bio: welcomeProfileSetupStep.bio,
          citiesLookingToLiveIn: welcomeProfileSetupStep.citiesLookingToLiveIn,
          languages: welcomeProfileSetupStep.languages,
          preferredLeaseTerm: welcomeProfileSetupStep.preferredLeaseTerm,
          phoneNumber: welcomeProfileSetupStep.phoneNumber,
          isProfileComplete: '1',
        };
        updateUserInfoSubset(updatedSubset);
    };

      
    // Function to update a subset of userInfo 
    //@ts-ignore
    const updateUserInfoSubset = (updatedSubset) => {
      setUserInfo((prevUserInfo) => {
        if (Array.isArray(prevUserInfo)) {
          return [
            {
              ...prevUserInfo[0], // Copy existing userInfo (first object in the array)
              ...updatedSubset, // Update the specified subset
            },
            ...prevUserInfo.slice(1), // Keep other elements unchanged
          ];
        } else if (typeof prevUserInfo === 'object' && prevUserInfo !== null) {
          // Handle case where prevUserInfo is an object, not an array
          return {
            ...prevUserInfo,
            ...updatedSubset, // Update the specified subset
          };
        }
        return prevUserInfo; // If prevUserInfo is empty or not an array/object, return as is
      });
    };

  const handleInsertProfileSetupInfo = async () => {
    console.log( "The user clicked on the finish button to complete the User Profile Setup" );

    try {
      setUserProfileSetupToComplete();

      //@ts-ignore
      setWelcomeProfileSetupStep({
        ...welcomeProfileSetupStep,
        isProfileComplete: '1',
      });

      let emailAddress = userInfo.emailAddress;
      const response =  await fetch("/api/insertProfileSetupInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ welcomeProfileSetupStep, emailAddress }), // Send the parameters in the request body
        cache: 'no-store' // Ensures the data is fetched on every request
      });


    } catch (error) {
      console.error("Error inserting profile setup info:", error);
    }

    console.log("Full profile print: ################################# ", welcomeProfileSetupStep);

    updateCurrentUserInfo();

  };


  return (
    <div style={{ width: isMobile ? '50%' : '20%', margin: 'auto' }}>
        <div style={{width: '50%', margin: 'auto'}}>
        <h1>Success!</h1>
        </div>
      <DoneAnimation />
    </div>
  );
};

export default ProfileCompleteScreen;
