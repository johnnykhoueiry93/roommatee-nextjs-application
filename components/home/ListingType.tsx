"use client";

import ListingBox from "./ListingBox";
import { useRouter } from "next/navigation";
import { SiteData } from "../../context/SiteWrapper";
import { logFrontendActivityToBackend } from '../../utils/apiUtils'

const ListingType = () => {
  //@ts-ignore
  const {userAdmin, userInfo, setSearchValue, setIntendedDestination} = SiteData();
  const router = useRouter();

  const navigateToPage = (path) => {
    router.push(path);
  };

  const handleRedirectToListRoomForm = () => {
    let logEvent = "The user clicked on the button List a Room";
    console.log(logEvent);
    logFrontendActivityToBackend(logEvent, userInfo);
    setSearchValue(''); // this insures the value resets when switching from Search Roommate to Search Tenant to Seach Rooms
    setIntendedDestination("/list-a-room"); //   in case the user was not logged in, after login we redirect him to the intended page
    localStorage.removeItem('sortedSearchResults');
    navigateToPage("/list-a-room");
  };

  const handleRedirectToFindRoomForm = () => {
    let logEvent = "The user clicked on the button Find a Room";
    console.log(logEvent);
    logFrontendActivityToBackend(logEvent, userInfo);
    setSearchValue(''); // this insures the value resets when switching from Search Roommate to Search Tenant to Seach Rooms
    setIntendedDestination("/find-a-room");
    localStorage.removeItem('sortedSearchResults');
    navigateToPage("/find-a-room");
  };

  const handleRedirectToFindARoomateSearch = () => {
    let logEvent = "The user clicked on the button Find a Roommate";
    console.log(logEvent);
    logFrontendActivityToBackend(logEvent, userInfo);
    setSearchValue(''); // this insures the value resets when switching from Search Roommate to Search Tenant to Seach Rooms
    setIntendedDestination("/find-a-roommate");
    localStorage.removeItem('sortedSearchResults');
    navigateToPage("/find-a-roommate");
  };

  const handleRedirectToFindATenantSearch = () => {
    let logEvent = "The user clicked on the button Find a Tenant";
    console.log(logEvent);
    logFrontendActivityToBackend(logEvent, userInfo);
    setSearchValue(''); // this insures the value resets when switching from Search Roommate to Search Tenant to Seach Rooms
    setIntendedDestination("/find-a-tenant");
    localStorage.removeItem('sortedSearchResults');
    navigateToPage("/find-a-tenant");
  };

  return (
    <div className="container container-flex sliding-right-to-left">
      <div className="row margin-auto">
        {/* ---------------------------- BOX 1  ----------------------------*/}
        <ListingBox
          onClickFunction={handleRedirectToListRoomForm}
          image={"/images/list-a-room.png"}
          imageAlt={"List a room"}
          labelText={"List a Room"}
          height={180}
          width={200}
        />

        {/* ---------------------------- BOX 2  ----------------------------*/}
        <ListingBox
          onClickFunction={handleRedirectToFindRoomForm}
          image={"/images/find-a-room.png"}
          imageAlt={"Find a Room"}
          labelText={"Find a Room"}
          height={180}
          width={200}
        />
      </div>

      <div className="row margin-auto">
        {/* ---------------------------- BOX 3  ----------------------------*/}
        <ListingBox
          onClickFunction={handleRedirectToFindARoomateSearch}
          image={"/images/find-roommates.png"}
          imageAlt={"List a room"}
          labelText={"Find a Roommate"}
          height={180}
          width={200}
        />

        {/* ---------------------------- BOX 4  ----------------------------*/}
        <ListingBox
          onClickFunction={handleRedirectToFindATenantSearch}
          image={"/images/find-a-tenant.png"}
          imageAlt={"List a room"}
          labelText={"Find a Tenant"}
          height={180}
          width={200}
        />
      </div>
    </div>
  );
};

export default ListingType;
