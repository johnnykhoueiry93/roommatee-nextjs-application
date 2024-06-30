"use client";

import * as React from 'react';
import '../../styles/myProfile/Profile.css'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import SettingsIcon from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import ProfilePicture from "./ProfilePicture";
import AccountVerification from "./AccountVerification";
import BasicAccountInformation from "./BasicAccountInformation";
import MembershipInformation from "./MembershipInformation";
import PrivacyAndPreferences from "./PrivacyAndPreferences";
import ApplicationSetup from "./ApplicationSetup";
import SocialMediaLink from "./SocialMediaLink";
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { SiteData } from "../../context/SiteWrapper";
import { useState, useEffect } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useRouter } from 'next/navigation';

const Profile = () => {
  //@ts-ignore
  const { userAuth, isMobile, userInfo } = SiteData();
  const router = useRouter();

  const navigateToPage = (path) => {
    router.push(path);
  };

  useEffect(() => {
    if (!userAuth) {
      navigateToPage("/login");
    } 
  }, []);

  if(!userInfo) {
    return <div>Loading userinfo in Profile.tsx...</div>
  }

  const [expanded, setExpanded] = useState(false);
  let [socialStatusInitiallyIsStudentOrEmployee, setSocialStatusInitiallyIsStudentOrEmployee] = useState(false);
  

  //@ts-ignore
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const iconStyle = {
    fontSize: isMobile ? 25 : 50,
    color: "var(--roomatee-theme-color)",
  };

  useEffect(() => {
    if(userInfo.socialStatus === 'Student' || userInfo.socialStatus === 'Employee') {
      setSocialStatusInitiallyIsStudentOrEmployee(true);
    } else {
      setSocialStatusInitiallyIsStudentOrEmployee(false);
    }

  })

  const accordionData = [
    { key: 'panel1', icon: <AccountCircleIcon  style={iconStyle}/>, title: 'Profile Picture', content: <ProfilePicture /> },
    { key: 'panel2', icon: <VerifiedIcon  style={iconStyle}/>, title: 'Account Verification', content: <AccountVerification /> },
    { key: 'panel3', icon: <BadgeIcon  style={iconStyle}/>, title: 'Basic Account Information', content: <BasicAccountInformation /> },
    { key: 'panel4', icon: <SettingsIcon  style={iconStyle}/>, title: 'Application Setup', content: <ApplicationSetup socialStatusInitiallyIsStudentOrEmployee={socialStatusInitiallyIsStudentOrEmployee} setSocialStatusInitiallyIsStudentOrEmployee={setSocialStatusInitiallyIsStudentOrEmployee}/> },
    { key: 'panel5', icon: <ShareIcon  style={iconStyle}/>, title: 'Social Media Links', content: <SocialMediaLink /> },
    { key: 'panel6', icon: <DisplaySettingsIcon style={iconStyle}/>, title: 'Privacy and Preferences', content: <PrivacyAndPreferences /> },
    { key: 'panel7', icon: <LoyaltyIcon style={iconStyle}/>, title: 'Membership Information', content: <MembershipInformation /> },
  ];

  useEffect(() => {
    console.log('Profile component load with userInfo: ' , userInfo);

  },[])

  return (
    <div className='container mt-3'>
      {accordionData.map(item => (
        //@ts-ignore
        <Accordion key={item.key} expanded={expanded === item.key} onChange={handleChange(item.key)} style={{width: '100%'}}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${item.key}bh-content`} id={`${item.key}bh-header`}>
            <Typography sx={{ width: '100%', flexShrink: 0 }}>
              {item.icon} <span style={{ fontSize: "20px", paddingLeft: "10px" }}>{item.title}</span>
            </Typography>
          </AccordionSummary>
          {item.content}
        </Accordion>
      ))}
    </div>
  );
};

export default Profile;
