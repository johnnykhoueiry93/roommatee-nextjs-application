import { useEffect, useState } from "react";
// import BackendAxios from "../../backend/BackendAxios";
import { SiteData } from "../../context/SiteWrapper";
import SingleValue from "./SingleValue";

const UserCount = () => {
    //@ts-ignore
  const { userAuth, setUserAuth, userInfo } = SiteData(); // Destructure only necessary values
  const [userCount, setUserCount] = useState();

  const userIsAdmin = () => {
    let isAdmin = false;
    if (userInfo.userType === "admin" && userAuth) {
      isAdmin = true;
    }
    return isAdmin;
  };

  const getUsersCount = async () => {
      console.log('Triggered getVerifiedUserCount');
      try {
        const response = await fetch("/api/getUserCounts", {
          method: "POST",
          body: JSON.stringify({ 
            isAdmin: userIsAdmin(), 
            emailAddress: userInfo.emailAddress}),
          cache: 'no-store'
        });
      
        if (!response.ok) {
          throw new Error('Network response was not ok' + response.statusText);
        }
      
        const data = await response.json();
  
        if (response.status == 200) {
          setUserCount(data.userCount); // Set the verifiedUserCount state
        } else {
          console.error("Error during getVerifiedUserCount:");
        }
      } catch (error) {
        // Handle the error here
        console.error("Error during getVerifiedUserCount:", error);
      }
    };

  useEffect(() => {
    getUsersCount();
  }, []); // Empty dependency array to run only once on component mount

  return (

    <SingleValue value={userCount} label={'Total Registered Users'}/>

  );
};

export default UserCount;
