// app/ticket/[ticketId]/page.js

"use client";

import { useParams } from 'next/navigation';
import TicketItemDetails from '../../../components/support/TicketItemDetails';

const TicketView = () => {
  const { ticketId } = useParams(); // Access the ticketId from the URL

  return (
    <div>
      <TicketItemDetails ticketId={ticketId}/>
    </div>
  );
};

export default TicketView;
