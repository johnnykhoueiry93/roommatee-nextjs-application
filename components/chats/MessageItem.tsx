

import '../../styles/MessageItem.css'
import { Avatar } from "@mui/material";
import { useEffect, useState } from 'react';
// import BackendAxios from "../../backend/BackendAxios";

//@ts-ignore
const MessageItem = ({message ,sentByUserFullName,messageDateSent,alignClass, sentByUserId}) => {
  const [messageAvatarUrl, setMessageAvatarUrl] = useState('');

  // Check if messageDateSent is not null before formatting
  const messageDateSentFormatted =
    messageDateSent && messageDateSent.toDate().toLocaleString();

    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const chatRecipientProfileId = sentByUserId;
    //       const key = `${chatRecipientProfileId}-profile-picture.png?folder=profile-picture`;
    //       // console.log('Checking if the key exists: ' + key);
    
    //       // Check if the URL already exists in localStorage
    //       //@ts-ignore
    //       let existingUrls = JSON.parse(localStorage.getItem('avatarUrls')) || [];
    //       //@ts-ignore
    //       const existingUrl = existingUrls.find(urlObj => urlObj.id === chatRecipientProfileId);
    
    //       // console.log('The value of existingUrl:', existingUrl);
    
    //       if (existingUrl) {
    //         // console.log("URL already exists in localStorage, skipping POST request");
    //         setMessageAvatarUrl(existingUrl.url); // Set the avatar source from localStorage
    //       } else {
    //         console.log("The URL was not found in localStorage, performing a POST request for key: " + key);
    //         // const response = await BackendAxios.post(`/getS3PictureUrl/${key}`);
    //         // console.log("Setting the user profile picture to URL: " + response.data.s3Url);
    //         // const newUrlObj = { id: chatRecipientProfileId, url: response.data.s3Url };
    //         // //@ts-ignore
    //         // existingUrls = existingUrls.filter(urlObj => urlObj.id !== chatRecipientProfileId); // Remove existing URL with the same ID
    //         // const updatedUrls = [newUrlObj, ...existingUrls];
    //         // localStorage.setItem('avatarUrls', JSON.stringify(updatedUrls));
    //         // setMessageAvatarUrl(response.data.s3Url); // Set the avatar source
    //       }
    //     } catch (error) {
    //       console.error("Error:", error);
    //     }
    //   };
    
    //   fetchData();
    // }, []); 


    return (
      <div className={`message-item ${alignClass}`} >
        
        <div className={`chat-bubble  ${alignClass} ${alignClass === 'left-align' ? 'chat-bubble-left' : 'chat-bubble-right'}`}>
          {/* <p className="chat-sent-by-author">{sentByUserFullName}</p> */}
          <p className="chat-message-item">{message}</p>
        </div>
    
        <div className="chat-timestamp">{messageDateSentFormatted}</div>
      </div>
    );
};

export default MessageItem;
