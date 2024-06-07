"use client";

import "../../styles/Signup.css";
import React, { useState, useEffect } from "react";
// import BackendAxios from "../../backend/BackendAxios";
import Link from 'next/link';
import { SiteData } from "../../context/SiteWrapper";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { FormHelperText } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "react-toastify/dist/ReactToastify.css";
import HttpsIcon from '@mui/icons-material/Https';
import PasswordPolicy from "./PasswordPolicy";
// import FooterSimple from "../FooterSimple";
//@ts-ignore
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/navigation';

const Signup = () => {
    const GOOGLE_REACPTCHA_KEY = process.env.GOOGLE_REACPTCHA_KEY;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  });

  
  const router = useRouter();

const navigateToPage = (path) => {
  router.push(path);
};

  // @ts-ignore
  const { setSignUpEmail } = SiteData();
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const navigateUserToTokenVerification = () => {
    navigateToPage("/emailVerification");
  };

  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showUserAlreadyRegistered, setShowUserAlreadyRegistered] = useState(false);

  /**
   * This function will reset all the form
   * once the user successfully registers
   */
  const resetInputForm = () => {
    // @ts-ignore
    document.getElementById("signUpForm").reset();
    setPassword(""); // resets the password
  };

  useEffect(() => {
    // Scroll to the top when the component mounts or updates
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  // Function to map error codes to messages
  //@ts-ignore
const mapErrorCodeToMessage = (errorCode) => {
  switch (errorCode) {
    case 'EMAIL_EXISTS':
      return 'A user is already registered with this email.';
    case 'DATABASE_ERROR':
      return 'Database error occurred';
    default:
      return 'An error occurred';
  }
};

 
  // @ts-ignore
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
    //   await BackendAxios.post("/signup", formData);
      console.log("User registered successfully");
      setSignUpEmail(formData.emailAddress);
      resetInputForm();
      navigateUserToTokenVerification();
      setShowUserAlreadyRegistered(false);

      // Redirect to the login page or do something else
    } catch (error) {
      // @ts-ignore
      console.error("Error registering user: " + error.message);

      // @ts-ignore
      if (error.response && error.response.data && error.response.data.error) {
        // @ts-ignore
        const errorCode = error.response.data.error;
        const returnedErrorCode=mapErrorCodeToMessage(errorCode); 
        //@ts-ignore
        setErrorMessage(returnedErrorCode);
        setShowUserAlreadyRegistered(true);
  
        console.log("Backend error code:", errorCode);
        console.log("Translated error message:", errorMessage);
  
        // Handle the error message as needed, such as displaying it to the user
      } else {
        console.log("An error occurred during signup");
      }

    }
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const iconStyle = {
    fontSize: 50, // Adjust the size as needed
    color: "var(--roomatee-theme-color)", // Change the color to your desired color
  };

  const [isPasswordValid, setIsPasswordValid] = useState(false);

  //@ts-ignore
  const handleValidationChange = (isValid) => {
    console.log('Password validation:', isValid);
    setIsPasswordValid(isValid);
  };

  return (
    <div className="container-fluid">
      <div className="row login-box-container">
        <div className="col-12 login-box">
          <form id="signUpForm" onSubmit={handleSignUp}>
            <div>
              <div className="title">
                <HttpsIcon style={iconStyle}/>
                <h1>Create Free Account</h1>
              </div>

              {/* ----------------------------- FIRST NAME ----------------------------- */}
              <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                <InputLabel htmlFor="firstName">First Name</InputLabel>
                <OutlinedInput
                  required
                  autoFocus
                  id="firstName"
                  type="wel"
                  label="First Name"
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  inputProps={{ maxLength: 30 }}
                />
              </FormControl>

              {/* ----------------------------- LAST NAME ----------------------------- */}
              <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                <InputLabel htmlFor="lastName">Last Name</InputLabel>
                <OutlinedInput
                  required
                  id="lastName"
                  type="wel"
                  label="Last Name"
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  inputProps={{ maxLength: 40 }}
                />
              </FormControl>

              {/* ----------------------------- EMAIL ADDRESS ----------------------------- */}
              <FormControl sx={{ m: 1, width: "100%" }} variant="outlined" error={showUserAlreadyRegistered}>
                <InputLabel htmlFor="emailAddress">Email address</InputLabel>
                <OutlinedInput
                  required
                  id="emailAddress"
                  type="email"
                  label="Email address"
                  onChange={(e) =>
                    setFormData({ ...formData, emailAddress: e.target.value })
                  }
                  inputProps={{ maxLength: 100 }}
                />
                
                {showUserAlreadyRegistered && <FormHelperText sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{errorMessage}</FormHelperText>}
              </FormControl>

                {/* {returnUserAlreadyRegisteredMessage()} */}

              {/* ----------------------------- PASSWORD ----------------------------- */}
              <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  required
                  id="password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  inputProps={{ maxLength: 50 }}
                />
              </FormControl>

              <PasswordPolicy password={password} onValidationChange={handleValidationChange}/>

                {/* ---------------------- RECAPTCHA ----------------------*/}
              <div className='pt-3'>
                <ReCAPTCHA sitekey='6LdqU-cpAAAAAOvIqjHD1FaLAeiOVeTU8PQJilHA' onChange={(e) => setRecaptchaToken(e)} />
              </div>

              {/* ----------------------------- SUBMIT BUTTON ----------------------------- */}
              <div className="row submit-button">
                <input type="submit" value="Submit" className="submit-button"  disabled={!isPasswordValid || !recaptchaToken} />
              </div>
              
              {/* ALREADY HAVE ACCOUNT REDIRECT */}
              <div className="row already">
                <label>
                  Have an account already?{" "}
                  <Link href="/login" className="link-as-button-format">
                    Login
                  </Link>
                </label>
              </div>

              

              {/* ----------------------------- PRIVACY STATEMENT ----------------------------- */}
            <div className="privacy-policy-sign-in-up">
            <p>
                By sigining up, you agree to the{" "}
                <Link href="/terms-of-service" className="link-as-button-format">
                Terms of Service
                </Link>
                ,{" "}
                <Link href="/privacy-policy" className="link-as-button-format">
                Privacy Policy
                </Link>
                , and including{" "}
                <Link href="/cookie-use" className="link-as-button-format">
                Coolie Use
                </Link>
                .
            </p>
            </div>;

            </div>
          </form>
        </div>
      </div>
      {/* <FooterSimple /> */}

    </div>
  );
};

export default Signup;
