"use client";

import PasswordIcon from "@mui/icons-material/Password";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { SiteData } from "../../context/SiteWrapper";
import "../../styles/Signup.css"
// import BackendAxios from "../../backend/BackendAxios";
import StaticFrontendLabel from "../../StaticFrontend";
import PasswordPolicy from "./PasswordPolicy";
import { useRouter } from 'next/navigation';

const ResetPasswordLogin = () => {
  // @ts-ignore
  const { emailAddressToReset } = SiteData();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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

  function bothPasswordsMatch() {
    return password === confirmPassword;
  }
  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };

  // @ts-ignore
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!bothPasswordsMatch()) {
      console.log(StaticFrontendLabel.ERR_PASSWORD_DO_NOT_MATCH);
      setErrorMessage(StaticFrontendLabel.ERR_PASSWORD_DO_NOT_MATCH);
      return;
    } else {
      setErrorMessage("");
    }

    const response = await fetch("/api/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddressToReset, password }), // Send the parameters in the request body
        cache: 'no-store' // Ensures the data is fetched on every request
      });
      const data = await response.json();
    //   return data;

    if (response.status === 200) {
        window.alert('changed!'); //TODO add success snack bar
        navigateToPage('/login');
      } else {
        window.alert('nayyik!') //TODO add success snack bar
      }
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
          <div className="title">
            <PasswordIcon style={iconStyle} />
            <h1 className="sign-in-heading">Change Password</h1>
          </div>


          <form id="signInForm" onSubmit={handleChangePassword}>
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
              />
            </FormControl>


            <FormControl sx={{ mt: 2, width: "100%" }} variant="outlined">
              <InputLabel htmlFor="confirmPassword">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                required
                id="confirmPassword"
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
                label="Confirm Password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </FormControl>

            <PasswordPolicy password={password} onValidationChange={handleValidationChange}/>

            <p className="login-status mt-2">{errorMessage}</p>

            <div className="pt-2">
              <input
                disabled={!isPasswordValid}
                type="submit"
                value="Submit"
                className="submit-button"
                onClick={() =>
                  console.log(
                    "The user clicked on the Submit button at Change Password"
                  )
                }
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordLogin;
