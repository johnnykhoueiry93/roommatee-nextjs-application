"use client";

import { SiteData } from "../../context/SiteWrapper";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/navigation';

//@ts-ignore
const ResetInstructions = () => {
  //@ts-ignore
  const { emailAddressToReset, isMobile } = SiteData();
  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };
  const iconStyle = {
    fontSize: 50, // Adjust the size as needed
    color: "var(--roomatee-theme-color)", // Change the color to your desired color
  };

  const iconStyleType2 = {
    fontSize: 20, // Adjust the size as needed
    color: 'var(--roomatee-theme-color)', // Change the color to your desired color
  };

  function navigateToLogin() {
    console.log(`The user clicked on the button Back to Login`)
    navigateToPage('/login');
  }

  return (
    <div className="container-fluid">
      <div className="row login-box-container">
      <div className={`col-12 text-center ${isMobile ? '' : 'login-box'}`}>

          <div className="title">
            <MarkEmailReadIcon style={iconStyle}/>
            <h1>Forgot Password</h1>
          </div>

          <p className='mt-4'>An email was sent to {emailAddressToReset} with instructions for resetting your password if found in our database.</p>
          <p className='mt-2' style={{fontStyle: 'italic'}}>If you do not see the email in a few minutes, check your “junk mail” folder or “spam” folder.</p>
          <span className="link-as-button-format" onClick={() => navigateToLogin()}> <ArrowBackIosIcon style={iconStyleType2}/> Back to Login</span>

        </div>
      </div>
    </div>
  );
};

export default ResetInstructions;
