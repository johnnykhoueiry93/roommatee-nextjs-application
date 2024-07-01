"use client";

import ListingBox from "./ListingBox";
import AdminMainScreen from "../admin/AdminMainScreen";
import { useRouter } from "next/navigation";
import { SiteData } from "../../context/SiteWrapper";
import { logFrontendActivityToBackend } from '../../utils/apiUtils'
import '../../styles/ListingType.css'

const ListingType = () => {
  //@ts-ignore
  const {userIsAdmin, userInfo, setSearchValue, setIntendedDestination} = SiteData();
  const router = useRouter();

  const navigateToPage = (path) => {
    router.push(path);
  };

  /**
   * 
   * @param buttonLabel 
   * @param destination 
   */
  const handleRedirect = (buttonLabel, destination) => {
    let event = `The user clicked on the button: ${buttonLabel}`
    console.log(event);
    logFrontendActivityToBackend(event, userInfo);
    setSearchValue(''); // this ensures the value resets when switching between searches
    setIntendedDestination(destination); // in case the user is not logged in, redirect after login
    localStorage.removeItem('sortedSearchResults');
    navigateToPage(destination);
  };


  function returnHomeMainComponent() {
    if (userIsAdmin()) {
      return <AdminMainScreen />;
    } else {
      return (
        <>
          {/* <TypeScriptLabel /> */}
          {returnNormalUserMenu()}
        </>
      );
    }
  }

function returnNormalUserMenu() {
  return (
    <div className="container container-flex sliding-right-to-left">
      <div className="row row-gap" >
        {/* ---------------------------- BOX 1  ----------------------------*/}
        <ListingBox
          onClickFunction={() => handleRedirect("List a Room", "/list-a-room")}
          image={"/images/list-a-room.png"}
          imageAlt={"List a room"}
          labelText={"List a Room"}
          height={180}
          width={200}
        />

        {/* ---------------------------- BOX 2  ----------------------------*/}
        <ListingBox
          onClickFunction={() => handleRedirect("Find a Room", "/find-a-room")}
          image={"/images/find-a-room.png"}
          imageAlt={"Find a Room"}
          labelText={"Find a Room"}
          height={180}
          width={200}
        />
      </div>

      <div className="row row-gap">
        {/* ---------------------------- BOX 3  ----------------------------*/}
        <ListingBox
          onClickFunction={() => handleRedirect("Find a Roommate", "/find-a-roommate")}
          image={"/images/find-roommates.png"}
          imageAlt={"List a room"}
          labelText={"Find a Roommate"}
          height={180}
          width={200}
        />

        {/* ---------------------------- BOX 4  ----------------------------*/}
        <ListingBox
          onClickFunction={() => handleRedirect("Find a Tenant", "/find-a-tenant")}
          image={"/images/find-a-tenant.png"}
          imageAlt={"List a room"}
          labelText={"Find a Tenant"}
          height={180}
          width={200}
        />
      </div>
    </div>
  );
}

return (<>{returnHomeMainComponent()}</>)
  
};

export default ListingType;
