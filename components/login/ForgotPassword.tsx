"use client";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import FormControl from "@mui/material/FormControl";
import { useState } from "react";
import "../../styles/Signup.css";
import { SiteData } from "../../context/SiteWrapper";
import LockResetIcon from '@mui/icons-material/LockReset';
import { useRouter } from 'next/navigation';
import FooterSimple from "../footer/FooterSimple";

const ForgotPassword = () => {
  const [errorMessage, setErrorMessage] = useState('');
  //@ts-ignore
  const { emailAddressToReset, setEmailAddressToReset } = SiteData();
  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };

  function navigateToLogin() {
    console.log(`The user clicked on the button Back to Login`)
    navigateToPage('/login');
  }


  const iconStyleType2 = {
    fontSize: 20, // Adjust the size as needed
    color: 'var(--roomatee-theme-color)', // Change the color to your desired color
  };


  const iconStyle = {
    fontSize: 50, // Adjust the size as needed
    color: 'var(--roomatee-theme-color)', // Change the color to your desired color
  };

  //@ts-ignore
  const handleResetPassword = async(e) => {
    e.preventDefault();

    console.log(`The user clicked on submit to send a recovery temp password for email address ${emailAddressToReset}`)

    const response = await fetch("/api/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddressToReset }), // Send the parameters in the request body
        cache: 'no-store' // Ensures the data is fetched on every request
      });
      const data = await response.json();
    //   return data;

    if (response.status === 200) {
        // window.alert('changed!'); //TODO add success snack bar
        console.log(`User with email: ${emailAddressToReset} was found. Redirecting user to  /resetInstructions`);
        navigateToPage('/resetInstructions');
        setErrorMessage('');
      } else {
        // window.alert('nayyik!') //TODO add success snack bar
        navigateToPage('/resetInstructions');
        console.log(`User with email: ${emailAddressToReset} was not found. Showing error message`);
      }
  }

  return (
    <div className="container-fluid">
      <div className="row login-box-container">
        <div className="col-12 login-box">
          <div className="title">
            <LockResetIcon style={iconStyle}/>
            <h1>Forgot Password</h1>
          </div>

          <p className='forgot-password-instructions'>Enter your email address to send a recovery temp password</p>

          <form id="signUpForm" onSubmit={handleResetPassword}>
          <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="emailAddress">Email address</InputLabel>
            <OutlinedInput
              required
              id="emailAddress"
              type="email"
              label="Email address"
              onChange={(e) =>
                setEmailAddressToReset(e.target.value)
              }
            />

          <div className='pt-1 email-does-not-exist'>{errorMessage}</div>
          </FormControl>

          {/* ----------------------------- SUBMIT BUTTON ----------------------------- */}
          <input type="submit" value="Submit" className="submit-button" />
          </form>

          <div className='back-to-login-container text-center' >          
              <span className="link-as-button-format" onClick={() => navigateToLogin()}> <ArrowBackIosIcon style={iconStyleType2}/> Back to Login</span>
          </div>
        </div>
      </div>
      <FooterSimple />
    </div>
  );
};

export default ForgotPassword;
