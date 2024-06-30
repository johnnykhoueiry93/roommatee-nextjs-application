"use client";

import React from "react";
import Welcome from "./WelcomeComponent";
import HaveAPlace from "./HaveAPlace";
import DescribePlace from "./DescribePlace";
import PersonalInformation from "./PersonalInformation";
import LookingForRoommate from "./LookingForRoommate";
import LookingToLiveWhere from "./LookingToLiveWhere";
import UploadProfilePicture from "./UploadProfilePicture";
import LinearProgressBar from "./LinearProgressBar";
import ProfileCompleteScreen from "./ProfileCompleteScreen";
import { useEffect, useState } from "react";
import { SiteData } from "../../context/SiteWrapper";
import { useRouter } from "next/navigation";

const ProfileSetup = () => {
  // @ts-ignore
  const { userAuth } = SiteData();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  const navigateToPage = (path) => {
    router.push(path);
  };

  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  useEffect(() => {
    if (!userAuth) {
      navigateToPage("/login");
    } else {
      setIsHydrated(true);
    }
  }, []);

  if (!isHydrated) {
    return <div></div>; //TODO update to something better!!
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Welcome nextStep={nextStep}/>;
      case 2:
        return <HaveAPlace nextStep={nextStep} prevStep={prevStep}/>;
      case 3:
        return <LookingForRoommate nextStep={nextStep} prevStep={prevStep}/>;
      case 4:
        return <LookingToLiveWhere nextStep={nextStep} prevStep={prevStep}/>;
      case 5:
        return <DescribePlace nextStep={nextStep} prevStep={prevStep}/>;
      case 6:
        return <PersonalInformation nextStep={nextStep} prevStep={prevStep}/>;
      case 7:
        return <UploadProfilePicture nextStep={nextStep} prevStep={prevStep}/>;
      case 8:
        return <ProfileCompleteScreen />;
      default:
        return null;
    }
  };



  return (
    <div>
      <LinearProgressBar/>
      {renderStep()}
    </div>
  );
};

export default ProfileSetup;
