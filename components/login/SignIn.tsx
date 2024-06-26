"use client";
import "../../styles/Signup.css";
import { SiteData } from "../../context/SiteWrapper";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PasswordIcon from "@mui/icons-material/Password";
import FooterSimple from "../footer/FooterSimple";
import CirculatorProgressLoader from "../loaders/CirculatorProgressLoader";
import { encryptData, decryptData } from '../../utils/encryptionUtils';
import ReCAPTCHA from 'react-google-recaptcha';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
// import { signIn } from 'next-auth/react'
import SnackBarAlert from "../alerts/SnackBarAlerts";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

const SignIn = () => {
  // @ts-ignore
  const { loading, setLoading, setUserAdmin, userAuth, userInfo, setUserAuth, intendedDestination, setUserProfilePicture, setFirebaseToken, setEmailAddressToReset, setSupportTickets, setUserInfo, setListing, setSignUpEmail, setUserProfileSetupComplete, snackbarOpen, setSnackbarOpen, snackbarMessage, setSnackbarMessage, snackbarSeverity, setSnackbarSeverity} = SiteData();
  const [loginStatus, setLoginStatus] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const router = useRouter();

  const navigateToPage = (path) => {
    router.push(path);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("/api/login"); // Replace with your API route path
  //       const responseData = await response.json();
  //       setData(responseData);
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const iconStyle = {
    fontSize: 50, // Adjust the size as needed
    color: "var(--roomatee-theme-color)", // Change the color to your desired color
  };

    // @ts-ignore
    const isUserValid = (user) => {
      return user && user.firstName;
    };

      //@ts-ignore
  function triggerUserEmailIsNotVerified(user) {
    setUserAuth(false);
    setLoginStatus( "Your email is not yet verified. Please verify your email to proceed."
    );
    console.log( "Your email is not yet verified. Please verify your email to proceed."
    );
    setSignUpEmail(user.emailAddress);
    navigateToPage("/emailVerification");
  }

    // @ts-ignore
    function triggerUserPasswordResetMode(user) {
      setUserAuth(false);
      setEmailAddressToReset(user.emailAddress);
      navigateToPage('/resetPassword');
    }

      //@ts-ignore
  function triggerUserProfileCompletionWorkflow(user) {
    console.log("Starting the complete user profile workflow");
    setLoginStatus(user.firstName);
    setUserInfo(user);
    setUserAuth(true);
    navigateToPage("/setup");
  }


  async function getNavBarProfilePicture(user) {
    const key = `profile-picture/${user.id}-profile-picture.png`;
    
    try {
      
      const response = await fetch(`/api/getS3PictureUrl?key=${key}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      console.log("[DEBUG] - [SignIn.tsx] - Setting the user profile picture to URL: " + data.s3Url);
      setUserProfilePicture(data.s3Url);
      console.log("[DEBUG] - [SignIn.tsx] - setting in storage userProfilePicture: " + data.s3Url);
      localStorage.setItem("userProfilePicture", JSON.stringify(data.s3Url));
    } catch (error) {
      console.error("Error:", error);
    }
  }

   async function getUserListings(user) {
    let userProfileId = user.id;
    let emailAddress = user.emailAddress;
    try {
      const response = await fetch('/api/getUserListings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userProfileId , emailAddress }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user listings');
      }
  
      const data = await response.json();

      setListing(data);
      localStorage.setItem("userListings", JSON.stringify(data));
      console.log('getUserListings ' , data);
      return data;
    } catch (error) {
      console.error('Error fetching user listings:', error);
      throw error;
    }
  }

    //@ts-ignore
    async function triggerSuccessLoginSteps(user, firebaseToken) {

      console.log("[/api/login] - user value:", user);
      console.log("[/api/login] firebaseToken value: ", firebaseToken);
      
      setFirebaseToken(firebaseToken);
      setUserAuth(true);
      console.log('Setting the user info from the SignIn component');
      setUserInfo(user);


      // At this point the user is authenticated and ready to access the private area of the application
      // We are checking if there is any intendedDestination provided by any component to resume his progress
      // of we should just take him to home / if this is the first login
      if (intendedDestination) {
        navigateToPage(intendedDestination);
      } else {
        navigateToPage("/");
      }
  
      if(user.userType == "admin") {
        setUserAdmin(true);
      }
  
      getNavBarProfilePicture(user);

      getUserListings(user);
    }

    const handleUserLogin = (user, token) => {
      if (user.isEmailVerified === 0) {
        triggerUserEmailIsNotVerified(user);
  
      } else if (user.profileStatus === "PASSWORD RESET") {
        triggerUserPasswordResetMode(user);
  
      } else if (user.isProfileComplete === 0) {
        triggerUserProfileCompletionWorkflow(user);
  
      } else {
        triggerSuccessLoginSteps(user, token);
      }
    };

    const login = async (e) => {
        console.log("Login started");
        e.preventDefault();
        setLoading(true);

        console.log("Sending WS /api/login request from frontend to backend");


        // const result = await signIn('credentials', {
        //   redirect: false, // Prevents automatic redirection
        //   emailAddress,
        //   password,
        // })
    
        setLoading(false)

          // Handle successful login (e.g., redirect to a dashboard)
          // console.log('Login successful:', result)
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailAddress, password }),
          });
  
          // Parse the response as JSON
          const responseData = await response.json();
          const { message, firebaseToken, user } = responseData;
          console.log("[/api/login] response returned: " , responseData);
            handleUserLogin(user, firebaseToken);
      };

      useEffect(() => {
        if (userAuth) {
          console.log('User info updated:', userInfo);
          localStorage.setItem('userInfo', encryptData(userInfo)); // encrypted userInfo
          console.log('userAuth value is: ' , userAuth);

   
        }
      }, [userInfo, userAuth]);

      function handleUserClickOnRegisterNow() {
        console.log("The user clicked on the button Register now");
        navigateToPage("/signup");
      }

      function handleUserClickResetYourPassword() {
        console.log("The user clicked on the button Reset your password");
        navigateToPage("/forgotPassword");
      }
    
      // if (!data) {
      //   return <div>Loading...</div>;
      // }

  return (
    <div>
      {/* <Helmet>
        <title>Login Roommatee | Search for Roommates and Rooms</title>
        <meta name="description" content="Roommatee | Search for Roommates and Rooms" data-rh="true"></meta>
        <meta name="description" content="This is a description of my page" />
        <meta name="keywords" content={keywords.join(', ')} />
        <link rel="canonical" href="/login" />
      </Helmet> */}

      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />


      <div className="row login-box-container">
        <div className="col-12 login-box">
          <form id="signInForm" onSubmit={login}>
            <div>
              <div className="title">
                <PasswordIcon style={iconStyle} />
                <h1 className="sign-in-heading">Sign In</h1>
              </div>

              {/* ----------------------------- EMAIL ADDRESS ----------------------------- */}

              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel htmlFor="emailAddress">Email Address</InputLabel>
                <OutlinedInput
                  required
                  autoFocus
                  id="emailAddress"
                  type="email"
                  label="Email Address"
                  onChange={(e) => {
                    setEmailAddress(e.target.value);
                  }}
                  inputProps={{ maxLength: 100 }}
                />
              </FormControl>

              {/* ----------------------------- PASSWORD ----------------------------- */}
              <FormControl sx={{ mt: 2, width: "100%" }} variant="outlined">
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
                  }}
                  inputProps={{ maxLength: 50 }}
                />
              </FormControl>

              {/* ---------------------- RECAPTCHA ----------------------*/}
              <div className='pt-3'>
                <ReCAPTCHA sitekey="6LdqU-cpAAAAAOvIqjHD1FaLAeiOVeTU8PQJilHA" onChange={(e) => setRecaptchaToken(e)} />
              </div>

              {loading ? (
                <CirculatorProgressLoader />
              ) : (
                <div className="pt-2">
                  <input
                    disabled={loading} 
                    type="submit"
                    value="Submit"
                    className={recaptchaToken ? 'submit-button' : 'submit-button-disabled'}
                    onClick={() =>
                      console.log("The user clicked on the Submit button")
                    }
                  />
                </div>
               )} 

              <div className="row already">
                <span>
                  Don't have an account yet?
                  <span
                    className="link-as-button-format"
                    onClick={() => handleUserClickOnRegisterNow()}
                  >
                    {" "}Register
                  </span>
                </span>
                <span className="pt-2">
                  Forget your password?
                  <span
                    className="link-as-button-format"
                    onClick={() => handleUserClickResetYourPassword()}
                  >
                    {" "}
                    Reset password
                  </span>
                </span>
              </div>
            </div>
          </form>
          <div className="login-status">
            <p>{loginStatus}</p>
          </div>
        </div>
        <FooterSimple />
      

      </div>

    </div>
  );
}

export default SignIn;