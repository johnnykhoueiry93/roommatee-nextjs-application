import React from "react";
import { SiteData } from "../../context/SiteWrapper";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TicketReplies from "./TicketReplies";
import "../../styles/support/TicketItemDetails.css";
import Chip from "@mui/material/Chip";
import { useRouter } from 'next/navigation';
import Divider from "@mui/material/Divider";
import BackToResultsBtn from "../modals/BackToResultsBtn";
import MessageComponentLoader from "../loaders/MessageComponentLoader";

  //@ts-ignore
  function convertTimeToHumanReadable(dateAndTime) {
    const lastUpdateDate = new Date(dateAndTime);
    const formattedDate = `${lastUpdateDate.toLocaleDateString()} ${lastUpdateDate.toLocaleTimeString()}`;
    return formattedDate;
  }
  
  
const TicketItemDetails = ({ticketId}) => {
  //@ts-ignore
  const { userInfo, reply, setReply, openedSupportTicket, setOpenedSupportTicket , supportTicketMessages, setSupportTicketMessages } = SiteData();
  const [replyCount, setReplyCount] = useState(0);
  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };

  if(!userInfo) {
    return (<div>
       <MessageComponentLoader loadingMessage={"Loading user messages..."}/>
    </div>)
  }

  const getTicketMessages = async () => {
    if (userInfo) {
      try {
        const response = await fetch("/api/getSupportTicketDetails", {
          method: "POST",
          body: JSON.stringify({ userId: userInfo.id, openedSupportTicket: ticketId, emailAddress: userInfo.emailAddress }),
          cache: 'no-store'
        });
      
        if (!response.ok) {
          throw new Error('Network response was not ok' + response.statusText);
        }
      
        const data = await response.json();
        console.log('tickets details: ' , data.data);
        if (response.status == 200) {
          console.log('Setting the user support tickets in userSupportTickets')
          setSupportTicketMessages(data.data);
          localStorage.setItem("userSupportTickets", JSON.stringify(data.data));
          console.log('Stored in localStorage:', localStorage.getItem("userSupportTickets"));

  
        } else {
          console.error("Error room listing: " + data.message);
        }
      } catch (error) {
        // Handle the error here
        console.error("Error:", error);
      }  finally {
        // setLoading(false); // Update loading state after fetching
      }
    }
  };

  // @ts-ignore
  let isCaseOpen
  if(supportTicketMessages) {
    isCaseOpen = supportTicketMessages[0] && supportTicketMessages[0].status == "OPEN";
  }

  const [messageReply, setMessageReply] = useState({
    caseId: ticketId,
    message: "",
    emailAddress: userInfo.emailAddress,
  });
    // Use useEffect to call getTicketMessages on component mount
    useEffect(() => {
      getTicketMessages();
    }, []); // Empty dependency array ensures the effect runs only once on mount
  
  useEffect(() => {
    setMessageReply((prevState) => ({
      ...prevState,
      message: "",
    }));

    console.log("the value of reply is now: " + reply);
  }, [reply]);

  const [ticketDetails, setTicketDetails] = useState({
    caseId: openedSupportTicket,
    userProfileId: userInfo.id,
    emailAddress: userInfo.emailAddress,
  });

  useEffect(() => {
    console.log("fetch data should run nowwwww");
    if (!openedSupportTicket || openedSupportTicket === null || openedSupportTicket === undefined) {
      const localStorageValue = localStorage.getItem('openedSupportTicket');
      // Check if localStorageValue is not null or undefined before setting context
      if (localStorageValue !== null && localStorageValue !== undefined) {
        setOpenedSupportTicket(localStorageValue);
      }
    }

    getTicketMessages();
  }, [ticketDetails, reply, replyCount]);

  //@ts-ignore
  const handleSendTicketReply = async (e) => {
    e.preventDefault();
    console.log("The user clicked on the Submit Ticket button");

    // this is to ensure that supportTicketsUpdate which is listenned to by a useEffect to fetch again all support tickets if the user adds a new one
    //@ts-ignore
    setReply((prevCount) => prevCount + 1); 

    try {
        body: JSON.stringify({ messageReply }),
      console.log('Sending to the backend: ' , messageReply);
      const response = await fetch("/api/sendTicketReply", {
        method: "POST",
        body: JSON.stringify({ messageReply }),
        cache: 'no-store'
      });
    
      if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText);
      }
    
      const data = await response.json();
      console.log('tickets details: ' , data.data);
      if (response.status == 200) {
        console.log('Reply sent successfully');
        setReplyCount(prevCount => prevCount + 1);
        // localStorage.setItem("userSupportTickets", JSON.stringify(data.data));
        // console.log('Stored in localStorage:', localStorage.getItem("userSupportTickets"));
      } else {
        console.log('Failed to send successfully');
      }
    } catch (error) {
      // Handle the error here
      console.error("Error:", error);
    }  
  };

  if(!supportTicketMessages) {
    return (
      <div>
        <MessageComponentLoader loadingMessage={"Loading ticket messages..."}/>
      </div>
    )
  }

  return (
    <>
      {/* ---------------------------------- HEADING SECTION --------------------------------------- */}

      {/* I AM DOING THIS CHECK FIRST BECAUSE THE COMPONENT IS LOADING
        FASTER THAT THE MYSQL DATABASE CONNECTION THEREFORE RESPONSE DATA
        IS NOT YET GENERATED SO IT'S STILL LOADING. THE CHECK WILL ALLOW THE APPLICATION
        NOT TO CRASH FOR THE USER AND ONCE LOADED IT RENDERS AUTOMATICALLY */}
      {/* @ts-ignore*/}
      {supportTicketMessages[0] && (
        <>
          <div className="container support-container mt-3">
          <BackToResultsBtn prevPage={"/support"} text={"Back to tickets"}/>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>
                {/* @ts-ignore */}
                {supportTicketMessages[0].subject}
              </h2>
              
              {/* @ts-ignore */}
              <Chip label={supportTicketMessages[0].status} color="primary" />
            </div>
            <p><b>Case Area:</b> {supportTicketMessages[0].caseArea}</p>
            <p><b>Opened since:</b> {convertTimeToHumanReadable(supportTicketMessages[0].creationDate)}</p>
          </div>
        </>
      )}


      {/* -------------------------------- ONGOING MESSAGES ------------------------------ */}
      <div className="container support-container mt-3">
        {supportTicketMessages[0] && (
        <div className="ticket-messages-container">
          {supportTicketMessages.map(
            (
              //@ts-ignore
              ticketReply, index
            ) => (
              // @ts-ignore
              <div key={ticketReply.messageId} className="ticketReply-card">
                <TicketReplies ticketReply={ticketReply} />
                {/* Check if this is not the last index, then add the horizontal rule */}
                {index !== supportTicketMessages.length - 1 && <hr />} 
              </div>
            )
          )}

          {/* -------------------------------- Divider ------------------------------ */}
          {/* This divider will only show if the case is closed */}
          {!isCaseOpen && (
            <Divider>
              <p className="clase-closed-label">Case Closed</p>
            </Divider>
          )}
        </div>
        )}

        {/* -------------------------------- SEND MESSAGES ------------------------------ */}
        {/* @ts-ignore */}
        {isCaseOpen && (
          <div>
            <form id="signInForm" onSubmit={handleSendTicketReply}>
              <div>
                <div className="pt-3 ml-auto">
                  <TextField
                    required
                    id="outlined-multiline-flexible"
                    label="Additional Comments"
                    inputProps={{
                      maxLength: 1000,
                      style: { height: "150px" },
                    }}
                    multiline
                    maxRows={4}
                    placeholder="Additional Comments"
                    variant="outlined"
                    className="input-width"
                    style={{ width: "100%" }}
                    value={messageReply.message}
                    onChange={(e) =>
                      setMessageReply({
                        ...messageReply,
                        message: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-3 ml-auto pb-5">
                <Button variant="contained" type="submit">
                  Reply
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default TicketItemDetails;
