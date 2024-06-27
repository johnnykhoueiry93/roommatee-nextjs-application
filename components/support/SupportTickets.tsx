import React from "react"; 
import { SiteData } from "../../context/SiteWrapper";
import TicketItem from "./TicketItem";


const SupportTickets = () => {
    //@ts-ignore 
    const { supportTickets } = SiteData();

    return (
        <div className='mb-5'>
           
          {supportTickets.map((
            //@ts-ignore 
            ticket) => (
                
            <div key={ticket.caseId}>
                <TicketItem ticket={ticket}/>
              
            </div>
          ))}
        </div>
      );
}

export default SupportTickets;