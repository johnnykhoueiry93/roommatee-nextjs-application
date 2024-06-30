import { SiteData } from "../../context/SiteWrapper";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import SnackBarAlert from "../alerts/SnackBarAlerts";
import SocialMediaInput from "./SocialMediaInput";
import { encryptData } from '../../utils/encryptionUtils';

const SocialMediaLink = () => {
  //@ts-ignore
  const { userInfo, setUserInfo, snackbarOpen, setSnackbarOpen, snackbarMessage, setSnackbarMessage, snackbarSeverity, setSnackbarSeverity } = SiteData();

  if(!userInfo) {
    return <div>Loading userinfo in Profile Picture...</div>
  }
  
  const [isAnyValueChanged, setIsAnyValueChanged] = useState(false); 

  const [welcomeProfileSetupStep, setWelcomeProfileSetupStep] = useState({
    twitter: userInfo.twitter,
    facebook: userInfo.facebook,
    instagram: userInfo.instagram,
  })

      //@ts-ignore
      function prependSocialMediaUrl(value, field) {
        let fullSocialMediaUrl;
        let username = value.trim().replace('@', ''); // Remove @ symbol and trim any whitespace
  
        if(field == 'twitter') {
          fullSocialMediaUrl='https://twitter.com/'+username;
  
        } else if (field == 'facebook') {
          fullSocialMediaUrl='https://facebook.com/'+username;
  
        } else {
          fullSocialMediaUrl='https://instagram.com/'+username;
        }
  
        // Check if the URL already contains the full platform URL
        if (!value.includes('https')) {
          return fullSocialMediaUrl;
        } else {
          return value; // Return the original value without appending again
        }
      }

  useEffect(() => {
    // Compare the current state with the initial state
     const hasValueChanged =
      JSON.stringify(welcomeProfileSetupStep) !== JSON.stringify({twitter: userInfo.twitter,
        facebook: userInfo.facebook,
        instagram: userInfo.instagram,});

      if (hasValueChanged) {
        setIsAnyValueChanged(true);
        // Values have changed, you can do something here
        console.log('Values have changed:', welcomeProfileSetupStep);
      } else {
        setIsAnyValueChanged(false);
      }
  }, [welcomeProfileSetupStep]); // Dependency array containing the state you want to track

    //@ts-ignore
    function showSuccessSnackBarAlert(message) {
      setSnackbarMessage(message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setIsAnyValueChanged(false);
    }
    
    //@ts-ignore
    function showFailureSnackBarAlert(message) {
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

  const updateProfileSetup = async () => {
    if(!isAnyValueChanged) {
      setSnackbarMessage("You haven't made any changes yet");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return
    }

    console.log(
      "The user clicked on the finish button to complete the User Profile Setup"
    );

    // Prepend full social media URLs before sending the data
    const updatedSocialMediaLinks = {
    twitter: prependSocialMediaUrl(welcomeProfileSetupStep.twitter, 'twitter'),
    facebook: prependSocialMediaUrl(welcomeProfileSetupStep.facebook, 'facebook'),
    instagram: prependSocialMediaUrl(welcomeProfileSetupStep.instagram, 'instagram'),
  };

  try {
    let emailAddress = userInfo.emailAddress;
    const response =  await fetch("/api/insertProfileSetupInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ welcomeProfileSetupStep, emailAddress }), // Send the parameters in the request body
      cache: 'no-store' // Ensures the data is fetched on every request
    });
    showSuccessSnackBarAlert('Social media links updated successfully!');
    setIsAnyValueChanged(false);
  } catch (error) {
    console.error("Error inserting profile setup info:", error);
    showFailureSnackBarAlert(`Failed ${error}`);
  }

    updateCurrentUserInfo();

    console.log(
      "Full profile print: ################################# ",
      welcomeProfileSetupStep
    );
  };

     // Function to update a subset of userInfo 
    //@ts-ignore
    const updateUserInfoSubset = (updatedSubset) => {
      console.log("Updating user info subset with:", updatedSubset);
  
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        ...updatedSubset,
      }));
  
      console.log('[DEBUG] - Printing after update userInfo: ' , userInfo);
    };
  
    useEffect(() => {
      console.log('[DEBUG] - Updated userInfo afer change detection:', userInfo);
      setUserInfo(userInfo);
      localStorage.setItem('userInfo', encryptData(userInfo)); // encrypted userInfo
    }, [userInfo]);

    /**
     * This function is very important.
     * 1- Why do I need it? Because when the update happens, if the user refreshes the page they need their updated info to persist
     * without this function, if I refresh, the value would revert back to the previous value but on the database it's updated
     * So before this function, the user needs to logout and then log in to view their changes, this one makes it dynamic by updating the exisitng
     * userInfo locally and if the user refreshes / logs out and back in they have the latest info
     */
    const updateCurrentUserInfo = () => {
      const updatedSubset = {
        twitter: welcomeProfileSetupStep.twitter,
        facebook: welcomeProfileSetupStep.facebook,
        instagram: welcomeProfileSetupStep.instagram,
      };
      updateUserInfoSubset(updatedSubset);
    };


  return (
    <div className="container edit-account-information-container">
      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />

      <p className='mb-4'>Input your username or social media url link</p>

      <SocialMediaInput welcomeProfileSetupStep={welcomeProfileSetupStep} setWelcomeProfileSetupStep={setWelcomeProfileSetupStep} field={'twitter'} label={'Twitter'}/>
      
      <SocialMediaInput welcomeProfileSetupStep={welcomeProfileSetupStep} setWelcomeProfileSetupStep={setWelcomeProfileSetupStep} field={'facebook'} label={'Facebook'}/>
      
      <SocialMediaInput welcomeProfileSetupStep={welcomeProfileSetupStep} setWelcomeProfileSetupStep={setWelcomeProfileSetupStep} field={'instagram'} label={'Instagram'}/>

      <Button
        style={{width: '100px'}}
        className='ml-auto'
        variant="contained"
        color="primary"
        onClick={() => updateProfileSetup()}
      >
        Update
      </Button>
    </div>
  );
};

export default SocialMediaLink;
