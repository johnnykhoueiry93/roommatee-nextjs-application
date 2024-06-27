"use client";

import { SiteData } from "../../context/SiteWrapper";
import ChatSelectionPanel from "./ChatSelectionPanel";
import ConversationPanel from "./ConversationPanel";
import "../../styles/Chat.css";
import React, { useEffect, useState } from "react";
import MessageComponentLoader from "../loaders/MessageComponentLoader";

const Chat = () => {
  //@ts-ignore
  const { userInfo, isMobile, isTablet } = SiteData();

  if(!userInfo) {
    return (<div><MessageComponentLoader loadingMessage={"Loading chats..."}/></div>)
  }

  function returnConversationPanel() {
    if (!isMobile && !isTablet) {
      return (
        <div id="conversationPanelId" className="col-8" >
          <ConversationPanel />
        </div>
      );
    }
  }
  const [navBar, setNavBar] = useState(null);
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    // This code runs only on the client side
    if (typeof document !== 'undefined') {
      const navBarElement = document.getElementById('topNavBarId');
      setNavBar(navBarElement);
    }
     // This code runs only on the client side
     const updateScreenHeight = () => {
      setScreenHeight(window.innerHeight);
    };

    // Set the initial height
    updateScreenHeight();

    // Add a resize event listener to update the height on window resize
    window.addEventListener('resize', updateScreenHeight);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateScreenHeight);
    };
    
  }, []);

  function calculateContainerHeight() {
    // const navBar = document.getElementById('topNavBarId'); // Replace 'yourNavBarId' with the actual ID of your navigation bar
    // const screenHeight = window.innerHeight;
    const navBarHeight = navBar ? navBar.offsetHeight : 0;
    let containerHeight = screenHeight - navBarHeight;
    // console.log('Returning chat screen height: ' + containerHeight);

    return containerHeight;
  }
  
  const containerHeight = calculateContainerHeight();

  return (
    // <div className={isMobile || isTablet ? "" : ""} style={{ height: `${containerHeight}px` }}>
      <div className={`row g-0 ${isMobile || isTablet ? "" : "chat-container"}`} >
        
        <div className="col-12 col-lg-4 " >
          <ChatSelectionPanel />
        </div>

        {returnConversationPanel()}

      </div>
  );
};

export default Chat;
