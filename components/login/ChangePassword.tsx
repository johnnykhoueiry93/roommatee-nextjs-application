"use client";

import "../../styles/ChangePassword.css";
import ProfileComponentTitle from "../myProfile/ProfileComponentTitle";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, useRef } from "react";
import { SiteData } from "../../context/SiteWrapper";
import PasswordPolicy from "./PasswordPolicy";
import SnackBarAlert from "../alerts/SnackBarAlerts";
import bcrypt from "bcryptjs";
import { useRouter } from 'next/navigation';

const ChangePassword = () => {
  // @ts-ignore
  const { userInfo } = SiteData();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPasswordBorder, setCurrentPasswordBorder] = useState("");
  const [newPasswordBorder, setNewPasswordBorder] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };
  const saltRounds = 10;

  // ---------------------------------------------------------- SNACK BAR
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  // ---------------------------------------------------------- SNACK BAR

  //@ts-ignore
  const comparePasswords = async (plainPassword, hashedPassword) => {
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      // console.log('Passwords Match:', isMatch);
    } catch (error) {
      console.error("Error comparing passwords:", error);
    }

    return isMatch;
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  function bothPasswordsMatch() {
    return password === confirmPassword;
  }

  // this function will verify if the current password actually matches the current password
  async function isCurrentPasswordCorrect() {
    try {
      const passwordMatch = await comparePasswords(
        currentPassword,
        userInfo.password
      );

      if (passwordMatch) {
        console.log('[DEBUG] - The entered password matches the current password; can continue');
        return true;
      } else {
        console.log('[DEBUG] - The entered password DOES NOT match the current password; cannot continue');
        return false;
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return false;
    }
  }

    // Create a ref for the form
    const formRef = useRef(null);

    // Reset the form
    const resetForm = () => {
      if (formRef.current) {
        //@ts-ignore
        formRef.current.reset();
      }
    };

  // @ts-ignore
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!(await isCurrentPasswordCorrect())) {
      setErrorMessage("Current password does not match.");
      setCurrentPasswordBorder("highlight-border");
      return;
    } else {
      setCurrentPasswordBorder("");
      setErrorMessage("");
    }

    if (!bothPasswordsMatch()) {
      setErrorMessage("Passwords do not match");
      setNewPasswordBorder("highlight-border");
      return;
    } else {
      setErrorMessage("");
      setNewPasswordBorder("");
    }

    try {
        let emailAddress = userInfo.emailAddress;
        const response = await fetch("/api/changePassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emailAddress, password }), // Send the parameters in the request body
          cache: 'no-store' // Ensures the data is fetched on every request
        });
    
        const data = await response.json();
    
      if (response.status === 200) {
          console.log(`Sucessfully updated he password`);
          setSnackbarMessage("Password updated successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          resetForm();
        } else {
          console.log(`User with email: ${emailAddress} was not found. Showing error message`);
          setSnackbarMessage("Failed to update password");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setSnackbarMessage("Failed to update password");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.log(errorMessage);
    }
  }

  const [isPasswordValid, setIsPasswordValid] = useState(false);

  //@ts-ignore
  const handleValidationChange = (isValid) => {
    console.log("Password validation:", isValid);
    setIsPasswordValid(isValid);
  };



  return (
    <div className="mt-3 container change-password-container">
      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />

      <ProfileComponentTitle title={"Change Password"} />

      <div className="inner-container">
        <form ref={formRef} id="signInForm" onSubmit={handleChangePassword}>
          {/* ---------------------------------- CURRENT PASSWORD ---------------------------------- */}
          <FormControl sx={{ mt: 2, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="password">Current Password</InputLabel>
            <OutlinedInput
              className={currentPasswordBorder}
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
              label="Current Password"
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
            />
          </FormControl>

          {/* ---------------------------------- NEW PASSWORD ---------------------------------- */}
          <FormControl sx={{ mt: 2, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="password">New Password</InputLabel>
            <OutlinedInput
              className={newPasswordBorder}
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
              label="New Password"
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </FormControl>

          {/* ---------------------------------- CONFIRM NEW PASSWORD ---------------------------------- */}
          <FormControl sx={{ mt: 2, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="confirmPassword">
              Confirm New Password
            </InputLabel>
            <OutlinedInput
              className={newPasswordBorder}
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
              label="Confirm New Password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </FormControl>

          <PasswordPolicy
            password={password}
            onValidationChange={handleValidationChange}
          />

          <p className="login-status mt-4">{errorMessage}</p>

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
  );
};

export default ChangePassword;
