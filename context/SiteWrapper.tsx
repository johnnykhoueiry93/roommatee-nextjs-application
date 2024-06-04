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

// @ts-ignore
export const SiteWrapper = ({ children }) => {
  const [profiles, setProfiles] = useState("hello111");
  const [Bootstrap, setBootstrap] = useState(undefined);
  const [firebaseToken, setFirebaseToken] = useState();

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

  const [userAuth, setUserAuth] = useState(() => {
    const storedUserAuth = Cookies.get("userAuth");
    return storedUserAuth ? JSON.parse(storedUserAuth) : false;
  });

  // This use effect is monitoring the state of userAuth so if someone logs out
  // it will set it to false. Without it the state change will not be reflected.
  useEffect(() => {
    Cookies.set("userAuth", JSON.stringify(userAuth), { expires: 1 / 8 }); // 3 hours expiration
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




  // useEffect(() => {
  //   if(userAuth) {
  //     localStorage.setItem('userInfo', encryptData(userInfo));
  //     // localStorage.setItem('userProfilePicture', JSON.stringify(userProfilePicture));
  //     // localStorage.setItem('userSupportTickets', JSON.stringify(supportTickets));
  //     // localStorage.setItem('storedOpenedSupportTicket', JSON.stringify(openedSupportTicket));
  //     // localStorage.setItem('storedSupportTicketMessages', JSON.stringify(supportTicketMessages));
  //     // if(userInfo[0].userType == "admin") {
  //     //   setUserAdmin(true);
  //     // }

  //   } 
  // }, [userInfo, userAuth]); // add userProfilePicture















  return (
    <SiteContext.Provider
      value={{
        profiles,
        setProfiles,
        Bootstrap,
        userAuth,
        setUserAuth,
        userInfo,
        setUserInfo,
        userIsAdmin,
        firebaseToken,
        setFirebaseToken,
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
