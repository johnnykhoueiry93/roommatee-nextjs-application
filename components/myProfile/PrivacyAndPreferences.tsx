import "../../styles/myProfile/EditAccountInformation.css";
import { useState, useEffect } from "react";
import { SiteData } from "../../context/SiteWrapper";
import Button from "@mui/material/Button";
import { encryptData } from '../../utils/encryptionUtils';
//@ts-ignore
import IphoneSwitch from "../modals/iphoneSwitch";
import SnackBarAlert from "../alerts/SnackBarAlerts";

const PrivacyAndPreferences = () => {
    //@ts-ignore
    const { userInfo, setUserInfo, snackbarOpen, setSnackbarOpen, snackbarMessage, setSnackbarMessage, snackbarSeverity, setSnackbarSeverity } = SiteData();

    if(!userInfo) {
      return <div>Loading userinfo in Privacy...</div>
    }
    

    const [isAnyValueChanged, setIsAnyValueChanged] = useState(false); 

    const [welcomeProfileSetupStep, setWelcomeProfileSetupStep] = useState({
      emailNotificationEnabled: userInfo.emailNotificationEnabled,
      chatNotificationEnabled: userInfo.chatNotificationEnabled,
      newListingNotificationEnabled: userInfo.newListingNotificationEnabled,
      showEmailAddressToPublic: userInfo.showEmailAddressToPublic,
      showPhoneNumberToPublic: userInfo.showPhoneNumberToPublic,
      showSocialMediatoPublic: userInfo.showSocialMediatoPublic,
      showGenderToPublic: userInfo.showGenderToPublic,
      showAgeToPublic: userInfo.showAgeToPublic,
    })

    useEffect(() => {
      // Compare the current state with the initial state
       const hasValueChanged =
        JSON.stringify(welcomeProfileSetupStep) !== JSON.stringify({
          // Your initial state values here
          emailNotificationEnabled: userInfo.emailNotificationEnabled,
          chatNotificationEnabled: userInfo.chatNotificationEnabled,
          newListingNotificationEnabled: userInfo.newListingNotificationEnabled,
          showEmailAddressToPublic: userInfo.showEmailAddressToPublic,
          showPhoneNumberToPublic: userInfo.showPhoneNumberToPublic,
          showSocialMediatoPublic: userInfo.showSocialMediatoPublic,
          showGenderToPublic: userInfo.showGenderToPublic,
          showAgeToPublic: userInfo.showAgeToPublic,
        });
  
        if (hasValueChanged) {
          setIsAnyValueChanged(true);
          // Values have changed, you can do something here
          console.log('Values have changed:', welcomeProfileSetupStep);
        } else {
          setIsAnyValueChanged(false);
        }
    }, [welcomeProfileSetupStep]); // Dependency array containing the state you want to track

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
        emailNotificationEnabled: welcomeProfileSetupStep.emailNotificationEnabled,
        chatNotificationEnabled: welcomeProfileSetupStep.chatNotificationEnabled,
        newListingNotificationEnabled: welcomeProfileSetupStep.newListingNotificationEnabled,
        showEmailAddressToPublic: welcomeProfileSetupStep.showEmailAddressToPublic,
        showPhoneNumberToPublic: welcomeProfileSetupStep.showPhoneNumberToPublic,
        showSocialMediatoPublic: welcomeProfileSetupStep.showSocialMediatoPublic,
      };
      updateUserInfoSubset(updatedSubset);
    };

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
    console.log(
      "The user clicked on the finish button to complete the User Profile Setup"
    );

    if(!isAnyValueChanged) {
      setSnackbarMessage("You haven't made any changes yet");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return
    }
    
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
      showSuccessSnackBarAlert('Privacy and preferences updated successfully!');
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

  //@ts-ignore
  const handleSwitchChange = (name) => (event) => {
    setWelcomeProfileSetupStep((prevState) => ({
      ...prevState,
      [name]: event.target.checked,
    }));
  };

  return (
    <div className="container edit-account-information-container">
      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />

      <p>Customize the application to your liking</p>
      <IphoneSwitch label="Email notifications" checked={welcomeProfileSetupStep.emailNotificationEnabled} onChange={handleSwitchChange('emailNotificationEnabled')}/>
      <IphoneSwitch label="Chat notifications" checked={welcomeProfileSetupStep.chatNotificationEnabled} onChange={handleSwitchChange('chatNotificationEnabled')} />
      <IphoneSwitch label="New listings near you notifications" checked={welcomeProfileSetupStep.newListingNotificationEnabled} onChange={handleSwitchChange('newListingNotificationEnabled')} />
      <IphoneSwitch label="Show Email Address to the public" checked={welcomeProfileSetupStep.showEmailAddressToPublic} onChange={handleSwitchChange('showEmailAddressToPublic')} />
      <IphoneSwitch label="Show Phone number to the public" checked={welcomeProfileSetupStep.showPhoneNumberToPublic} onChange={handleSwitchChange('showPhoneNumberToPublic')} />
      <IphoneSwitch label="Show Social Media Profile" checked={welcomeProfileSetupStep.showSocialMediatoPublic} onChange={handleSwitchChange('showSocialMediatoPublic')} />
      <IphoneSwitch label="Show Gender to the public" checked={welcomeProfileSetupStep.showGenderToPublic} onChange={handleSwitchChange('showGenderToPublic')} />
      <IphoneSwitch label="Show Age Profile" checked={welcomeProfileSetupStep.showAgeToPublic} onChange={handleSwitchChange('showAgeToPublic')} />

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

export default PrivacyAndPreferences;
