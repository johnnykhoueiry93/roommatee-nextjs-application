"use client";

import '../../styles/userProfileWorkflow/Welcome.css'
import { SiteData } from "../../context/SiteWrapper";
import { logFrontendActivityToBackend } from '../../utils/apiUtils'
import StaticFrontendLabel from "../../StaticFrontend";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import WavingHandIcon from '@mui/icons-material/WavingHand';
//@ts-ignore
const WelcomeComponent = ({ nextStep }) => {
  //@ts-ignore
  const { userInfo, setPrevProgress, setNextProgress} = SiteData();
  setPrevProgress(0);
  setNextProgress(10);

  let message = 'The user started the Profile Setup workflow';
  const arrowStyle = {
    fontSize: 40, // Adjust the size as needed
  };

  const iconStyle = {
    fontSize: 45, // Adjust the size as needed
    color: "var(--roomatee-theme-color)", // Change the color to your desired color
  };
  const watchIconStyle = {
    fontSize: 25, // Adjust the size as needed
    color: "var(--roomatee-theme-color)", // Change the color to your desired color
  };

  return (
    <div style={{paddingTop: '20vh', width: "70%", margin: "auto", textAlign: "center"}}>
      <span><WavingHandIcon style={iconStyle} /></span>

      <h1 className='pt-3'>Hey {userInfo.firstName}! <br/>Let's get you setup</h1>

      <h5 className="pt-4">Answer a few questions and complete your profile.</h5>

      <div className='mt-3'><AccessTimeFilledIcon style={watchIconStyle}/></div>

      <p>Estimated time <b>30 seconds</b> and you can edit later!</p>

      <div
        style={{ width: "70%", margin: "auto", textAlign: "center" }}
        className="pt-5"
      >
        <button className='welcome-start-setup-btn' onClick={() => {nextStep() , logFrontendActivityToBackend( message, userInfo)}}>Get Started <ArrowForwardIosIcon style={arrowStyle} className='shake' /></button> 
      </div>
    </div>
  );
};

export default WelcomeComponent;
