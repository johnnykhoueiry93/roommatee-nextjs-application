"use client";

import { SiteData } from "../../context/SiteWrapper";
import ChatSelectionPanel from "./ChatSelectionPanel";
import ConversationPanel from "./ConversationPanel";
import "../../styles/Chat.css";
import React from "react";

const Chat = () => {
  //@ts-ignore
  const { isMobile, isTablet } = SiteData();

  function returnConversationPanel() {
    if (!isMobile && !isTablet) {
      return (
        <div id="conversationPanelId" className="col-8" >
          <ConversationPanel />
        </div>
      );
    }
  }

  function calculateContainerHeight() {
    const navBar = document.getElementById('topNavBarId'); // Replace 'yourNavBarId' with the actual ID of your navigation bar
    const screenHeight = window.innerHeight;
    const navBarHeight = navBar ? navBar.offsetHeight : 0;
    let containerHeight = screenHeight - navBarHeight;
    console.log('Returning chat screen height: ' + containerHeight);

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
