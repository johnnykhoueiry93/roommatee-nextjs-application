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
import dayjs from 'dayjs';
import MessageComponentLoader from "../components/loaders/MessageComponentLoader";

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
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [mapAddress, setMapAddress] = useState("");
  const [badgeFilterShow, setBadgeFilterShow] = useState("");
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [moveInDate, setMoveInDate] = useState(null);
  const [countEnabledSearchFilters, setCountEnabledSearchFilters] = useState(0);
  const [userVerificationStatus, setUserverificationStatus] = useState(0);
  const [homepageRoommatesResults, setHomepageRoommatesResults] = useState("");
  const [homepageRoomResults, setHomepageRoomResults] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchFilterModalMobileTextSize = 5;
  const searchFilterModalLargeScreenTextSize = 5;
  const [priceSortDirection, setPriceSortDirection] = useState("asc");
  const [listingCreatedDateSortDirection, setListingCreatedDateSortDirection] = useState("asc");
  const [searchFilterType, setSearchFilterType] = useState("price");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [supportTicketsUpdate, setSupportTicketsUpdate] = useState(0);
  const [reply, setReply] = useState(0);

  const [conversationId, setConversationId] = useState('');    
  const [fullNameOfOpposingChat, setFullNameOfOpposingChat] = useState('');
  const [conversationTopicUrl, setConversationTopicUrl] = useState();
  const [secondPartyUserId, setSecondPartyUserId] = useState('');
  const [firstPartyUserId, setFirstPartyUserId] = useState('');

  const [showLoader, setShowLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');

const showLoaderWithMessage = () => {
  if (showLoader) {
    return <div><MessageComponentLoader loadingMessage={loaderMessage}/></div>; 
  }
}


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












  const [userInfo, setUserInfo] = useState();
  const [supportTickets, setSupportTickets] = useState();
  const [openedSupportTicket, setOpenedSupportTicket] = useState();
  const [supportTicketMessages, setSupportTicketMessages] = useState();
  useEffect(() => {
    // If the userInfo already exists meaning the user was logged in
    // and they performed a refresh then get it from the local storage
    const storedUserInfo = localStorage.getItem("userInfo");
    const storedSupportTickets = localStorage.getItem("userSupportTickets");
    const storedOpenedSupportTicket = localStorage.getItem("openedSupportTicket");
    const storedSupportTicketMessages = localStorage.getItem('supportTicketMessages');

    console.log("SiteWrapper Getting storedUserInfo: ", storedUserInfo);

    if (storedUserInfo) {
      const decryptedUserInfo = decryptData(storedUserInfo); // get decrypted text
      console.log("SiteWrapper: ", decryptedUserInfo);
      setUserInfo(decryptedUserInfo);
    }

    if (storedSupportTickets) {
      setSupportTickets(JSON.parse(storedSupportTickets));
    }

    if (storedOpenedSupportTicket) {
      setOpenedSupportTicket(JSON.parse(storedOpenedSupportTicket));
    }

    if (storedSupportTicketMessages) {
      setSupportTicketMessages(JSON.parse(storedSupportTicketMessages));
    }

  }, []);

  function userIsAdmin() {
    let isAdmin = false;
    if(userInfo) {
      //@ts-ignore
      if (userInfo.userType == "admin" && userAuth) {
        isAdmin = true;
      }
    }

    return isAdmin;
  }













  const [editListingId, setEditListingId] = useState(null);
  useEffect(() => {
    const storedEditListingId = localStorage.getItem('storedEditListingId');
    console.log('SiteWrapper Getting storedEditListingId: ', storedEditListingId);

      setEditListingId(storedEditListingId);
  }, []);

  const [editListingDetails, setEditListingDetails] = useState(null);
  useEffect(() => {
    const storedEditListingDetails = localStorage.getItem('storedEditListingDetails');
    console.log('SiteWrapper Getting storedEditListingDetails: ', storedEditListingDetails);

    setEditListingDetails(storedEditListingDetails);
  }, []);

  /**
   * ---------------------------- Context for Listings --------------------------------
   */
  const [listing, setListing] = useState([]);

  // Ensure the listings are available and loaded from the storage
  // if the page is loaded
  useEffect(() => {
    const storedUserListings = localStorage.getItem('userListings');

    // console.log('SiteWrapper Getting storedUserListings: ', storedUserListings);

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


  /**
   * GET ALL USER LISTINGs
   */
  // useEffect(() => {
  //   // This delay allows the record to get inserted before we try to retrieve everything again.
  //   const delay = 100; // 100ms

  //   async function getUserListings(user) {
  //     if (!user) return;
      
  //     const { id: userProfileId, emailAddress } = user;

  //     try {
  //       const response = await fetch('/api/getUserListings', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ userProfileId, emailAddress }),
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch user listings');
  //       }

  //       const data = await response.json();

  //       setListing(data);
  //       localStorage.setItem('userListings', JSON.stringify(data));
  //       console.log('getUserListings:', data);
  //       return data;
  //     } catch (error) {
  //       console.error('Error fetching user listings:', error);
  //       throw error;
  //     }
  //   }

  //   // Ensure userInfo is available before calling the function
  //   if (userInfo) {
  //     const timeout = setTimeout(() => {
  //       getUserListings(userInfo);
  //     }, delay);

  //     // Cleanup timeout on component unmount or on dependency change
  //     return () => clearTimeout(timeout);
  //   }
  // }, [listingsCreated]);




  
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

const [booleanFilter, setBooleanFilter] = useState({
  privateBathroom: false,
  privateParking: false,
  publicParking: false,
  wheelChairAccessibility: false,
  internetConnection: false,
  washer: false,
  dryer: false,
  dishWasher: false,
  petFriendly: false,
  refrigerator: false,
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
});

// these are the filters used to search for a tenant
const [tenantFilters, setTenantFilters] = useState({
  typeOfPlace: [],
  minBudgetFilter: '',
  maxBudgetFilter: '',
  socialStatus: [],
  cleanlinessLevel: [],
  gender: [],
  minAge: 18,
  maxAge: 99,
  hasPet: [],
  isSmoker: false,
  isEmailVerified: false,
  isProfileVerified: false,
});

// this functions resets the filters used to search for a tenant
const resetAllTenantSearchFilters = () => {
  setTenantFilters({
    typeOfPlace: [],
    minBudgetFilter: '',
    maxBudgetFilter: '',
    socialStatus: [],
    cleanlinessLevel: [],
    gender: [],
    minAge: 18, 
    maxAge: 99,
    hasPet: [],
    isSmoker: false,
    isEmailVerified: false,
    isProfileVerified: false,
  });
};

// this functions resets the filters used to search for a listing
const resetAllListingSearchFilters = () => {
  console.log("The user clicked on Reset Filters button");
  // Set all states to false
  setBooleanFilter({
    privateBathroom: false,
    privateParking: false,
    publicParking: false,
    wheelChairAccessibility: false,
    internetConnection: false,
    washer: false,
    dryer: false,
    dishWasher: false,
    petFriendly: false,
    refrigerator: false,
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
  });

  setMoveInDate(null);
  setMinPriceFilter("");
  setMaxPriceFilter("");
};

  return (
    <SiteContext.Provider
      value={{
        isMobile,isTablet, PROFILE_PICTURE_S3_SUB_FOLDER, ID_DOCUMENT_S3_SUB_FOLDER, ID_DOCUMENT_SELFIE_S3_SUB_FOLDER,
        profiles, setProfiles, Bootstrap, scrollToTop, userAuth, setUserAuth, userInfo, setUserInfo, editListingId, setEditListingId, editListingDetails, setEditListingDetails,
        userIsAdmin, firebaseToken, setFirebaseToken, userAdmin, setUserAdmin, listing, setListing,
        userProfilePicture, setUserProfilePicture, userEmailVerified, setUserEmailVerified, isSearchClicked, setSearchClick,
        loading, setLoading, emailAddressToReset, setEmailAddressToReset, signUpEmail, setSignUpEmail,
        snackbarOpen, setSnackbarOpen, snackbarMessage, setSnackbarMessage, snackbarSeverity, setSnackbarSeverity,
        welcomeProfileSetupStep, setWelcomeProfileSetupStep, describePlaceWorkflow, setDescribePlaceWorkflow, prevProgress, setPrevProgress, nextProgress, setNextProgress,
        describeTenanteWorkflow, setDescribeTenanteWorkflow,  searchValue, setSearchValue, userSearchType, setUserSearchType, intendedDestination, setIntendedDestination,
        roomListingData, setRoomListingData, resetRoomListingData, listingsCreated, setListingsCreated, showListingCreatedAlert, setShowListingCreatedAlert,
        latitude, setLatitude, longitude, setLongitude, mapAddress, setMapAddress, badgeFilterShow, setBadgeFilterShow, minPriceFilter, setMinPriceFilter, maxPriceFilter, 
        setMaxPriceFilter, moveInDate, setMoveInDate, countEnabledSearchFilters, setCountEnabledSearchFilters, userVerificationStatus, setUserverificationStatus, 
        homepageRoommatesResults, setHomepageRoommatesResults, homepageRoomResults, setHomepageRoomResults, supportTicketMessages, setSupportTicketMessages,
        booleanFilter, setBooleanFilter, tenantFilters, setTenantFilters, resetAllTenantSearchFilters, resetAllListingSearchFilters,
        searchFilterModalMobileTextSize, searchFilterModalLargeScreenTextSize, searchResults, setSearchResults, priceSortDirection, setPriceSortDirection,
        listingCreatedDateSortDirection, setListingCreatedDateSortDirection, searchFilterType, setSearchFilterType, openedSupportTicket, setOpenedSupportTicket,
        chats, setChats, messages, setMessages, supportTicketsUpdate, setSupportTicketsUpdate, reply, setReply, supportTickets, setSupportTickets, setShowLoader, setLoaderMessage,
        conversationId, setConversationId, fullNameOfOpposingChat, setFullNameOfOpposingChat, conversationTopicUrl, setConversationTopicUrl, secondPartyUserId, setSecondPartyUserId, firstPartyUserId, setFirstPartyUserId,
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
