import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { SiteData } from "../../context/SiteWrapper";

//@ts-ignore
const UserChip = ({ firstName, lastName, profilePicture }) => {
  //@ts-ignore
  const { isMobile } = SiteData();

  const searchResultChipAvatarStyle = {
    ...(isMobile
      ? { height: "35px", width: "35px" }
      : { height: "35px", width: "35px" }),
  };

  const searchResultChipContainer = {
    ...(isMobile
      ? { height: "40px", borderRadius: "40px", fontSize: "18px" }
      : { height: "40px", borderRadius: "40px"}),
  }

  return (
    <div>
      <Chip
        avatar={
          <Avatar
            alt={firstName}
            src={profilePicture}
            style={searchResultChipAvatarStyle}
          />
        }
        label={firstName + " " +  lastName}
        variant="outlined"
        style={searchResultChipContainer}
      />
    </div>
  );
};

export default UserChip;
