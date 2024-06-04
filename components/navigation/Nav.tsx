"use client";

import React, { useState } from "react";
import Link from 'next/link'
import { SiteData } from "../../context/SiteWrapper";
import '../../styles/Nav.css'
import Image from "next/image";
import { useEffect } from "react";
import { Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import Badge from '@mui/material/Badge';
import { encryptData, decryptData } from '../../utils/encryptionUtils';
import Cookies from 'js-cookie';
import NavigationItem from "./NavigationItem";

const Nav = () => {
    //@ts-ignore
   // @ts-ignore
   const { userIsAdmin, userAuth, setUserAuth, resetSearchValue , isMobile, setIntendedDestination, userInfo,  setSearchClick, userProfilePicture  } = SiteData();
   const [hasScrolled, setHasScrolled] = useState(false);
   const [badgeCount, setBadgeCount] = useState(0);
   const [activeTab, setActiveTab] = useState('Home');

 
  
useEffect(() => {
  if(userAuth) {
    console.log('Setting the userInfo')
    console.log('Badge Count: ' + badgeCount);
    // localStorage.setItem('userInfo', encryptData(userInfo)); // encrypted userInfo
    // localStorage.setItem('userProfilePicture', JSON.stringify(userProfilePicture));

    // if(userInfo[0].isProfilePictureUploaded == "0") {
    //   setBadgeCount(prevCount => prevCount + 1);
    //   console.log('My profile badge counter increased because profile picture was not found');
    //   console.log('Badge Count #1: ' + badgeCount);
    // }
    // if(userInfo[0].idDocument == "0") {
    //   setBadgeCount(prevCount => prevCount + 1);
    //   console.log('My profile badge counter increased because id document was not uploaded');
    //   console.log('Badge Count #2: ' + badgeCount);
    // }
    // if(userInfo[0].idDocumentSelfie == "0") {
    //   setBadgeCount(prevCount => prevCount + 1);
    //   console.log('My profile badge counter increased because id document selfie was not uploaded');
    //   console.log('Badge Count #3: ' + badgeCount);
    // }
  } else {
    // localStorage.clear(); // This clears all items in local storage
  }
}, [userInfo, userProfilePicture, userAuth]);


const handleLogoClick = () => {
    console.log("The user clicked on the logo");
    // navigate("/");
    // setSearchClick(false);
    // Scroll to top using window.scrollTo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function getLogoWidth() {
    let logoWidth;
    logoWidth = '130';
    if(isMobile) {
      logoWidth = '85';
    }

    return logoWidth;
  }

  function returnApplicationLogo() {
    return (
      <div>
        <Link href="/" onClick={handleLogoClick} className="ml-2">
          <Image
            src="/images/logo.png"
            alt="Roomatee Logo"
            height="60"
            width={getLogoWidth()}
          />
        </Link>
      </div>
    );
  }

const iconStyle = {
    fontSize: 35, // Adjust the size as needed
    color: 'red', // Change the color to your desired color
  };

  const navBarInternalIcons = {
    fontSize: 25, // Adjust the size as needed
    color: "var(--roomatee-theme-color)", // Change the color to your desired color
  };

const navigateToChangePasswordPage = () => {
    console.log("The user clicked on the change password button from the navigation bar");
    // navigate("/changePassword");
  };

  const navigateToSupportPage = () => {
    console.log("The user clicked on the support button from the navigation bar");
    // navigate("/support");
  };

    // @ts-ignore
    const logout = (e) => {
        e.preventDefault();
        console.log("The user clicked on the logout button");
        setUserAuth(false);
        // setIntendedDestination("/")
        // setUserProfilePicture('0');
        Cookies.remove('userInfo');
        Cookies.remove('userProfilePicture');
        localStorage.clear(); // This clears all items in local storage
        // navigate("/");
        // setSearchClick(false);
        // resetSearchValue();
      };

      const handleLoginClick = () => {
        console.log("The user clicked on the Login button");
        // navigate("/login");
      };

      const handleNavBarBurgerButtonOnClick = () => {
        console.log("The user clicked on the logo");
      };

        //@ts-ignore
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

      useEffect(() => {
        const handleScroll = () => {
          const position = window.scrollY;
          if (position > 0) {
            setHasScrolled(true);
          } else {
            setHasScrolled(false);
          }
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);

      function returnRegularUserMenu() {
        return (
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {/* MENU ITEM 1 */}
          <NavigationItem label="Home" activeTab={activeTab} handleTabClick={handleTabClick} path="/" setSearchClick={setSearchClick}>Home</NavigationItem>
    
          {/* MENU ITEM 2 */}
          <NavigationItem label="My Listings" activeTab={activeTab} handleTabClick={handleTabClick} path="/listings" setSearchClick={setSearchClick}>My Listings</NavigationItem>
    
          {/* MENU ITEM 3 */}
          <NavigationItem label="My Chats" activeTab={activeTab} handleTabClick={handleTabClick} path="/chats" setSearchClick={setSearchClick}>My Chats</NavigationItem>
    
          {/* MENU ITEM 4 */}
          <Badge
          color="primary"
          variant="dot"
          invisible={badgeCount === 0}
        >
          <NavigationItem
            label="My Profile"
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            path="/myProfile"
            setSearchClick={setSearchClick}
          >
            My Profile
          </NavigationItem>
        </Badge>
        </ul>
        )
      }

      function returnAdminUserMenu() {
        return (
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {/* MENU ITEM 1 */}
          <NavigationItem label="Home" activeTab={activeTab} handleTabClick={handleTabClick} path="/" setSearchClick={setSearchClick}>Home</NavigationItem>
    
          {/* MENU ITEM 2 */}
          <NavigationItem label="ALL Listings" activeTab={activeTab} handleTabClick={handleTabClick} path="/listings" setSearchClick={setSearchClick}>ALL Listings</NavigationItem>
    
          {/* MENU ITEM 3 */}
          <NavigationItem label="ALL Chats" activeTab={activeTab} handleTabClick={handleTabClick} path="/chats" setSearchClick={setSearchClick}>ALL Chats</NavigationItem>
    
          {/* MENU ITEM 4 */}
          <NavigationItem label="ALL Profile" activeTab={activeTab} handleTabClick={handleTabClick} path="/myProfile" setSearchClick={setSearchClick}>ALL Profile</NavigationItem>
        </ul>
        )
      }

      const [isHydrated, setIsHydrated] = useState(false);

      useEffect(() => {
        setIsHydrated(true);
      }, []);

      
      if (!isHydrated) {
        return <div>Loading...</div>; //TODO update to something better!!
      }

      function returnMenuBasedOnUserType() {
        if (userIsAdmin()) {
          return returnAdminUserMenu();
        } else {
          return returnRegularUserMenu();
        }
      }
      

if (userAuth) {
    return (
      <nav id="topNavBarId"
        className={`navbar navbar-expand-lg navbar-light bg-light sticky-top ${ hasScrolled ? "shadow opacity" : "" }  `   }  // if you want a border for the nav add this in the classnName above ==> nav-basic-border
      >


      {/* { userInfo[0].isProfileComplete == 1  && */}
        <div className="container-fluid">
        {/* -------------------------- HOME BUTTON LOGO --------------------------*/}
        {returnApplicationLogo()}
        
        <button
          className="navbar-toggler toggle-btn mr-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={handleNavBarBurgerButtonOnClick}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* HOME BUTTON NO LOGO */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">

           {returnMenuBasedOnUserType()}
          
          {/* DROP DOWN IF LOGGED IN */}
          <div className={`d-flex isMobile ? mr-2 : ml-2`}>
            <Avatar
              alt={'test'}
              // alt={userInfo[0].firstName}
              // src={userProfilePicture}
            />
            <div className="btn-group">

              {userInfo && (
                <button
                  type="button"
                  className="btn  dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => console.log("The user clicked on his name")}
                >
                  
                  {userInfo.firstName} {userInfo.lastName}
                </button>
               )}  

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                <a className="dropdown-item">
                    <Link href="/changePassword" onClick={navigateToChangePasswordPage} style={{ textDecoration: 'none' , color: 'black', fontSize: '16px'}}>
                      <KeyboardIcon style={navBarInternalIcons} /> Change Password
                    </Link>
                  </a>
                </li>
                
                <li>
                  <a className="dropdown-item">
                    <Link href="/support" onClick={navigateToSupportPage} style={{ textDecoration: 'none' , color: 'black', fontSize: '16px'}}>
                      <SupportAgentIcon style={navBarInternalIcons} /> Support
                    </Link>
                  </a>
                </li>
                <hr/>
                <li onClick={logout}>
                <a className="dropdown-item">
                  <Link href="/" onClick={logout} style={{ textDecoration: 'none' , color: 'black', fontSize: '16px'}}>
                    <LogoutIcon style={navBarInternalIcons}/> Logout
                  </Link>
                </a>
              </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
        {/* } */}
        
      </nav>
    );
  } 
  
  
  else {
    return (

      <nav className={`navbar navbar-expand-lg navbar-light bg-light sticky-top ${ hasScrolled ? "shadow opacity" : "" }`} >
        
        <div className="container-fluid">
          {/* -------------------------- HOME BUTTON LOGO --------------------------*/}
          {returnApplicationLogo()}

          <button
            className="navbar-toggler mr-2"
            type="button"
            data-bs-toggle="collapse"
            // data-target="#navbarSupportedContent"// bootrap 4
            data-bs-target="#navbarSupportedContent" // bootrap
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={handleNavBarBurgerButtonOnClick}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* HOME BUTTON NO LOGO */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#"></a>
              </li>
            </ul>

            <Link href="/login">
            <div className="d-flex nav-item" onClick={handleLoginClick}>
              <div className="btn-group nav-login-btn"> 
                <span><PersonOutlineIcon style={iconStyle}/> Log in</span>
               </div>
            </div> 
            </Link>
          </div>
        </div>


       
      </nav>
    );
  }
};


export default Nav;
