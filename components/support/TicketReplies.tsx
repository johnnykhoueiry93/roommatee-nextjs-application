/**
 * @author: Johnny Khoueiry
 * This components represents a single message sent between the user and the support
 * representative
 */

import React from "react"; 
import { SiteData } from "../../context/SiteWrapper";
import { Avatar } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import StaticFrontendLabel from "../../StaticFrontend";
import '../../styles/support/MessageItem.css'

//@ts-ignore
const TicketReplies = ({ ticketReply }) => {
  //@ts-ignore
  const { isMobile, userProfilePicture, userInfo } = SiteData();

  //@ts-ignore
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/New_York", // Set the timezone to US Eastern
    };
    //@ts-ignore
    return date.toLocaleString(undefined, options);
  };

  const iconStyle = {
    ...(isMobile
      ? { fontSize: "50px" }
      : { fontSize: "70px" }),
  };

  const avatarStyle = {
    ...(isMobile
      ? { height: "50px", width: "50px" }
      : { height: "70px", width: "70px" }),
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ height: "100px" }}>
          {ticketReply.emailAddress === StaticFrontendLabel.SUPPORT_EMAIL_ADDRESS ? (
            <SupportAgentIcon style={iconStyle} />
          ) : (
            <Avatar alt={userInfo.firstName} src={userProfilePicture} style={avatarStyle} />
          )}
        </div>

        <div className="ml-5">
          <p style={{ margin: "0em", fontWeight: 'bold', paddingLeft: '20px' }} className='mb-2'>{userInfo.firstName}</p>
          {/* By adding whiteSpace: 'pre-line' in the inline style, 
          you're instructing the browser to preserve whitespace and line breaks within the p element, 
          which will render the message field with the line breaks intact. */}
          <p style={{ margin: "0em", paddingLeft: '20px', whiteSpace: 'pre-line' }}>{ticketReply.message}</p>
          <p style={{ margin: "0em", paddingLeft: '20px' }} className="chat-timestamp ml-auto"> {formatDate(ticketReply.messageDate)}</p>
        </div>
      </div>
    </div>
  );
};

export default TicketReplies;
