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
  const [userSearchType, setUserSearchType] = useState([]);
  const [intendedDestination, setIntendedDestination] = useState(null); // defines the next page the user is going to in case no logged in to sign in then resume where they left off
  const [listingsCreated, setListingsCreated] = useState(0);
  const [showListingCreatedAlert, setShowListingCreatedAlert] = useState(false);
  const [isSearchClicked, setSearchClick] = useState(false);
  
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

  const [editListingId, setEditListingId] = useState(null);
  useEffect(() => {
    const storedEditListingId = localStorage.getItem('storedEditListingId');
    console.log('SiteWrapper Getting storedEditListingId: ', storedEditListingId);

      setEditListingId(storedEditListingId);
  }, []);

  /**
   * ---------------------------- Context for Listings --------------------------------
   */
  const [listing, setListing] = useState([]);

  // Ensure the listings are available and loaded from the storage
  // if the page is loaded
  useEffect(() => {
    const storedUserListings = localStorage.getItem('userListings');

    console.log('SiteWrapper Getting storedUserListings: ', storedUserListings);

    if (storedUserListings) {
      try {
        const parsedListings = JSON.parse(storedUserListings);
        console.log('SiteWrapper parsedListings: ', parsedListings);
        setListing(parsedListings);
      } catch (error) {
        console.error('Failed to parse storedUserListings', error);
      }
    }
  }, []);


  useEffect(() => {
    // This delay allows the record to get inserted before we try to retrieve everything again.
    const delay = 100; // 100ms

    async function getUserListings(user) {
      if (!user) return;
      
      const { id: userProfileId, emailAddress } = user;

      try {
        const response = await fetch('/api/getUserListings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userProfileId, emailAddress }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user listings');
        }

        const data = await response.json();

        setListing(data);
        localStorage.setItem('userListings', JSON.stringify(data));
        console.log('getUserListings:', data);
        return data;
      } catch (error) {
        console.error('Error fetching user listings:', error);
        throw error;
      }
    }

    // Ensure userInfo is available before calling the function
    if (userInfo) {
      const timeout = setTimeout(() => {
        getUserListings(userInfo);
      }, delay);

      // Cleanup timeout on component unmount or on dependency change
      return () => clearTimeout(timeout);
    }
  }, [listingsCreated]);




  
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


  // ---------------------------------------------------------- SNACK BAR
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
  // ---------------------------------------------------------- SNACK BAR

  // useEffect(() => {
  //   if(userAuth) {
  //     localStorage.setItem('userInfo', encryptData(userInfo));
  //     // localStorage.setItem('userProfilePicture', JSON.stringify(userProfilePicture));
  //     // localStorage.setItem('userSupportTickets', JSON.stringify(supportTickets));
  //     // localStorage.setItem('storedOpenedSupportTicket', JSON.stringify(openedSupportTicket));
  //     // localStorage.setItem('storedSupportTicketMessages', JSON.stringify(supportTicketMessages));
  //     // if(userInfo.userType == "admin") {
  //     //   setUserAdmin(true);
  //     // }

  //   } 
  // }, [userInfo, userAuth, userProfilePicture]); // add userProfilePicture

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


  const [searchValue, setSearchValue] = useState({
    rawAddressValue: '',
    locationResolved: 0,
    zip: '',
    city: '',
    state: '',
    country: '',
    address: '',
    street: '',
  });

  // This function when called will ensure that the Autocomplete search is reset and it doesnt 
  // hold any value if the user logs out for example
  const resetSearchValue = () => {
    console.log('[SiteWrapper] - The setSearchValue has been reset')
    setSearchValue({ //@ts-ignore
      rawAddressValue: null, //@ts-ignore
      locationResolved: null, //@ts-ignore
      zip: null, //@ts-ignore
      city: null, //@ts-ignore
      state: null, //@ts-ignore
      country: null, //@ts-ignore
      address: null, //@ts-ignore
      street: null, //@ts-ignore
    });
  };


/**
   * This object holds the information of the create room listing and edit room listing
   */
 const [roomListingData, setRoomListingData] = useState({
  userProfileId: "",
  listingType: "",
  price: "",
  address: "",
  country: "",
  city: "",
  state: "",
  zip: "",
  moveInDate: "",
  privateBathroom: false,
  privateParking: false,
  publicParking: false,
  internetConnection: false,
  washer: false,
  dryer: false,
  dishWasher: false,
  wheelChairAccessibility: false,
  floor: "",
  petFriendly: false,
  refrigerator: false,
  microwave: false,
  genderPreference: "",
  agePreference: "",
  minAge: 0,
  maxAge: 0,
  smokingAllowed: false,
  furnished: false,
  television: false,
  airConditionning: false,
  heating: false,
  fireplace: false,
  smokeAlarm: false,
  dishes: false,
  toaster: false,
  coffeeMaker: false,
  bedSize: "",
  pictures: [],
  description: "",
  latitude: "",
  longitude: ""
});

// This is the function to reset roomListingData
//@ts-ignore
const resetRoomListingData = (setRoomListingData) => {
setRoomListingData({
  userProfileId: null,
  listingType: null,
  price: null,
  address: null,
  country: null,
  city: null,
  state: null,
  zip: null,
  moveInDate: null,
  leaseDurationInMonth: null,
  privateBathroom: null,
  privateParking: null,
  publicParking: null,
  internetConnection: null,
  washer: null,
  dryer: null,
  dishWasher: null,
  wheelChairAccessibility: null,
  floor: null,
  petFriendly: null,
  refrigerator: null,
  microwave: null,
  genderPreference: null,
  agePreference: null,
  minAge: null,
  maxAge: null,
  smokingAllowed: null,
  furnished: null,
  television: null,
  airConditioning: null,
  heating: null,
  fireplace: null,
  smokeAlarm: null,
  dishes: null,
  toaster: null,
  coffeeMaker: null,
  bedSize: null,
  pictures: [],
  description: null,
  latitude: null,
  longitude: null
});
};







  return (
    <SiteContext.Provider
      value={{
        isMobile,isTablet, PROFILE_PICTURE_S3_SUB_FOLDER, ID_DOCUMENT_S3_SUB_FOLDER, ID_DOCUMENT_SELFIE_S3_SUB_FOLDER,
        profiles, setProfiles, Bootstrap, scrollToTop, userAuth, setUserAuth, userInfo, setUserInfo, editListingId, setEditListingId,
        userIsAdmin, firebaseToken, setFirebaseToken, userAdmin, setUserAdmin, listing, setListing,
        userProfilePicture, setUserProfilePicture, userEmailVerified, setUserEmailVerified, isSearchClicked, setSearchClick,
        loading, setLoading, emailAddressToReset, setEmailAddressToReset, signUpEmail, setSignUpEmail,
        snackbarOpen, setSnackbarOpen, snackbarMessage, setSnackbarMessage, snackbarSeverity, setSnackbarSeverity,
        welcomeProfileSetupStep, setWelcomeProfileSetupStep, describePlaceWorkflow, setDescribePlaceWorkflow, prevProgress, setPrevProgress, nextProgress, setNextProgress,
        describeTenanteWorkflow, setDescribeTenanteWorkflow,  searchValue, setSearchValue, userSearchType, setUserSearchType, intendedDestination, setIntendedDestination,
        roomListingData, setRoomListingData, resetRoomListingData, listingsCreated, setListingsCreated, showListingCreatedAlert, setShowListingCreatedAlert,
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
