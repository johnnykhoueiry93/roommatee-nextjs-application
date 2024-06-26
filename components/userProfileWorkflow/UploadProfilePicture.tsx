"use client";

import Title from "./Title";
import SubTitle from "./SubTitle";
import NavigationButton from "./NavigationButton";
import { SiteData } from "../../context/SiteWrapper";
import { logFrontendActivityToBackend } from "../../utils/apiUtils";
import { Avatar } from "@mui/material";
import { useState } from "react";
import { Button } from "@mui/material";
import SnackBarAlert from "../alerts/SnackBarAlerts";

//@ts-ignore
const UploadProfilePicture = ({ nextStep, prevStep }) => {
  //@ts-ignore
  const { isMobile, userInfo, setUserInfo, welcomeProfileSetupStep, setWelcomeProfileSetupStep, userProfilePicture, setUserProfilePicture, PROFILE_PICTURE_S3_SUB_FOLDER, setPrevProgress, setNextProgress, snackbarOpen, setSnackbarOpen, snackbarMessage, setSnackbarMessage, snackbarSeverity, setSnackbarSeverity } = SiteData();
  setPrevProgress(90);
  setNextProgress(95);
  let completionMessage = "The user completed the Setup Profile workflow";
  const COMPONENT_TITLE = "Let people get to know you!";
  const COMPONENT_SUB_HEADING = "A profile picture is a great starter when connecting with new people!";
  const [selectedFile, setSelectedFile] = useState(null);

  const searchResultChipAvatarStyle = {
    ...(isMobile
      ? { height: "130px", width: "130px" }
      : { height: "200px", width: "200px" }),
  };

  //@ts-ignore
  const handleFileChange = (event) => {
    // Access the selected file from the event
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  async function getNavBarProfilePicture(user) {
    const key = `profile-picture/${user.id}-profile-picture.png`;
    
    try {
      const response = await fetch(`/api/getS3PictureUrl?key=${key}`, {
        method: 'POST',
      });
      const data = await response.json();

      if (response.status === 200) {
        console.log("[DEBUG] - [UploadProfilePicture.tsx] - Setting the user profile picture to URL: " + data.s3Url);
        setUserProfilePicture(data.s3Url);
        console.log("[DEBUG] - [UploadProfilePicture.tsx] - setting in storage userProfilePicture: " + data.s3Url);
        localStorage.setItem("userProfilePicture", JSON.stringify(data.s3Url));
        // Set Snackbar state
        setSnackbarMessage("Profile picture uploaded");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        // Set Snackbar state
        setSnackbarMessage("Failed to upload profile picture.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);    
      }
      
     
    } catch (error) {
      console.error("Error:", error);
    }
  }

  //@ts-ignore
  const handleUploadPictureToS3SubFolder = async (s3SubFolderPath) => {
    if (selectedFile) {
      console.log(`Upoading profile picture to: ${s3SubFolderPath}`);

      const key = `${userInfo.id}-${s3SubFolderPath}.png?folder=${s3SubFolderPath}`;

      //@ts-ignore
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        //@ts-ignore
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
      });
    
      const base64File = await toBase64(selectedFile);

      const response =  await fetch("/api/handleUploadPictureToS3SubFolder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedFile: base64File,
          userId: userInfo.id,
          emailAddress: userInfo.emailAddress,
          s3SubFolderPath}), // Send the parameters in the request body
        cache: 'no-store' // Ensures the data is fetched on every request
      });


    if (response.status === 200) {
        getNavBarProfilePicture(userInfo);
      } else {
        window.alert('Failred to upload picture!') //TODO add success snack bar
      }
    }

  };

  return (
    <div>


<SnackBarAlert
          message={snackbarMessage}
          open={snackbarOpen}
          handleClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        />

      {/* ---------------------------------- TITLE ---------------------------------- */}
      <Title text={COMPONENT_TITLE} />

      {/* ---------------------------------- SUB HEADING ---------------------------------- */}
      <SubTitle text={COMPONENT_SUB_HEADING} />

      <div className="container center-avatar">
        <label htmlFor="profile-picture-upload">
          <Avatar
            src={userProfilePicture}
            style={searchResultChipAvatarStyle}
            className="center-avatar cursor-pointer"
          />
        </label>
        <input
          id="profile-picture-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
      
      {/* Add a button for upload */}
      <div className='upload-picture-btn'>       
          <Button
          variant="contained"
          color="primary"
          onClick={() => handleUploadPictureToS3SubFolder(PROFILE_PICTURE_S3_SUB_FOLDER) }
          disabled={!selectedFile}
          style={{ marginTop: 20, width: '100px' }}
        >
          Upload
        </Button></div>

      {/* ---------------------------------- NAVIGATION BUTTONS ---------------------------------- */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <NavigationButton
          direction="Back"
          nextStep={nextStep}
          prevStep={prevStep}
        />

        {/* The Next button will be hidden until the user provides a response, then it will be displayed */}
        <div
          onClick={() => {
              logFrontendActivityToBackend(completionMessage, userInfo),
              console.log(welcomeProfileSetupStep);
          }}
        >
          <NavigationButton
            direction="Finish"
            nextStep={nextStep}
            prevStep={prevStep}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadProfilePicture;
