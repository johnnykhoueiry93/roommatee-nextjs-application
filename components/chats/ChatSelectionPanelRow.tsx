import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import React from "react";
import "../../styles/ChatSelectionPanelRow.css";
import { useRouter } from 'next/navigation';

import { SiteData } from "../../context/SiteWrapper";
import { useEffect, useState } from "react";
// import BackendAxios from "../../backend/BackendAxios";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

//@ts-ignore
const ChatSelectionPanelRow = ({chat,setActiveConversation,activeConversation}) => {
  // @ts-ignore
  const { userInfo, setConversationId, setFullNameOfOpposingChat, isMobile, isTablet, setConversationTopicUrl, setSecondPartyUserId, setFirstPartyUserId } = SiteData();
  const [recipientAvatarImgSource, setRecipientAvatarImgSource] = useState(""); // State to manage the avatar source
  const router = useRouter();
const navigateToPage = (path) => {
  router.push(path);
};
  let nameToDisplay = "";
  let topicUrl;

  //@ts-ignore
  const getNamesOfUsersWithOpenConversations = (chat) => {
    if (userInfo.id === chat.firstPartyUserId) {
      nameToDisplay = chat.secondPartyFullName;
    } else {
      nameToDisplay = chat.firstPartyFullName;
    }

    return nameToDisplay;
  };

  //@ts-ignore
  const getChatDocument = async (firstPartyUserId, secondPartyUserId) => {
    const firestore = getFirestore();
    const chatsRef = collection(firestore, "chats");

    const q = query(
      chatsRef,
      where("firstPartyUserId", "==", firstPartyUserId),
      where("secondPartyUserId", "==", secondPartyUserId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming there is only one matching document, return it
      const chatDocument = querySnapshot.docs[0]; // Access the first document
      return { id: chatDocument.id, ...chatDocument.data() };
    } else {
      // No matching document found
      return null;
    }
  };

  /**
   * In this function once the user clicks on the chat row in the chat selection panel
   * We are getting the chat id also know as the document id
   * This documnet ID will be sent to the useContext and fetched by the conversation panel
   * to display the proper chat.
   * Since sometimes the current logged in user can either be the firstPartyUserId or secondPartyUserId
   * what we're doing is getting the chat ID by order of first then second. If the chats returned null
   * we flip them and get by the order of second then first
   *
   */
  //@ts-ignore
  const handleConversationOnClick = async (chat) => {
    setFullNameOfOpposingChat(getNamesOfUsersWithOpenConversations(chat));

    let availableChat = await getChatDocument(
      chat.firstPartyUserId,
      chat.secondPartyUserId,
    );

    if (availableChat) {
      console.log("Found availableChat:", availableChat.id);
      setConversationId(availableChat.id);
      setActiveConversation(availableChat.id);
      //@ts-ignore
      setFirstPartyUserId(availableChat.firstPartyUserId); // this value is being used in the ConversationPanel.tsx
      //@ts-ignore
      localStorage.setItem('firstPartyUserId', availableChat.firstPartyUserId);
      //@ts-ignore
      setSecondPartyUserId(availableChat.secondPartyUserId); // this value is being used in the ConversationPanel.tsx
      //@ts-ignore
      localStorage.setItem('secondPartyUserId', availableChat.secondPartyUserId);
      //@ts-ignore
      setConversationTopicUrl(availableChat.topicUrl);


    } else {
      availableChat = await getChatDocument(
        chat.secondPartyUserId,
        chat.firstPartyUserId
      );

      if (availableChat) {
        console.log("Found availableChat:", availableChat.id);
        setConversationId(availableChat.id);
        setActiveConversation(availableChat.id);
      } else {
        console.log("Chat was not found");
      }
    }

    if(isMobile || isTablet) {
      navigateToPage("/mobileConversationPanel");
    }
  };

  function getChatRecipientUserId() {

    if (userInfo.id === chat.firstPartyUserId) {
      return chat.secondPartyUserId;
    } else {
      return chat.firstPartyUserId;
    }
  }

      useEffect(() => {
        const fetchData = async () => {
          try {
            const chatRecipientProfileId = getChatRecipientUserId();
            const key = `${chatRecipientProfileId}-profile-picture.png?folder=profile-picture`;
            // console.log('Checking if the key exists: ' + key);
      
            // Check if the URL already exists in localStorage
            //@ts-ignore
            let existingUrls = JSON.parse(localStorage.getItem('avatarUrls')) || [];
            //@ts-ignore
            const existingUrl = existingUrls.find(urlObj => urlObj.id === chatRecipientProfileId);
      
            // console.log('The value of existingUrl:', existingUrl);
      
            if (existingUrl) {
              // console.log("URL already exists in localStorage, skipping POST request");
              setRecipientAvatarImgSource(existingUrl.url); // Set the avatar source from localStorage
            } else {
              console.log("The URL was not found in localStorage, performing a POST request for key: " + key);
              // const response = await BackendAxios.post(`/getS3PictureUrl/${key}`);
              // // console.log("Setting the user profile picture to URL: " + response.data.s3Url);
              // const newUrlObj = { id: chatRecipientProfileId, url: response.data.s3Url };
              // //@ts-ignore
              // existingUrls = existingUrls.filter(urlObj => urlObj.id !== chatRecipientProfileId); // Remove existing URL with the same ID
              // const updatedUrls = [newUrlObj, ...existingUrls];
              // localStorage.setItem('avatarUrls', JSON.stringify(updatedUrls));
              // setRecipientAvatarImgSource(response.data.s3Url); // Set the avatar source
            }
          } catch (error) {
            console.error("Error:", error);
          }
        };
      
        fetchData();
      }, []); // Empty dependency array to run the effect only once

      
  return (
    <div
      className={` row-container ${ activeConversation === chat.id ? "active-selection-class" : "" }`}
      onClick={() => handleConversationOnClick(chat)}
    >
      <div className="chat-selection-row">
        <Avatar
          alt={chat.nameToDisplay}
          src={recipientAvatarImgSource}
        />
        <span className="chat-selection-row-full-name">
          {getNamesOfUsersWithOpenConversations(chat)}
        </span>

        {chat.isProfileVerified === 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "10px",
            }}
          >
          </div>
        )}
        
      </div>
      <hr />
    </div>
  );
};

export default ChatSelectionPanelRow;
