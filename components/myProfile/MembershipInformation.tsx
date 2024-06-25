import "../../styles/myProfile/MembershipInformation.css";
import ProfileComponentTitle from "./ProfileComponentTitle";
import { SiteData } from "../../context/SiteWrapper";

const MembershipInformation = () => {
  //@ts-ignore
  const { userInfo } = SiteData();

  if(!userInfo) {
    return <div>Loading userinfo in Membership...</div>
  }

  //@ts-ignore
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    //@ts-ignore
    return date.toLocaleDateString(undefined, options);
  };

  //@ts-ignore
  const formatDateWithTimezone = (dateString) => {
    // Define options for formatting the date with time and timezone
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };

    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Use toLocaleDateString to format the date with specified options
    //@ts-ignore
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="container membership-information-container">
      <ProfileComponentTitle title={"Membership Information"} />
      <p>Member since: {formatDate(userInfo.registrationDate)}</p>
      <p>Last Login: {formatDateWithTimezone(userInfo.lastLoginDate)}</p>
    </div>
  );
};

export default MembershipInformation;
