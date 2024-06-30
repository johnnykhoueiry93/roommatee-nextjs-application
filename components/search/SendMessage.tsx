import TextField from "@mui/material/TextField";
import { useState } from "react";
import Button from "@mui/material/Button";
import { SiteData } from "../../context/SiteWrapper";
import { useRouter } from 'next/navigation';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CircularProgress from "@mui/material/CircularProgress";
import FirebaseChats from '../FirebaseChats'
import React from "react";
import StaticFrontendLabel from "../../StaticFrontend";

import "../../styles/SendMessage.css";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";

//@ts-ignore
const SendMessage = ({ selectedCardDetails, targetUserId, cardId, topicUrl }) => {
  //@ts-ignore
  const { isMobile, isTablet, userInfo } = SiteData();
  const { app, firestore, useChats, firebaseConfig } = FirebaseChats({ userId: userInfo.id });
  const chatId = `${userInfo.id}-${targetUserId}-${cardId}`;
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };
  const [chats, error] = useChats();
  const NEW_CHAT_MESSAGE_MAX_LENGTH = StaticFrontendLabel.NEW_CHAT_MESSAGE_MAX_LENGTH;

  //@ts-ignore
  let firstPartyFullName, secondPartyFullName, concatChatId;

  /**
   * This function is checking if the current user has an open
   * conversation with the current user where the Search Result Card Details is open
   * We dont want the user to be able to send another message from here, since a conversation already
   * exists
   * If true is returned then a conversation already exists should directly snd them to /chat
   * If no conversation exist, allow the user to send the first message
   */
  
  const checkIfConversationAlreadyExists = () => {
    const filteredChats =
      chats &&
      userInfo &&
      chats.filter(
        (chat) =>
          chat?.firstPartyUserId === targetUserId ||
          chat?.secondPartyUserId === targetUserId
      );
  
    return filteredChats && filteredChats.length > 0;
  };

  const sendMessage = async () => {
    console.log("The user clicked on button Send Message from Message Box.");

    const messagesRef = collection(firestore, "chats", chatId, "messages");
    firstPartyFullName = userInfo.firstName + " " + userInfo.lastName;
    secondPartyFullName = selectedCardDetails.firstName + " " + selectedCardDetails.lastName;
    concatChatId = userInfo.id + "-" + targetUserId + "-" + cardId;
    topicUrl = topicUrl;

    // Set loading to true when starting to send the message
    setLoading(true);

    if (message.trim() !== "") {
      try {
        await addDoc(messagesRef, {
          message: message,
          messageDateSent: serverTimestamp(),
          sentByUserId: userInfo.id,
          firstPartyFullName: firstPartyFullName,
          topicUrl: topicUrl,
        });

        // chats is the collection
        // chatId is the ID of that chat
        const chatDocRef = doc(firestore, "chats", chatId);
        await setDoc(
          chatDocRef,
          {
            chatStartDate: serverTimestamp(),
            firstPartyUserId: userInfo.id, // for the sender
            firstPartyFullName: firstPartyFullName, // for the sender
            isProfileVerified: userInfo.isProfileVerified, // for the sender
            secondPartyUserId: targetUserId,
            secondPartyFullName: secondPartyFullName,
            listingId: selectedCardDetails.id,
            id: concatChatId,
            topicUrl: topicUrl,
          },
          { merge: true }
        );

        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
        if(isMobile || isTablet) {
          navigateToPage("/m-chat-select");
        } else {
          navigateToPage("/chats");
        }
      }
    }
  };

  const iconStyle = {
    fontSize: 20, // Adjust the size as needed
    color: 'var(--roomatee-theme-color)', // Change the color to your desired color
  };

  function handleUserClickTakeMeToExistingChat() {
    console.log('The user clicked on the button Take me to Chat')
    navigateToPage('/chats')
  }
  
  const remainingCharacters = NEW_CHAT_MESSAGE_MAX_LENGTH - message.length;

  return (
    <div style={{width: '100%'}}>
      {checkIfConversationAlreadyExists() ? (
        <div className='mobile-formatting' onClick={() => handleUserClickTakeMeToExistingChat()}>
          <p style={{textAlign: 'center'}} >A conversation is already open with {selectedCardDetails.firstName}</p>
          <p className='link-as-button-format' style={{width: '50%',margin: 'auto', textAlign: 'center'}}>Take me to Chat <ArrowForwardIosIcon style={iconStyle}/></p>
        </div>
      ) : (
        <>
          {/* ------------------------ Message ------------------------ */}
          <div className={`${isMobile ? "mobile-top-padding" : ""}`} >

          <label className='remaining-characters-style'>Remaining Characters: {remainingCharacters}</label>
            <TextField
              required
              id="outlined-multiline-flexible"
              label="Write a message"
              inputProps={{
                maxLength: NEW_CHAT_MESSAGE_MAX_LENGTH,
                style: { height: "150px" },
              }}
              multiline
              maxRows={4}
              placeholder="Your Message"
              variant="outlined"
              className="input-width"
              style={{ width: "100%" }}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div>
            <Button
              autoFocus
              onClick={sendMessage}
              disabled={loading || message.trim() === ""}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                `Send Message to ${selectedCardDetails.firstName}`
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
  
};

export default SendMessage;
