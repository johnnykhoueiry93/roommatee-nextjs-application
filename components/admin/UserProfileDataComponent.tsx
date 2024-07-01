import { useEffect, useState } from "react";
import { SiteData } from "../../context/SiteWrapper";
import SingleValue from "./SingleValue";

//@ts-ignore
const UserProfileDataComponent = ({column , label}) => {
    //@ts-ignore
  const { userIsAdmin, userAuth, setUserAuth, userInfo } = SiteData(); // Destructure only necessary values
  const [verifiedUserCount, setVerifiedUserCount] = useState();


  const getVerifiedUserCount = async () => {
    console.log('Triggered getVerifiedUserCount');
    try {
      const response = await fetch("/api/getUserProfileCounts", {
        method: "POST",
        body: JSON.stringify({ 
          isAdmin: userIsAdmin(), 
          column: column, 
          emailAddress: userInfo.emailAddress,
          userAuth}),
        cache: 'no-store'
      });
    
      if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText);
      }
    
      const data = await response.json();

      if (response.status == 200) {
        setVerifiedUserCount(data.userCount); // Set the verifiedUserCount state
      } else {
        console.error("Error during getVerifiedUserCount:");
      }
    } catch (error) {
      // Handle the error here
      console.error("Error during getVerifiedUserCount:", error);
    }
  };

  useEffect(() => {
    getVerifiedUserCount();
  }, []); // Empty dependency array to run only once on component mount

  return (

    <SingleValue value={verifiedUserCount} label={label}/>

  );
};

export default UserProfileDataComponent;
