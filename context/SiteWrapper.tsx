"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// @ts-ignore
const SiteContext = createContext();
export const SiteData = () => useContext(SiteContext);
import { encryptData, decryptData } from "../utils/encryptionUtils";
import Cookies from "js-cookie";
import { useMediaQuery } from "@mui/material";

// @ts-ignore
export const SiteWrapper = ({ children }) => {
  const [profiles, setProfiles] = useState("hello111");
  const [Bootstrap, setBootstrap] = useState(undefined);
  const [firebaseToken, setFirebaseToken] = useState();
  const [userAdmin, setUserAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailAddressToReset, setEmailAddressToReset] = useState();
  const [signUpEmail, setSignUpEmail] = useState(null);
  const [userEmailVerified, setUserEmailVerified] = useState(false);
  const isMobile = useMediaQuery("(max-width:767px)");
  const isTablet = useMediaQuery("(min-width:768px) and (max-width:1023px)");
  const PROFILE_PICTURE_S3_SUB_FOLDER='profile-picture';
  const ID_DOCUMENT_S3_SUB_FOLDER='id-document';
  const ID_DOCUMENT_SELFIE_S3_SUB_FOLDER='id-document-selfie';

    // This function is used to scroll up when needed
    const scrollToTop = () => {
      console.log("Scrolling to the top of the window");
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Optional: smooth scrolling animation
      });
    };

  // Without this the bootstrap functionality will not work
  useEffect(() => {
    if (!Bootstrap) {
      const BS = require("bootstrap/dist/js/bootstrap.bundle.min.js");
      setBootstrap(BS);
    }
  }, []);

  function userIsAdmin() {
    let isAdmin = false;
    // if(userInfo) {
    //   if (userInfo[0].userType == "admin" && userAuth) {
    //     isAdmin = true;
    //   }
    // }

    return isAdmin;
  }

  // const [userInfo, setUserInfo] = useState(() => {
  //   // If the userInfo already exists meaning the user was logged in
  //   // and they performed a refresh then get it from the local storage
  //   if (localStorage.getItem("userInfo")) {
  //     const storedUserInfo = decryptData(localStorage.getItem("userInfo")); // get decrypted text
  //     console.log("SiteWrapper: ", storedUserInfo);
  //     return storedUserInfo && typeof storedUserInfo === "object"
  //       ? storedUserInfo
  //       : [];
  //   }
  // });




  const [userProfilePicture, setUserProfilePicture] = useState(() => {
    let storedUserProfilePicture;
    if (typeof window !== 'undefined') {
      storedUserProfilePicture = localStorage.getItem('userProfilePicture');
    }
    return storedUserProfilePicture ? JSON.parse(storedUserProfilePicture) : [];
  });

// Code related to userAuth -- With Encryption
  const [userAuth, setUserAuth] = useState(() => {
    const storedUserAuth = Cookies.get("userAuth");
    if (storedUserAuth) {
      try {
        const decryptedAuth = decryptData(storedUserAuth);
        return JSON.parse(decryptedAuth);
      } catch (error) {
        console.error("Error decrypting userAuth:", error);
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    if (userAuth !== false) {
      const encryptedAuth = encryptData(JSON.stringify(userAuth));
      Cookies.set("userAuth", encryptedAuth, { expires: 1 / 8 }); // 3 hours expiration
    } else {
      Cookies.remove("userAuth");
    }
  }, [userAuth]);



  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // If the userInfo already exists meaning the user was logged in
    // and they performed a refresh then get it from the local storage
    const storedUserInfo = localStorage.getItem("userInfo");

    console.log("SiteWrapper Getting storedUserInfo: ", storedUserInfo);

    if (storedUserInfo) {
      const decryptedUserInfo = decryptData(storedUserInfo); // get decrypted text
      console.log("SiteWrapper: ", decryptedUserInfo);
      setUserInfo(decryptedUserInfo);
    }
  }, []);


  // ---------------------------------------------------------- SNACK BAR
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
  // ---------------------------------------------------------- SNACK BAR

  useEffect(() => {
    if(userAuth) {
      localStorage.setItem('userInfo', encryptData(userInfo));
      // localStorage.setItem('userProfilePicture', JSON.stringify(userProfilePicture));
      // localStorage.setItem('userSupportTickets', JSON.stringify(supportTickets));
      // localStorage.setItem('storedOpenedSupportTicket', JSON.stringify(openedSupportTicket));
      // localStorage.setItem('storedSupportTicketMessages', JSON.stringify(supportTicketMessages));
      // if(userInfo.userType == "admin") {
      //   setUserAdmin(true);
      // }

    } 
  }, [userInfo, userAuth, userProfilePicture]); // add userProfilePicture

  /**
   * This object holds all the user information saved during the 
   * first time setup or as we also call the onboarding of the user
   * to the application.
   */
   const [describePlaceWorkflow, setDescribePlaceWorkflow] = useState("");
   const [prevProgress, setPrevProgress] = useState(0);
   const [nextProgress, setNextProgress] = useState(10);
   const [describeTenanteWorkflow, setDescribeTenanteWorkflow] = useState("");
   const [welcomeProfileSetupStep, setWelcomeProfileSetupStep] = useState({
    isProfileComplete: '',
    isLookingForRoommate: "",
    citiesLookingToLiveIn: '', // array for arrays [Massachusetts, Burlington], [Massachusetts. Boston], [Massachusetts, Bedford]
    budget: '',
    typeOfPlace: "", 
    minAge: "18",
    maxAge: "30",
    userHasAPlace: "", // 0 or 1
    gender: "",
    socialStatus: "",
    isSmoker: "", // 0 or 1
    hasPet: "", // 0 or 1
    cleanlinessLevel: "",
    dob: "",
    age: '',
    instagram: '',
    twitter: '',
    facebook: '',
    socialstatusDetails: '',
    bio: '',
    languages: '', // English, Frensh
    hasKids: '', // 0 or 1
    preferredFurnishedPlace: '', // 0 or 1
    preferredLeaseTerm: '',
    phoneNumber: '',
    roommateCount: '',
    moveInDate: '',
  });













  return (
    <SiteContext.Provider
      value={{
        isMobile,isTablet, PROFILE_PICTURE_S3_SUB_FOLDER, ID_DOCUMENT_S3_SUB_FOLDER, ID_DOCUMENT_SELFIE_S3_SUB_FOLDER,
        profiles, setProfiles, Bootstrap, scrollToTop, userAuth, setUserAuth, userInfo, setUserInfo,
        userIsAdmin, firebaseToken, setFirebaseToken, userAdmin, setUserAdmin,
        userProfilePicture, setUserProfilePicture, userEmailVerified, setUserEmailVerified,
        loading, setLoading, emailAddressToReset, setEmailAddressToReset, signUpEmail, setSignUpEmail,
        snackbarOpen, setSnackbarOpen, snackbarMessage, setSnackbarMessage, snackbarSeverity, setSnackbarSeverity,
        welcomeProfileSetupStep, setWelcomeProfileSetupStep, describePlaceWorkflow, setDescribePlaceWorkflow, prevProgress, setPrevProgress, nextProgress, setNextProgress,
        describeTenanteWorkflow, setDescribeTenanteWorkflow,  
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSiteContext must be used within a SiteProvider");
  }
  return context;
};
