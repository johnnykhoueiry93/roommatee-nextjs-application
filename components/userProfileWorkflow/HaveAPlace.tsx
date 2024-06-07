"use client";

import React from "react";
import AnswerBox from "./AnswerBox";
import Title from "./Title";
import SubTitle from "./SubTitle";
import NavigationButton from "./NavigationButton";
import { useState, useEffect } from "react";
import { SiteData } from "../../context/SiteWrapper";

//@ts-ignore
const HaveAPlace = ({ nextStep, prevStep, }) => {
  //@ts-ignore
  const { setWelcomeProfileSetupStep, setDescribePlaceWorkflow, setDescribeTenanteWorkflow, setPrevProgress, setNextProgress, scrollToTop } = SiteData();
  const [activeBox, setActiveBox] = useState(""); // State to track active box
  setPrevProgress(10);
  setNextProgress(20);

  let COMPONENT_TITLE = "Do you have a place?";
  let COMPONENT_SUB_HEADING = "A full house, an apartment, a studio or a bedroom";
  
  //@ts-ignore
  function logUserResponse(answer) {
    console.log(`${COMPONENT_TITLE} - The user selected: ${answer}`);
  }

  useEffect(() => {
    scrollToTop();
  })

  //@ts-ignore
  const handleHaveAPlaceAnswer = (answer) => {
    if (answer === "Yes") {
      console.log("The user clicked on the box Yes and setting userHasAPlace : 1");
      setActiveBox("Yes"); // Set Yes box as active 
      //@ts-ignore
      setWelcomeProfileSetupStep((prevState) => ({
        ...prevState,
        userHasAPlace: 1,
      }));
      setDescribePlaceWorkflow("are you offering?")
      setDescribeTenanteWorkflow("tenant");

    } else {
      console.log("The user clicked on the box No and setting userHasAPlace : 0");
      setActiveBox("No"); // Set No box as active 
      //@ts-ignore
      setWelcomeProfileSetupStep((prevState) => ({
        ...prevState,
        userHasAPlace: 0,
      }));
      setDescribePlaceWorkflow("are you looking for?");
      setDescribeTenanteWorkflow("roommate");
    }

    logUserResponse(answer);
  };

  return (
    <div>
      <div>
        {/* ---------------------------------- TITLE ---------------------------------- */}
        <Title text={COMPONENT_TITLE} />

        {/* ---------------------------------- SUB HEADING ---------------------------------- */}
        <SubTitle text={COMPONENT_SUB_HEADING} />

        <div className="container sliding-right-to-left row margin-auto">
            {/* ---------------------------- BOX 1  ----------------------------*/}
            <AnswerBox
              onClick={() => handleHaveAPlaceAnswer("Yes")}
              labelText={"Yes"}
              isActive={activeBox === "Yes"} // Check if Yes box is active
            />

            {/* ---------------------------- BOX 2  ----------------------------*/}
            <AnswerBox
              onClick={() => handleHaveAPlaceAnswer("No")}
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

export default HaveAPlace;
