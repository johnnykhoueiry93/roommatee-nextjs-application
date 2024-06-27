// app/listingView/[listingId]/page.js

"use client";
import { useParams } from 'next/navigation';
import SearchCardDetails from '../../../components/search/SearchCardDetails';

const ListingView = () => {
  const { listingId } = useParams(); // Access the listingId from the URL

  return (
    <div>
      {/* <h1>Listing Details for ID: {listingId}</h1> */}
      <SearchCardDetails listingId={listingId}/>
    </div>
  );
};

export default ListingView;
