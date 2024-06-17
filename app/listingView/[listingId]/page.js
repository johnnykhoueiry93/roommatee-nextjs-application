// app/listingView/[listingId]/page.js
"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchCardDetails from '@/components/search/SearchCardDetails';

const ListingView = () => {
  const { listingId } = useParams(); // Access the listingId from the URL
  const [listingData, setListingData] = useState(null);

//   useEffect(() => {
//     if (listingId) {
//       // Fetch listing data based on listingId
//       const fetchListingData = async () => {
//         try {
//           const response = await fetch(`/api/listing/${listingId}`);
//           const data = await response.json();
//           setListingData(data);
//         } catch (error) {
//           console.error('Error fetching listing data:', error);
//         }
//       };

//       fetchListingData();
//     }
//   }, [listingId]);


  return (
    <div>
      {/* <h1>Listing Details for ID: {listingId}</h1> */}
      <SearchCardDetails listingId={listingId}/>
    </div>
  );
};

export default ListingView;
