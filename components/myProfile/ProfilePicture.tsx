import "../../styles/myProfile/ProfilePicture.css";
import { SiteData } from "../../context/SiteWrapper";
import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Input, Button } from "@mui/material";
import SnackBarAlert from "../alerts/SnackBarAlerts";
import StaticFrontendLabel from "../../StaticFrontend";
import { setMysqlDatabaseFlagTrue } from '../../utils/utilities'
import { logFrontendActivityToBackend } from '../../utils/apiUtils'

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
    try {
      if (selectedFile) {
        await logFrontendActivityToBackend(`Breakpoint #1`, userInfo);

        const formData = new FormData();
        formData.append("selectedFile", selectedFile[0]);
        formData.append("userId", userInfo.id);
        formData.append("emailAddress", userInfo.emailAddress);
        formData.append("s3SubFolderPath", s3SubFolderPath);
        await logFrontendActivityToBackend(`Breakpoint #2`, userInfo);

        const formDataDetails = {
          selectedFile: selectedFile[0].name,
          userId: userInfo.id,
          emailAddress: userInfo.emailAddress,
          s3SubFolderPath: s3SubFolderPath,
        };

        logFrontendActivityToBackend(`Breakpoint #3`, userInfo);

        await logFrontendActivityToBackend(`formData: ${JSON.stringify(formDataDetails)}`, userInfo);
  
        // Debugging
        console.log('FormData Keys:', Array.from(formData.keys()));
        console.log('FormData Entries:', Array.from(formData.entries()));

        await logFrontendActivityToBackend(`Selected File: ${JSON.stringify({
          name: selectedFile[0].name,
          type: selectedFile[0].type,
          size: selectedFile[0].size,
        })}`, userInfo);

        await logFrontendActivityToBackend(`${selectedFile[0].type}`, userInfo);
        await logFrontendActivityToBackend(`${selectedFile[0].size}`, userInfo);

        const response = await fetch("/api/handleUploadPictureToS3SubFolder", {
          method: "POST",
          body: formData,
          // Ensure correct headers for FormData (automatically set)
        });

        await logFrontendActivityToBackend(`Breakpoint #4`, userInfo);

        if (!response.ok) {
          logFrontendActivityToBackend(`Breakpoint #5`, userInfo);
          const errorText = await response.text();
          console.log(errorText);
          console.log(response.status);
          throw new Error(`Server responded with status ${response.status}: ${errorText}`);
        }


        const data = await response.json();

        await logFrontendActivityToBackend(`Breakpoint #5`, userInfo);
  
        if (response.status === 200) {
          const updatedImageUrl = `${data.imageUrl}?timestamp=${new Date().getTime()}`;
          setUserProfilePicture(updatedImageUrl);
          console.log('Returned profile picture data.imageUrl: ' + updatedImageUrl);
          showSuccessAlert('Success! Profile picture updated.')
          setMysqlDatabaseFlagTrue(userInfo.emailAddress, 'userprofile', 'isProfilePictureUploaded', '1');
        } else {
          console.error("Failed to update profile picture.");
          showFailureAlert('Failed to update profile picture.');
        }
      } else {
        console.log("No profile picture selected");
        showFailureAlert("No profile picture selected");
      }
    } catch (error) {
      console.error('Error during upload:', error);
      await logFrontendActivityToBackend(`handleUploadPictureToS3SubFolder ERROR ${error.message}`, userInfo);
    }

    await logFrontendActivityToBackend(`Breakpoint #6`, userInfo);
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
