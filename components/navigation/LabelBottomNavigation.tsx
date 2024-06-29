"use client";

import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { SiteData } from "../../context/SiteWrapper";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';
import SettingsIcon from '@mui/icons-material/Settings';

export default function LabelBottomNavigation() {
  //@ts-ignore
  const { userAuth, userInfo, isMobile, isTablet } = SiteData();
  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };

  const [value, setValue] = React.useState("recents");

  //@ts-ignore
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let isProfileComplete = false;
 // Check if userInfo is not null or undefined
if (userInfo) {
  if (userInfo.isProfileComplete === 1) {
    isProfileComplete = true;
  }
}

  const iconStyle = {
    fontSize: 28, // Adjust the size as needed
    color: "var(--roomatee-theme-color)", // Change the color to your desired color
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const stickyBar = document.querySelector(".sticky-bar");
      const windowHeight = window.innerHeight;
      const contentHeight = document.body.scrollHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
  
      if(stickyBar) {
        if (scrollTop + windowHeight >= contentHeight) {
          //@ts-ignore
          stickyBar.style.position = "fixed";
          //@ts-ignore
          stickyBar.style.bottom = "0";
        } else {
          //@ts-ignore
          stickyBar.style.position = "fixed";
          //@ts-ignore
          stickyBar.style.bottom = "0";
        }
      }

    };
  
    // Call handleScroll initially to set the position
    handleScroll();
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogoClick = () => {
    console.log("The user clicked on the logo");
    navigateToPage("/");
    // Scroll to top using window.scrollTo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function showBottomNavigation() {
    return userAuth && (isMobile || isTablet) ;
  }

  return (
    <div id='bottomNavigationBarId'>
      {showBottomNavigation() && (
        isProfileComplete ? (
        <BottomNavigation
          id="mobileBottomNavigation"
          sx={{ width: "100%" , height: '6%'}}
          value={value}
          onChange={handleChange}
          className="sticky-bar"
        >
          <BottomNavigationAction
            label="Home"
            value="home"
            icon={<HomeIcon style={iconStyle}/>}
            onClick={handleLogoClick}
            
          />
          <BottomNavigationAction
            label="Support"
            value="support"
            icon={<ContactSupportIcon style={iconStyle}/>}
            onClick={() => navigateToPage("/support")}
          />
          <BottomNavigationAction
            label="Settings"
            value="Settings"
            icon={<SettingsIcon style={iconStyle}/>}
            onClick={() => navigateToPage("/profile")}
          />
          <BottomNavigationAction
            label="Chat"
            value="chat"
            icon={<ChatBubbleIcon style={iconStyle}/>}
            onClick={() => navigateToPage("/chats")}
          />
        </BottomNavigation>) : null
        
      ) }
    </div>
  );
}
