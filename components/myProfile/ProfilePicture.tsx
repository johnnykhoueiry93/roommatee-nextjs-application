import { SiteData } from "../../context/SiteWrapper";
import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Input, Button } from "@mui/material";
import "../../styles/myProfile/ProfilePicture.css";
import SnackBarAlert from "../alerts/SnackBarAlerts";
import StaticFrontendLabel from "../../StaticFrontend";
import { setMysqlDatabaseFlagTrue } from '../../utils/utilities'

const ProfilePicture = () => {
  //@ts-ignore
  const { isMobile, userInfo, userProfilePicture, setUserProfilePicture, PROFILE_PICTURE_S3_SUB_FOLDER } = SiteData();
  const [selectedFile, setSelectedFile] = useState(null);
  const searchResultChipAvatarStyle = {
    ...(isMobile
      ? { height: "80px", width: "80px" }
      : { height: "130px", width: "130px" }),
  };

  const MY_PROFILE_PROFILE_PICTURE_TEXT = StaticFrontendLabel.MY_PROFILE_PROFILE_PICTURE_TEXT;

    // ---------------------------------------------------------- SNACK BAR
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    // ---------------------------------------------------------- SNACK BAR

  //@ts-ignore
  const handleFileChange = (event) => {
    // Access the selected file from the event
    const file = event.target.files;
    setSelectedFile(file);
  };

  //@ts-ignore
  function showSuccessAlert(message) {
    console.log(`Displaying to the user success message: ${message}`);
    setSnackbarMessage(message);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  }

  //@ts-ignore
  function showFailureAlert(message) {
    console.log(`Displaying to the user success message: ${message}`);
    setSnackbarMessage(message);
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  }

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
    
      console.log('Output of selectedFile: ' , selectedFile);
      const base64File = await toBase64(selectedFile[0]);

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

      const data = await response.json();

    if (response.status === 200) {
        const updatedImageUrl = `${data.imageUrl}?timestamp=${new Date().getTime()}`; // Append a timestamp to force reload
        setUserProfilePicture(updatedImageUrl);
        console.log('Returned profile picture data.imageUrl: ' + updatedImageUrl);
        showSuccessAlert('Success! Profile picture updated.')
        setMysqlDatabaseFlagTrue(userInfo.emailAddress, 'userprofile', 'isProfilePictureUploaded', '1');
      } else {
        console.error("Failed to update profile picture.");
        showFailureAlert('Failed to update profile picture.');
      }
    }  else {
      console.log("No profile picture selected");
      showFailureAlert("No profile picture selected");
    }
  };


  useEffect(() => {
    console.log('UserProfilePicture updated:', userProfilePicture);
  }, [userProfilePicture]);


  if(!userInfo) {
    return <div>Loading userinfo in Profile Picture...</div>
  }

  return (
    <div className="container profile-picture-container">
      
      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
        
      />

      <p>{MY_PROFILE_PROFILE_PICTURE_TEXT}</p>
      
      <div className="d-flex align-items-center" style={{ width: '99%' }}>
  {/* Avatar */}
  <Avatar
    alt={userInfo.firstName}
    src={userProfilePicture}
    style={searchResultChipAvatarStyle}
    className={`flex-shrink-0 me-${isMobile ? '2' : '3'}`} // Adjust margin for spacing
  />

  {/* User Info */}
  <div className="flex-grow-1">
    {/* Full Name */}
    <span className="user-full-name">
      {userInfo.firstName} {userInfo.lastName}
    </span>

    {/* Upload Picture */}
    <div className="file-upload-container d-flex align-items-center">
      <Input
        type="file"
        inputProps={{ accept: "image/*" }} // Set accepted file types, e.g., images
        onChange={handleFileChange}
      />
      <Button
        className="upload-button"
        variant="contained"
        color="primary"
        onClick={() => handleUploadPictureToS3SubFolder(PROFILE_PICTURE_S3_SUB_FOLDER)}
      >
        Upload
      </Button>
    </div>
  </div>
</div>
    </div>
  );
};

export default ProfilePicture;
