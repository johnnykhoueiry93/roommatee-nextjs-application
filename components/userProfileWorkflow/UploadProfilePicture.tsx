"use client";

import Title from "./Title";
import SubTitle from "./SubTitle";
import NavigationButton from "./NavigationButton";
// import BackendAxios from "../../backend/BackendAxios";
import { SiteData } from "../../context/SiteWrapper";
import { logFrontendActivityToBackend } from "../../utils/apiUtils";
import { Avatar } from "@mui/material";
import { useState } from "react";
import { Button } from "@mui/material";

//@ts-ignore
const UploadProfilePicture = ({ nextStep, prevStep }) => {
  //@ts-ignore
  const { isMobile, userInfo, setUserInfo, welcomeProfileSetupStep, setWelcomeProfileSetupStep, userProfilePicture, setUserProfilePicture, PROFILE_PICTURE_S3_SUB_FOLDER, setPrevProgress, setNextProgress } = SiteData();
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

  //@ts-ignore
  const handleUploadPictureToS3SubFolder = async (s3SubFolderPath) => {
    if (selectedFile) {
      console.log(`Upoading profile picture to: ${s3SubFolderPath}`);

      const key = `${userInfo.id}-${s3SubFolderPath}.png?folder=${s3SubFolderPath}`;
      const formData = new FormData();
      formData.append("picture", selectedFile);
      formData.append("userId", userInfo.id);
      formData.append("emailAddress", userInfo.emailAddress);


      const response = await fetch("/api/handleUploadPictureToS3SubFolder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }), // Send the parameters in the request body
        cache: 'no-store' // Ensures the data is fetched on every request
      });
      const data = await response.json();
    //   return data;

    if (response.status === 200) {
        window.alert('Picture uploaded successfully!'); //TODO add success snack bar
      } else {
        window.alert('Failred to upload picture!') //TODO add success snack bar
      }

      // Start by calling the upload picture
    //   BackendAxios.post("/handleUploadPictureToS3SubFolder", formData, {
    //     params: { folder: s3SubFolderPath },
    //   })
    //     .then((response) => {
    //       console.log(
    //         "File uploaded successfully. S3 location:",
    //         response.data.s3Location
    //       );

    //       // Since the upload is success get the URL of the picture from S3
    //       BackendAxios.post(`/getS3PictureUrl/${key}`)
    //         .then((response) => {
    //           console.log(
    //             "Setting the user profile picture to URL: " +
    //               response.data.s3Url
    //           );
    //           setUserProfilePicture(response.data.s3Url);
    //           console.log("Profile picture uploaded successfully");
    //           //   showSuccessAlert('Success! Profile picture updated.');
    //         })
    //         .catch((error) => {
    //           console.error("Error:", error);
    //           //   showFailureAlert('Failed to update profile picture.');
    //         });
    //     })
    //     .catch((error) => {
    //       console.error("Error uploading file:", error);
    //       //   showFailureAlert('Failed to update profile picture.');
    //     });
    // } else {
    //   console.log("No profile picture selected");
    //   //   showFailureAlert("No profile picture selected");
    // }

    }

  };

  return (
    <div>

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
          onClick={() =>
            handleUploadPictureToS3SubFolder(PROFILE_PICTURE_S3_SUB_FOLDER)
          }
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
