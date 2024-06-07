"use client";

import React, { useEffect } from "react";
import AnswerBox from "./AnswerBox";
import Title from "./Title";
import SubTitle from "./SubTitle";
import NavigationButton from "./NavigationButton";
import { useState } from "react";
import { SiteData } from "../../context/SiteWrapper";
import "../../styles/userProfileWorkflow/AnswerBox.css";

//@ts-ignore
const DescribePlace = ({ nextStep, prevStep }) => {
  //@ts-ignore
  const { welcomeProfileSetupStep, setWelcomeProfileSetupStep, describePlaceWorkflow, setPrevProgress, setNextProgress, scrollToTop } = SiteData();
  setPrevProgress(50);
  setNextProgress(75);
  let COMPONENT_TITLE = `What kind of place ${describePlaceWorkflow}`;
  let COMPONENT_SUB_HEADING =
    "A full house, an apartment, a studio or a bedroom";
  const [activeBox, setActiveBox] = useState(""); // State to track active box

  //@ts-ignore
  function logUserResponse(answer) {
    console.log(`${COMPONENT_TITLE} - The user selected: ${answer}`);
  }

  //@ts-ignore
  const handleRedirectToFindARoommateSearch = (answer) => {
    console.log("The user clicked on the button Find a Roommate");

    if (answer === "House") {
      setActiveBox("House"); // Set Yes box as active
      //@ts-ignore
      setWelcomeProfileSetupStep((prevState) => ({
        ...prevState,
        typeOfPlace: "House",
      }));
    } else if (answer === "Apartment") {
      setActiveBox("Apartment"); // Set Yes box as active
      //@ts-ignore
      setWelcomeProfileSetupStep((prevState) => ({
        ...prevState,
        typeOfPlace: "Apartment",
      }));
    } else if (answer === "Studio") {
      setActiveBox("Studio"); // Set Yes box as active
      //@ts-ignore
      setWelcomeProfileSetupStep((prevState) => ({
        ...prevState,
        typeOfPlace: "Studio",
      }));
    } else {
      setActiveBox("Bedroom"); // Set Yes box as active
      //@ts-ignore
      setWelcomeProfileSetupStep((prevState) => ({
        ...prevState,
        typeOfPlace: "Bedroom",
      }));
    }

    logUserResponse(answer);

  };

  useEffect(() => {
    scrollToTop();
  })

  return (
    <div>
 
      {/* ---------------------------------- TITLE ---------------------------------- */}
      <Title text={COMPONENT_TITLE} />

      {/* ---------------------------------- SUB HEADING ---------------------------------- */}
      <SubTitle text={COMPONENT_SUB_HEADING} />

      
        <div  className="container sliding-right-to-left row"  style={{margin: "auto"}}>
            {/* ---------------------------- BOX 1  ----------------------------*/}
            <AnswerBox
              onClick={() => handleRedirectToFindARoommateSearch("House")}
              labelText={"House"}
              isActive={activeBox === "House"} // Check if Yes box is active
            />

            {/* ---------------------------- BOX 2  ----------------------------*/}
            <AnswerBox
              onClick={() => handleRedirectToFindARoommateSearch("Apartment")}
              labelText={"Apartment"}
              isActive={activeBox === "Apartment"} // Check if No box is active
            />
        </div>

        <div  className="container sliding-right-to-left row mt-3"  style={{margin: "auto"}}>
            {/* ---------------------------- BOX 1  ----------------------------*/}
            <AnswerBox
              onClick={() => handleRedirectToFindARoommateSearch("Studio")}
              labelText={"Studio"}
              isActive={activeBox === "Studio"} // Check if Yes box is active
            />

            {/* ---------------------------- BOX 2  ----------------------------*/}
            <AnswerBox
              onClick={() => handleRedirectToFindARoommateSearch("Bedroom")}
              labelText={"Bedroom"}
              isActive={activeBox === "Bedroom"} // Check if No box is active
            />
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

export default DescribePlace;
