import React from "react";
import "../../styles/support/TicketItem.css";
import MailIcon from "@mui/icons-material/Mail";
import Chip from "@mui/material/Chip";
import { SiteData } from "../../context/SiteWrapper";
import { useRouter } from 'next/navigation';

//@ts-ignore
const TicketItem = ({ ticket }) => {
  const router = useRouter();
const navigateToPage = (path) => {
  router.push(path);
};
  //@ts-ignore
  const { isMobile, setOpenedSupportTicket, setIntendedDestination } = SiteData();
  
  // Convert the string date to a Date object
  const lastUpdateDate = new Date(ticket.lastUpdateDate);
  const formattedDate = `${lastUpdateDate.toLocaleDateString()} ${lastUpdateDate.toLocaleTimeString()}`;

  const redirectUserToFullCardDetails = () => {
    console.log( `The user clicked on support ticket with ID: ${ticket.caseId}`);
    localStorage.setItem('openedSupportTicket', ticket.caseId);
    setOpenedSupportTicket(ticket.caseId);
    navigateToPage(`/ticket/${ticket.caseId}`);
    setIntendedDestination(`/ticket/${ticket.caseId}`);
  };

  const mailIconStyle = {
    fontSize: isMobile ? 25: 40, // Adjust the size as needed
    color: "var(--roomatee-theme-color)", // Change the color to your desired color
  };

  return (
    <div
      className="ticket-item-row container support-container mt-2"
      onClick={() => redirectUserToFullCardDetails()}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className='mr-4'>
            <MailIcon style={mailIconStyle} />
          </div>

          <div style={{ height: "70px", paddingLeft: "20px", paddingTop: "20px" }}>
            <h5>{ticket.subject}</h5>
            <p className="last-update-on">Last Update on {formattedDate}</p>
          </div>
        </div>

        {/* ----------------- Ticket Status OPEN / CLOSED -----------------*/}
        <div>
          <Chip label={ticket.status} color="primary" />
        </div>
      </div>
    </div>
  );
};

export default TicketItem;
