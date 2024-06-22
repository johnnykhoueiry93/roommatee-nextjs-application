// app/roommate/[roommateId]/page.js

"use client";

import { useParams } from 'next/navigation';
import RoommateCardDetails from '../../../components/searchRoommate/RoommateCardDetails'

const Tenant = () => {
  const { roommateId } = useParams(); // Access the listingId from the URL

  // console.log('app/roommate/[roommateId]/page.js roommateId: ' + roommateId);

  return (
    <div>
      <RoommateCardDetails roommateId={roommateId}/>
    </div>
  );
};

export default Tenant;
