"use client";
import "../styles/Signup.css";
import { SiteData } from "../context/SiteWrapper";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PasswordIcon from "@mui/icons-material/Password";
// import FooterSimple from "../FooterSimple";
import CirculatorProgressLoader from "../components/loaders/CirculatorProgressLoader";
import { encryptData, decryptData } from '../utils/encryptionUtils';
// import ReCAPTCHA from 'react-google-recaptcha';
import React, { useEffect, useState } from "react";
// import BackendAxios from "../../backend/BackendAxios";
import Link from "next/link";
import { useRouter } from 'next/navigation';



const SignIn = () => {
    // @ts-ignore
  const { setUserAdmin, userAuth, userInfo, setUserAuth, intendedDestination, setUserProfilePicture, setFirebaseToken, setEmailAddressToReset, setSupportTickets, setUserInfo, setListing, setSignUpEmail, setUserProfileSetupComplete} = SiteData();
  const [loginStatus, setLoginStatus] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const [loading, setLoading] = useState(false);
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
      return user && user[0] && user[0].firstName;
    };

      //@ts-ignore
  function triggerUserEmailIsNotVerified(user) {
    setUserAuth(false);
    setLoginStatus( "Your email is not yet verified. Please verify your email to proceed."
    );
    console.log( "Your email is not yet verified. Please verify your email to proceed."
    );
    setSignUpEmail(user[0].emailAddress);
    // navigate("/emailVerification");
  }

    // @ts-ignore
    function triggerUserPasswordResetMode(user) {
      setUserAuth(false);
      setEmailAddressToReset(user[0].emailAddress);
      // navigate("/resetPassword");
    }

      //@ts-ignore
  function triggerUserProfileCompletionWorkflow(user) {
    console.log("Starting the complete user profile workflow");
    setLoginStatus(user[0].firstName);
    setUserInfo(user);
    setUserAuth(true);
    // navigate("/setup");
  }

    //@ts-ignore
    async function triggerSuccessLoginSteps(user, firebaseToken) {
      console.log('we are in triggerSuccessLoginSteps'); 

      // const key = `${user[0].id}-profile-picture.png?folder=profile-picture`;
      // setLoginStatus(user[0].firstName);
      
      // setUserInfo(user);
      // console.log('!!!!!!',userInfo);
      
  
      // if(user[0].userType == "admin") {
      //   setUserAdmin(true);
      // }
  
      // BackendAxios.post(`/getS3PictureUrl/${key}`)
      //   .then((response) => {
      //     console.log(
      //       "Setting the user profile picture to URL: " + response.data.s3Url
      //     );
      //     setUserProfilePicture(response.data.s3Url);
  
      //     console.log(
      //       "setting in storage userProfilePicture: " + response.data.s3Url
      //     );
  
      //     // Move the localStorage update inside the promise resolution

  
      //     localStorage.setItem("userProfilePicture", JSON.stringify(response.data.s3Url));
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //   });
      // // }
  
      // BackendAxios.post("/getUserListings", {
      //   userProfileId: user[0].id,
      // }).then((listingResponse) => {
      //   console.log(listingResponse.data);
      //   setListing(listingResponse.data);
      // });
  
      // await getUserSupportTickets(user);
  
      // At this point the user is authenticated and ready to access the private area of the application
      // We are checking if there is any intendedDestination provided by any component to resume his progress
      // of we should just take him to home / if this is the first login
      // if (intendedDestination) {
      //   navigate(intendedDestination);
      // } else {

      

      // }
    }

      // @ts-ignore
  const handleUserLogin = (user, firebaseToken) => {
    // if (user[0].isEmailVerified === 0) {
    //   triggerUserEmailIsNotVerified(user);

    // } else if (user[0].profileStatus === "PASSWORD RESET") {
    //   triggerUserPasswordResetMode(user);

    // } else if (user[0].isProfileComplete === 0) {
    //   triggerUserProfileCompletionWorkflow(user);

    // } else {
      triggerSuccessLoginSteps(user, firebaseToken);

      setFirebaseToken(firebaseToken);
      setUserAuth(true);
      setUserInfo(user);


      console.log('I am here 3')
      console.log('Navigating to /protected')

      navigateToPage('/protected');
      // Set a cookie or local storage item to track authentication status
      // document.cookie = 'userAuth=true; path=/';
      // router.push('/protected-page'); // Redirect to a protected page
    // }
  };

    const login = async (e) => {
        console.log("Login started");
        e.preventDefault();
        setLoading(true);

        console.log("Sending WS /api/login request from frontend to backend");
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailAddress, password }),
        });

        // Parse the response as JSON
        const responseData = await response.json();
        console.log("[/api/login] response returned: " , responseData);

        const { message, firebaseToken, user } = responseData;

          if (message) {
            // LOGIN FAILED
            setLoginStatus(message);
            setUserAuth(false);
          } else {
            // LOGIN SUCCESS

            console.log("[/api/login] login was success: " , responseData);
            console.log("[/api/login] - user value:", user);
            console.log("[/api/login] firebaseToken value: ", firebaseToken);

            console.log("[/api/login] setting setUserInfo with value: ", user);
            setUserInfo(user);
    
            console.log('[/api/login] - I am here 1 : ' , userInfo);
            // if (isUserValid(user)) {
              console.log('I am here 2')
              handleUserLogin(user, firebaseToken);
            // }

                   // Perform other actions like navigating to /protected
          navigateToPage('/protected');
          }
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
        // navigate("/signup");
      }

      function handleUserClickResetYourPassword() {
        console.log("The user clicked on the button Reset your password");
        // navigate("/forgotPassword");
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
                {/* @ts-ignore */}
                {/* <ReCAPTCHA sitekey="6LdqU-cpAAAAAOvIqjHD1FaLAeiOVeTU8PQJilHA" onChange={(e) => setRecaptchaToken(e)} /> */}
              </div>

              {/* {loading ? (
                <CirculatorProgressLoader />
              ) : ( */}
                <div className="pt-2">
                  <input
                    // disabled={loading || !recaptchaToken} //TODO
                    type="submit"
                    value="Submit"
                    className="submit-button"
                    onClick={() =>
                      console.log("The user clicked on the Submit button")
                    }
                  />
                </div>
              {/* )} */}

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
      </div>
      {/* <FooterSimple /> */}

    </div>
  );
}

export default SignIn;