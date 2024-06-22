"use client";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { Avatar } from "@mui/material";
import { getFirestore, collection } from "firebase/firestore";
import { useEffect } from "react";
import { SiteData } from "../../context/SiteWrapper";
import ChatSelectionPanelRow from "./ChatSelectionPanelRow";
import "../../styles/ChatSelectionPanel.css";
import { useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import FirebaseChats from '../FirebaseChats'
import React from "react";

const ChatSelectionPanel = () => {
  // @ts-ignore
  const { userInfo, userProfilePicture } = SiteData();

  if(!userInfo) {
    return (<div>Loading .....</div>)
  }
  
  const { useChats } = FirebaseChats({ userId: userInfo.id });
  const [searchValue, setSearchValue] = useState("");
  const [activeConversation, setActiveConversation] = useState("");
   const [chats, error] = useChats();

  //@ts-ignore
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  console.log('userInfo -->' , userInfo);
  const filteredChats =
  chats &&
  userInfo &&
  userInfo.id && // Ensure userInfo.id is not undefined
  chats.filter(
    (chat) =>
      chat?.firstPartyUserId === userInfo.id ||
      chat?.secondPartyUserId === userInfo.id
  );


  const filteredChatsBySearch =
    searchValue === ""
      ? filteredChats
      : filteredChats?.filter(
          //@ts-ignore
          (chat) =>
            // Customize this condition based on your search criteria
            chat?.firstPartyFullName
              .toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            chat?.secondPartyFullName
              .toLowerCase()
              .includes(searchValue.toLowerCase())
        );

  const iconStyle = {
    fontSize: 24,
    color: 'var(--roomatee-theme-color)',
  };

  /**
   * This function is returning the entire container height where both left and right sections
   * live from top to bottom
   * The logic works by calculating the height of the screen size - the nav bar
   */
  function calculateContainerHeight() {
    const navBar = document.getElementById('topNavBarId'); // Replace 'yourNavBarId' with the actual ID of your navigation bar
    const screenHeight = window.innerHeight;
    const navBarHeight = navBar ? navBar.offsetHeight : 0;
    let containerHeight = screenHeight - navBarHeight;
    // console.log('Returning chat screen height: ' + containerHeight);

    return containerHeight;
  }

  function calculateContainerHeightFunc2() {
    const headerAvatarSearchSectionDivId = document.getElementById('headerAvatarSearchSectionDivId');
    let containerHeight = calculateContainerHeight();
    const tempDivHeight = headerAvatarSearchSectionDivId ? headerAvatarSearchSectionDivId.offsetHeight : 0;
    let chatSelectionDiv = containerHeight - tempDivHeight - 30;
    // console.log('Returning chat screen height: ' + containerHeight);

    return chatSelectionDiv;
  }
  
  let overFlowHeight = calculateContainerHeightFunc2();


  // Render your component with the retrieved chats
  return (
    <div>
      <div id='headerAvatarSearchSectionDivId'>
      {/* ------------------------------- CURRENT PROFILE INFO AND VERIFICATION ICON  ------------------------------- */}
      <div className="chat-selection-panle-current-user-profile">
        <Avatar
          alt={userInfo.firstName + " " + userInfo.lastName}
          src={userProfilePicture}
        />
        <span className="chat-selection-row-full-name">
          {userInfo.firstName + " " + userInfo.lastName}
        </span>

        {userInfo.isProfileVerified === 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "10px",
            }}
          >
            <VerifiedIcon style={iconStyle} />
          </div>
        )}
      </div>

      {/* ------------------------------- CONVERSATION SEARCH INPUT ------------------------------- */}

      <div className="input-group mb-3 conversation-search-input">
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Search..."
          aria-label="Search..."
          aria-describedby="basic-addon2"
          onChange={handleInputChange}
          value={searchValue}
        />
      </div>
      <p className="channels-label">CHANNELS</p>
      </div>


      <div className='chat-selection-panel-overflow'  style={{ height: `${overFlowHeight}px`}} >
        <div>
          {filteredChatsBySearch && //@ts-ignore
            filteredChatsBySearch.map((chat) => (
              <ChatSelectionPanelRow
                key={chat.id}
                chat={chat}
                setActiveConversation={setActiveConversation}
                activeConversation={activeConversation}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSelectionPanel;
