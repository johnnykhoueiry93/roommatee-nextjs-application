"use client";

import AnswerBox from "./AnswerBox";
import Title from "./Title";
import SubTitle from "./SubTitle";
import NavigationButton from "./NavigationButton";
import { useState } from "react";
import { SiteData } from "../../context/SiteWrapper";
import React from "react"; 

//@ts-ignore
const LookingForRoommate = ({ nextStep, prevStep }) => {
  //@ts-ignore
  const { welcomeProfileSetupStep, setWelcomeProfileSetupStep, setPrevProgress, setNextProgress } = SiteData();
  const [activeBox, setActiveBox] = useState(""); // State to track active box
  setPrevProgress(20);
  setNextProgress(30);
  
  //@ts-ignore
  function logUserResponse(answer) {
    console.log(`${COMPONENT_TITLE} - The user selected: ${answer}`);
  }

  let COMPONENT_TITLE = "Are you looking for a roommatee?";
  let COMPONENT_SUB_HEADING =
    "Let us know if you're looking for roommate or not";

  //@ts-ignore
  const handleRedirectToFindARoommateSearch = (answer) => {

    if (answer === "Yes") {
      setActiveBox("Yes"); // Set Yes box as active
      //@ts-ignore
      setWelcomeProfileSetupStep((prevState) => ({
        ...prevState,
        isLookingForRoommate: 1,
      }));

      
    } else {
      setActiveBox("No"); // Set No box as active
      //@ts-ignore
      setWelcomeProfileSetupStep((prevState) => ({
        ...prevState,
        isLookingForRoommate: 0,
      }));
    }

    logUserResponse(answer);
  };

  return (
    <div >

      <div >
        {/* ---------------------------------- TITLE ---------------------------------- */}
        <Title text={COMPONENT_TITLE} />

        {/* ---------------------------------- SUB HEADING ---------------------------------- */}
        <SubTitle text={COMPONENT_SUB_HEADING} />

        <div className="container sliding-right-to-left row"  style={{margin: "auto"}}>
            {/* ---------------------------- BOX 1  ----------------------------*/}
            <AnswerBox
              onClick={() => handleRedirectToFindARoommateSearch("Yes")}
              labelText={"Yes"}
              isActive={activeBox === "Yes"} // Check if Yes box is active
            />

            {/* ---------------------------- BOX 2  ----------------------------*/}
            <AnswerBox
              onClick={() => handleRedirectToFindARoommateSearch("No")}
              labelText={"No"}
              isActive={activeBox === "No"} // Check if No box is active
            />
        </div>
      </div>

      {/* ---------------------------------- NAVIGATION BUTTONS ---------------------------------- */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <NavigationButton
          direction="Back"
          nextStep={nextStep}
          prevStep={prevStep}
        />

        {/* The Next button will be hidden until the user provides a repsonse then it will be displayed */}
        {activeBox && (
          <NavigationButton
            direction="Next"
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
      </div>
    </div>
  );
};

export default LookingForRoommate;
