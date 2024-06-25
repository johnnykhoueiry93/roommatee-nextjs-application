import React, { useState, useEffect } from "react";
import "../../styles/myProfile/AccountVerification.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Input, Button } from "@mui/material";
// import BackendAxios from "../../backend/BackendAxios";
import { SiteData } from "../../context/SiteWrapper";
import SnackBarAlert from "../alerts/SnackBarAlerts";
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';
import CancelIcon from '@mui/icons-material/Cancel';
import VerifiedIcon from '@mui/icons-material/Verified';
import StaticFrontendLabel from "../../StaticFrontend";
import { setMysqlDatabaseFlagTrue } from '../../utils/utilities'

const AccountVerification = () => {
  //@ts-ignore
  const {userInfo, setUserInfo, isMobile, ID_DOCUMENT_S3_SUB_FOLDER, ID_DOCUMENT_SELFIE_S3_SUB_FOLDER, userVerificationStatus, setUserverificationStatus} = SiteData();
  const [documentType, setDocumentType] = useState(userInfo?.documentType);
  const [idDocumentFileUploaded, setIdDocumentFileUploaded] = useState(userInfo?.idDocument);
  const [idDocumentFileUrl, setIdDocumentFileUrl] = useState(userInfo?.idDocument);

  const [idDocumentSelfieFileUploaded, setIdDocumentSelfieFileUploaded] = useState(userInfo?.idDocumentSelfie);
  const [idDocumentSelfieFileUrl, setIdDocumentSelfieFileUrl] = useState(userInfo?.idDocumentSelfie);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const PENDING_STATUS = 'PENDING';
  const REJECTED_STATUS = 'REJECTED';
  const VERIFIED_STATUS = 'VERIFIED';
  const ID_PICTURE = "/images/Holding_id.png";
  const SELFIE_ID_PICTURE = "/images/Selfie_Holding_Id.png";

  const iconStyle = {
    fontSize: 40, // Adjust the size as needed
    color: 'var(--roomatee-theme-color)', // Change the color to your desired color
  };

//@ts-ignore
  const showSuccessAlert = (message) => {
    console.log(`Displaying to the user success message: ${message}`)
    setSnackbarMessage(message);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

//@ts-ignore
  const showFailureAlert = (message) => {
    console.log(`Displaying to the user error message: ${message}`)
    setSnackbarMessage(message);
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  };

  // When all three documents are uploaded the verificationStatus will be 
  // updated to PENDING
  useEffect(() => {
    if (documentType && idDocumentFileUploaded && idDocumentSelfieFileUploaded && userInfo?.verificationStatus != PENDING_STATUS ) {
      setMysqlDatabaseFlagTrue(userInfo.emailAddress, "userprofile", "verificationStatus", PENDING_STATUS);
      setUserverificationStatus(PENDING_STATUS);
      updateCurrentUserInfo();
    }
  }, [documentType, idDocumentFileUploaded, idDocumentSelfieFileUploaded]);
  
  const PendingStatus = () => {
    return (  
      <>
      <span>
        <SafetyCheckIcon style={iconStyle}/> Your documents are currently undergoing verification. Kindly allow up to 24 hours for the completion of this process.
      </span>
      </>)
  }


  const VerifiedStatus = () => {
    return (
      <>
        <span>
          <VerifiedIcon style={iconStyle} /> Your profile is verified! Thank you for making {StaticFrontendLabel.APPLICATION_NAME} a safe community for everyone!
        </span>
      </>
    );
  };
  

  const RejectedStatus = () => {
    return (
      <>
        <hr/>
        <p className='mb-3'>
          <CancelIcon style={iconStyle} /> {userInfo.rejectionReason}
        </p>
        <hr/>
  
        <DocumentUpload />
      </>
    );
  };
  

  const DocumentUpload = () => {
  const [selectedIdDocumentFile, setSelectedIdDocumentFile] = useState(null);
  const [selectedIdDocumentSelfieFile, setSelectedIdDocumentSelfieFile] = useState(null);
  const handleDocumentTypeChange = (event: SelectChangeEvent) => {
    setDocumentType(event.target.value as string);
    setMysqlDatabaseFlagTrue(userInfo.emailAddress, "userprofile", "documentType", event.target.value);
  };

  //@ts-ignore
    const handleIdDocumentChange = (event) => {
      const file = event.target.files;
      setSelectedIdDocumentFile(file);
    };

  //@ts-ignore
    const handleIdDocumentSelfieChange = (event) => {
      const file = event.target.files;
      setSelectedIdDocumentSelfieFile(file);
    };

    const handleUploadPictureToS3SubFolder = async (s3SubFolderPath) => {
      const isIdDocumentSelfie = s3SubFolderPath === ID_DOCUMENT_SELFIE_S3_SUB_FOLDER;
      const selectedFile = isIdDocumentSelfie ? selectedIdDocumentSelfieFile : selectedIdDocumentFile;
      const databaseColumn = isIdDocumentSelfie ? "idDocumentSelfie" : "idDocument";
    
      if (!selectedFile) {
        showFailureAlert("No file selected");
        return;
      }

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
          // setUserProfilePicture(updatedImageUrl);
          // console.log('Returned profile picture data.imageUrl: ' + updatedImageUrl);
          showSuccessAlert('Success! Document picture updated.')
          setMysqlDatabaseFlagTrue(userInfo.emailAddress, 'userprofile', databaseColumn, '1');
          isIdDocumentSelfie ? setIdDocumentSelfieFileUploaded(true) : setIdDocumentFileUploaded(true);
          isIdDocumentSelfie ? setIdDocumentSelfieFileUrl(updatedImageUrl) : setIdDocumentFileUrl(updatedImageUrl);

        } else {
          console.error("Failed to upload document picture.");
          showFailureAlert('Failed to upload document picture.');
        }
      }  else {
        console.log("No profile picture selected");
        showFailureAlert("No profile picture selected");
      }
    };

  if(!userInfo) {
    return <div>Loading userinfo in Profile Picture...</div>
  }

  function returnIdUploadSection() {
    if(idDocumentFileUploaded) {
      return (
        <img src={idDocumentFileUrl} height='100px' width='auto'/>
      )
    } else {
      return (
        <div>
          <img
            src={ID_PICTURE}
            className="picture-id"
            alt={`ID ${documentType}`}
          />
          <div className='input-and-upload-container'>
            <Input
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleIdDocumentChange}
              style={{width: '80%'}}
            />
            <Button
              className="upload-button"
              variant="contained"
              color="primary"
              disabled={!documentType}
              style={{width: '20%'}}
              onClick={() =>
                handleUploadPictureToS3SubFolder(
                  ID_DOCUMENT_S3_SUB_FOLDER
                )
              }
            >
              Upload
            </Button>
          </div>
        </div>
      )
    } 
  }

  function returnIdSelfieUploadSection() {
    if (idDocumentSelfieFileUploaded) {
      return <img src={idDocumentSelfieFileUrl} height="100px" width="auto" />;
    } else {
      return (
        <div>
          <img
            src={SELFIE_ID_PICTURE}
            className="picture-id"
            alt={`Selfie with ${documentType}`}
          />
          <div className="input-and-upload-container">
            <Input
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleIdDocumentSelfieChange}
              style={{ width: "80%" }}
            />
            <Button
              className="upload-button"
              variant="contained"
              color="primary"
              style={{ width: "20%" }}
              onClick={() =>
                handleUploadPictureToS3SubFolder(ID_DOCUMENT_SELFIE_S3_SUB_FOLDER)
              }
              disabled={!documentType}
            >
              Upload
            </Button>
          </div>
        </div>
      );
    }
  }
  

    return (
      <>
        <div>
          <p> {StaticFrontendLabel.VERIFICATION_POST_COMPLETION_RESULT} </p>
        </div>

        <div>
          <p className="select-document-label">Select a document type</p>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Document Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={documentType}
              label="Select a document type"
              onChange={handleDocumentTypeChange}
              style={{ width: "200px" }}
            >
              <MenuItem value="Passport">Passport</MenuItem>
              <MenuItem value="Driver's License">Driver's License</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="picture-upload-row">

          <div className="row">
          <div className={`col-12 col-lg-6 ${isMobile ? 'd-flex justify-content-center' : ''}`}>
              <div className={`${isMobile ? 'text-center' : ''}`}>
                
              <p className="select-document-label">Upload a picture of your {documentType}</p>

              {returnIdUploadSection()}

              
              </div>
            </div>

            <div className={`col-12 col-lg-6 ${isMobile ? 'd-flex justify-content-center' : ''}`}>
            <div className={`${isMobile ? 'text-center' : ''}`}>
              <p className="select-document-label">Upload a selfie holding your {documentType}</p>
              
              {returnIdSelfieUploadSection()}


              </div>
            </div>
          </div>
          
        </div>
      </>
    )
  }

  //@ts-ignore
  // const updateUserInfoSubset = (updatedSubset) => {
  //   setUserInfo([
  //     {
  //       ...userInfo, // Copy existing userInfo
  //       ...updatedSubset, // Update the specified subset
  //     },
  //     ...userInfo.slice(1), // Keep other elements unchanged
  //   ]);
  // };

  const updateUserInfoSubset = (updatedSubset) => {
    setUserInfo({
      ...userInfo, // Copy existing userInfo
      ...updatedSubset, // Update the specified subset
    });
  };

  const updateCurrentUserInfo = () => {
    const updatedSubset = {
      verificationStatus: 'PENDING',
      documentType: documentType,
      idDocument: idDocumentFileUploaded,
      idDocumentSelfie: idDocumentSelfieFileUploaded,
    };
    updateUserInfoSubset(updatedSubset);
  };

  return (
    <div className="container account-verification-container">
      {/* <ProfileComponentTitle title={'Account Verification'}/> */}
      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />
      <div>
        <p>{StaticFrontendLabel.VERIFICATION_REASON_TEXT}</p>
      </div>

      <div>
        {/* Why am I using userVerificationStatus == 'PENDING' ?
        it's because after the user uploads everything and during his current session
        if he swtiches tabs we need to ensure if he comes back to the profile section
        the status is still verified.
         */}

        {userInfo?.verificationStatus === PENDING_STATUS ? (
          <PendingStatus />
        ) : userInfo?.verificationStatus === REJECTED_STATUS ? (
          <RejectedStatus />
        ) : userInfo?.verificationStatus === VERIFIED_STATUS ? (
          <VerifiedStatus />
        ) : (
          <DocumentUpload />
        )}
      </div>
</div>
  );
};

export default AccountVerification;
