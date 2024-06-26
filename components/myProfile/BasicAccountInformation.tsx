import "../../styles/myProfile/EditAccountInformation.css";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useState, useEffect } from "react";
import { SiteData } from "../../context/SiteWrapper";
import Button from "@mui/material/Button";
import SnackBarAlert from "../alerts/SnackBarAlerts";
import { MuiTelInput } from 'mui-tel-input'
import { encryptData } from '../../utils/encryptionUtils';

const BasicAccountInformation = () => {
  //@ts-ignore
  const { userInfo, setUserInfo ,setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity, snackbarMessage, snackbarOpen, snackbarSeverity, setWelcomeProfileSetupStep, welcomeProfileSetupStep } = SiteData();
  const [firstName, setFirstName] = useState(userInfo?.firstName);
  const [lastName, setLastName] = useState(userInfo?.lastName);
  const [emailAddress, setEmailAddress] = useState(userInfo?.emailAddress);
  const [isAnyValueChanged, setIsAnyValueChanged] = useState(false); 
  const [userAdditionalInformation, setUserAdditionalInformation] = useState({
    emailAddress: userInfo?.emailAddress,
    dob: userInfo?.dob || "",
    age: "",
    gender: userInfo?.gender || "", // Setting initial value
  });

  useEffect(() => {
    setUserAdditionalInformation((prevUserInfo) => ({
      ...prevUserInfo,
      gender: userInfo?.gender || "", // Update if userInfo? changes
      dob: userInfo?.dob || "", // Update if userInfo? changes
    }));
  }, [userInfo]);

  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber);

    //@ts-ignore
    const handlePhoneNumberChange = (newValue) => {
      setPhoneNumber(newValue);
      //@ts-ignore
      setWelcomeProfileSetupStep((prevState) => ({
        ...prevState,
        phoneNumber: newValue,
      }));
    }

        // Function to update a subset of userInfo? 
    //@ts-ignore
    const updateUserInfoSubset = (updatedSubset) => {
      console.log("Updating user info subset with:", updatedSubset);
  
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        ...updatedSubset,
      }));
  
      console.log('[DEBUG] - Printing after update userInfo: ' , userInfo);
    };

        /**
     * This function is very important.
     * 1- Why do I need it? Because when the update happens, if the user refreshes the page they need their updated info to persist
     * without this function, if I refresh, the value would revert back to the previous value but on the database it's updated
     * So before this function, the user needs to logout and then log in to view their changes, this one makes it dynamic by updating the exisitng
     * userInfo? locally and if the user refreshes / logs out and back in they have the latest info
     */
      const updateCurrentUserInfo = () => {
      const updatedSubset = {
        phoneNumber: welcomeProfileSetupStep.phoneNumber,
      };
      updateUserInfoSubset(updatedSubset);
    };

    useEffect(() => {
      console.log('[DEBUG] - Updated userInfo afer change detection:', userInfo);
      setUserInfo(userInfo);
      localStorage.setItem('userInfo', encryptData(userInfo)); // encrypted userInfo
    }, [userInfo]);

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
        showSuccessSnackBarAlert('Basic account information updated successfully!');
  
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

  useEffect(() => {
    // Compare the current state with the initial state
      const hasValueChanged = phoneNumber !== userInfo?.phoneNumber ;

      if (hasValueChanged) {
        setIsAnyValueChanged(true);
        // Values have changed, you can do something here
        console.log('Values have changed:', welcomeProfileSetupStep);
      } else {
        setIsAnyValueChanged(false);
      }
  }, [phoneNumber]); // Dependency array containing the state you want to track

  return (
    <div className='container edit-account-information-container'>
      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />
      <p>
        Tell us more about yourself. This information will help our Smart Match
        system match you with people looking for someone like you!
      </p>
        {/* ----------------------------- FIRST NAME ----------------------------- */}
        <div className="form-floating mb-3 max-width-size">
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel htmlFor="emailAddress">First Name</InputLabel>
            <OutlinedInput
              disabled
              id="age"
              type="txt"
              label="First Name"
              value={firstName}
            />
          </FormControl>
        </div>

        {/* ----------------------------- LAST NAME ----------------------------- */}
        <div className="form-floating mb-3 max-width-size">
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel htmlFor="emailAddress">Last Name</InputLabel>
            <OutlinedInput
              disabled
              id="age"
              type="txt"
              label="Last Name"
              value={lastName}
            />
          </FormControl>
        </div>

        {/* ----------------------------- EMAIL ADDRESS ----------------------------- */}
        <div className="form-floating mb-3 max-width-size index-back">
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel htmlFor="emailAddress">Email Address</InputLabel>
            <OutlinedInput
              disabled
              id="age"
              type="txt"
              label="Email Address"
              value={emailAddress}
            />
          </FormControl>
        </div>

        {/* ----------------------------- PHONE NUMBER ----------------------------- */}
        <div className="form-floating mb-3 max-width-size index-back">
          <MuiTelInput value={phoneNumber} onChange={handlePhoneNumberChange} sx={{ '& .MuiOutlinedInput-root': { height: '55px' }, width: '100%' }} />
        </div>

        {/* ----------------------------- GENDER  ----------------------------- */}
                <div className="form-floating mb-3 max-width-size index-back">
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel >Gender</InputLabel>
            <OutlinedInput
              disabled
              id="age"
              type="txt"
              label="Gender"
              value={userInfo?.gender}
            />
          </FormControl>
        </div>

        {/* ----------------------------- Age ----------------------------- */}
        {/* if userInfo?.age is not set yet the user can set it once and hit save
        if the user already completed this step we will show the age and no longer allow him
        to update or hit the save buttom */}

          <div className="form-floating mb-3 max-width-size">
            <FormControl sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="emailAddress">Age</InputLabel>
              <OutlinedInput
                disabled
                id="age"
                type="txt"
                label="Age"
                value={userInfo?.age}
              />
            </FormControl>
          </div>

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

export default BasicAccountInformation;
