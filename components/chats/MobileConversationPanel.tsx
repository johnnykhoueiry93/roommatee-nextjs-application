import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState, useEffect, useRef } from "react";
import { SiteData } from "../../context/SiteWrapper";
import "../../styles/MobileConversationPanel.css";
import SendIcon from "@mui/icons-material/Send";
import MessageItem from "./MessageItem";
import FirebaseChats from '../FirebaseChats'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Avatar } from "@mui/material";
// import BackendAxios from "../../backend/BackendAxios";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReportUser from "../modals/ReportUser";
import SnackBarAlert from "../alerts/SnackBarAlerts";
import StaticFrontendLabel from "../../StaticFrontend";

const options = [
  'Report',
];

const ITEM_HEIGHT = 48;

const MobileConversationPanel = () => {
  // @ts-ignore
  const { userInfo, conversationId, fullNameOfOpposingChat, isMobile, isTablet, conversationTopicUrl, firstPartyUserId, secondPartyUserId, snackbarOpen, setSnackbarOpen, snackbarMessage, snackbarSeverity } = SiteData();
  const [ showReportUserPopup, setShowReportUserPopup ] = useState(false);
  const [message, setMessage] = useState("");
  const { firestore } = FirebaseChats({ userId: userInfo[0]?.id });
  let navigate = useNavigate();
  const NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH = StaticFrontendLabel.NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [hasScrolled, setHasScrolled] = useState(false);

  //@ts-ignore
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  //@ts-ignore
  const reportUserAndClose = () => {
    console.log('The user is reporting a user')
    setShowReportUserPopup(true);

    
    setAnchorEl(null);
  };

  // THIS CODE HERE IS RESPONSIBLE FOR CHANGING THE CONVERSATION
  // BY GETTING A NEW CHAT ID (document id) COMING FROM THE
  // USER ON ROW CLICK
  const chatId = conversationId || "default-chat-id"; // Use a default value if conversationId is undefined

  const messagesRef = collection(firestore, "chats", chatId, "messages");
  // const q = query(messagesRef, orderBy("messageDateSent"), limit(50));
  const q = query(messagesRef, orderBy("messageDateSent"));
  const userFullName = userInfo[0].firstName + " " + userInfo[0].lastName;
  //@ts-ignore
  const [messages] = useCollectionData(q, { idField: "id" });
  const [messageAvatarUrl, setMessageAvatarUrl] = useState('');
  
  const sendMessage = async () => {
    if (message.trim() !== "") {
      await addDoc(messagesRef, {
        message: message,
        messageDateSent: serverTimestamp(),
        sentByUserId: userInfo[0].id,
        sentByUserFullName: userFullName,
      });

      setMessage("");
    }
  };

  function getOppositonUserId() {
    let idValueToReturn;

    if(userInfo[0] == firstPartyUserId) {
      idValueToReturn = firstPartyUserId; 
    } else {
      idValueToReturn = secondPartyUserId;
    }

    return idValueToReturn;
  }

  useEffect(() => {
    // console.log('Scrolling to bottom of the chat screen')
    window.scrollTo(0, document.body.scrollHeight);
  });

  function displayBackButtonForMobile() {
    if(isMobile || isTablet) {
      return (
        <div className='mr-3 pt-2'>
        <ArrowBackIosNewIcon onClick={()=> {navigate("/chatSelectionPanel")}}/>
        </div>
      )
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatRecipientProfileId = getOppositonUserId();

        const key = `${chatRecipientProfileId}-profile-picture.png?folder=profile-picture`;
        // console.log('Checking if the key exists: ' + key);
  
        // Check if the URL already exists in localStorage
        //@ts-ignore
        let existingUrls = JSON.parse(localStorage.getItem('avatarUrls')) || [];
        //@ts-ignore
        const existingUrl = existingUrls.find(urlObj => urlObj.id === chatRecipientProfileId);
  
        // console.log('The value of existingUrl:', existingUrl);
  
        if (existingUrl) {
          console.log("URL already exists in localStorage, skipping POST request");
          setMessageAvatarUrl(existingUrl.url); // Set the avatar source from localStorage
        } else {
          console.log("The URL was not found in localStorage, performing a POST request for key: " + key);
          // const response = await BackendAxios.post(`/getS3PictureUrl/${key}`);
          // // console.log("Setting the user profile picture to URL: " + response.data.s3Url);
          // const newUrlObj = { id: chatRecipientProfileId, url: response.data.s3Url };
          // //@ts-ignore
          // existingUrls = existingUrls.filter(urlObj => urlObj.id !== chatRecipientProfileId); // Remove existing URL with the same ID
          // const updatedUrls = [newUrlObj, ...existingUrls];
          // localStorage.setItem('avatarUrls', JSON.stringify(updatedUrls));
          // setMessageAvatarUrl(response.data.s3Url); // Set the avatar source
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchData();
  }, [conversationId]); // Empty dependency array to run the effect only once

  function returnTopicDisplay() {
    // CRITICAL
    /**
     * If I select open a tenant card details --> tenant Card details stored in storage ****
     * if then I go to a random chat and I open a listing chat and click on the take me to listing
     * and it's another listing or another type of listing I will get an error because I will be trying to 
     * display the first **** tenant card details where I might be opening a listing
     */
    localStorage.removeItem('selectedCardDetails');

    let label;
    if(conversationTopicUrl) {
      if(conversationTopicUrl.includes('tenant')) {
        label = 'View Tenant Profile';
      } else if(conversationTopicUrl.includes('roommate')) {
        label = 'View Roommate Profile';
      } else if(conversationTopicUrl.includes('listingView')) {
        label = 'View Listing';
      }
    }

    return (
      <>
          <Button onClick={() => window.open(conversationTopicUrl, "_self")}>
            {label}
          </Button>
      </>
    );
  }

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

  function returnConversationHeader() {
    const className = `conversation-fixed-header-mobile sticky-top  ${ hasScrolled && isMobile ? 'push-chat-recipient-down' : '' }`;
    return (
      <div id="chatHeaderDivId" className={className} >
        <div style={{ display: "flex" }}>
          {displayBackButtonForMobile()}
          <Avatar src={messageAvatarUrl} />
          <h5 className="ml-2 pt-1"> {fullNameOfOpposingChat}</h5>
          <div className="ml-auto">{returnVerticalDotsButton()}</div>
        </div>
  
        {returnTopicDisplay()}
  
      </div>
    );
  }
  

  function returnVerticalDotsButton() {
    return (
      <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={reportUserAndClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} selected={option === 'Report'} onClick={reportUserAndClose}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }


  function calculateContainerHeightMobile() {
    const chatHeaderSection = document.getElementById('chatHeaderDivId');
    const newMessageSection = document.getElementById('conversationMessageDivId');
    const mobileBottomNavigationSection = document.getElementById('mobileBottomNavigation');

    // console.log('chatHeaderSection' , chatHeaderSection);
    // console.log('newMessageSection' , newMessageSection);
  
    // Check if the elements exist before accessing their properties
    if (!chatHeaderSection || !newMessageSection || !mobileBottomNavigationSection) {
      console.error('One or more elements not found.');
      return 500; // Return a default value or handle the error as needed
    }
  
    const headerAndConversationSectionHeight = chatHeaderSection.offsetHeight + newMessageSection.offsetHeight + mobileBottomNavigationSection.offsetHeight;

    let additionalMargin;
    if(isMobile) {
      additionalMargin = 10;
    } else {
      additionalMargin = 70;
    }
    let containerHeight = calculateScreenHeightWithoutTopNavBar() - headerAndConversationSectionHeight - additionalMargin;
  
    // console.log('Returning internal messages height: ' + containerHeight);
    return containerHeight;
  }

  function calculateContainerHeightComputer() {
    const chatHeaderSection = document.getElementById('chatHeaderDivId');
    const newMessageSection = document.getElementById('conversationMessageDivId');

    // console.log('chatHeaderSection' , chatHeaderSection);
    // console.log('newMessageSection' , newMessageSection);
  
    // Check if the elements exist before accessing their properties
    if (!chatHeaderSection || !newMessageSection ) {
      console.error('One or more elements not found.');
      return 0; // Return a default value or handle the error as needed
    }
  
    const headerAndConversationSectionHeight = chatHeaderSection.offsetHeight + newMessageSection.offsetHeight;
    let containerHeight = calculateScreenHeightWithoutTopNavBar() - headerAndConversationSectionHeight - 100;
  
    // console.log('Returning internal messages height: ' + containerHeight);
    return containerHeight;
  }

  const MobileConversationPanelHeight = isMobile || isTablet ? calculateContainerHeightMobile() : calculateContainerHeightComputer();


  function returnMessagesBetweenUsers() {
    
    return (
      // style={{height: `${MobileConversationPanelHeight}px`}}
      <div id="MobileConversationPanelDivId" className=" pt-2 inner-container-size-properties-mobile" >
      {messages &&
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-container`}
          >
            <MessageItem
              message={msg.message}
              sentByUserFullName={msg.sentByUserFullName}
              messageDateSent={msg.messageDateSent}
              sentByUserId={msg.sentByUserId}
              alignClass={
                msg.sentByUserId === userInfo[0].id
                  ? "right-align"
                  : "left-align"
              }
            />
          </div>
        ))}

      {/* <hr style={{ padding: '0', margin: '0'}} className='pb-1'/> */}

    </div>
    )
  }

  function returnInputAndSendMessageSection() {
    return (
      <>
      <div id='conversationMessageDivId' className="input-message-container-mobile">

      <input
        maxLength={NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH}
        type="text"
        className="form-control rounded-pill"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <SendIcon
        onClick={sendMessage}
        fontSize="large"
        className="send-message-button cursor-pointer"
      />
    </div>
      </>
      
    )
  }

  function returnPromptUserToSelectAConversation() {
    return (
      <div id="chat-container" className="inner-container-size-properties">
          <div className="no-chat-selected-message">
            <h4>Select a message</h4>
            <p>Choose a message from your existing conversations, or just initiate a new conversation by searching profiles or listings.</p>
          </div>
        </div>
    )
  }

  function returnReportUserModal() {
    return (
      <ReportUser
        show={showReportUserPopup}
        onHide={() => setShowReportUserPopup(false)}
        conversationId={conversationId}
        reportee={getOppositonUserId()}
      />
    )
  }

  const [screenHeight, setScreenHeight] = useState(0);
  const [navBar, setNavBar] = useState(null);
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



  function calculateScreenHeightWithoutTopNavBar() {
    // const navBar = document.getElementById('topNavBarId'); // Replace 'yourNavBarId' with the actual ID of your navigation bar
    // const screenHeight = window.innerHeight;
    const navBarHeight = navBar ? navBar.offsetHeight : 0;
    let containerHeight = screenHeight - navBarHeight ;
    console.log('Returning screen height without the top nav bar: ' + containerHeight);

    return containerHeight;
  }

  const containerHeight = calculateScreenHeightWithoutTopNavBar();

  return (
    <div className="conversation-container" >
      {conversationId === "" ? (
        returnPromptUserToSelectAConversation()

      ) : (
        <>
          <SnackBarAlert
            message={snackbarMessage}
            open={snackbarOpen}
            handleClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
          />
          {returnReportUserModal()}

            {/* ------------------------ NAME OF THE PERSON AT THE OTHER SIDE  ------------------------*/}
            {returnConversationHeader()}

            {/* ------------------------ CHAT MESSAGES BETWEEN 2 USERS  ------------------------*/}
            {returnMessagesBetweenUsers()}

            <hr/>
            {/* ------------------------ INPUT AND SEND BUTTON  ------------------------*/}
            {returnInputAndSendMessageSection()}

        </>
      )}
    </div>
  );
};

export default MobileConversationPanel;
