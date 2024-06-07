"use client";

import {
    FC,
    useEffect,
    useRef,
    KeyboardEvent,
    useState,
    FormEvent,
    FocusEvent,
    useCallback,
  } from "react";
  import { Input, Link, Stack, styled } from "@mui/material";
  import * as yup from "yup";
  import { LoadingButton } from "@mui/lab";
  import { SiteData } from "../../context/SiteWrapper";
  import "../../styles/EmailVerification.css";
//   import BackendAxios from "../backend/BackendAxios";
  import SnackBarAlert from "../alerts/SnackBarAlerts";
  import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
  import Button from "@mui/material/Button";
  import StaticFrontendLabel from "../../StaticFrontend";
  import { useRouter } from 'next/navigation';
  

  const VerificationInput = styled(Input)(({ theme }) => ({
    width: "2rem",
    fontSize: "1.4rem",
    fontWeight: "600",
    color: theme.palette.secondary.main,
    input: { textAlign: "center " },
    // hide arrows
    appearance: "textfield",
    "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
      appearance: "none",
      margin: 0,
    },
  }));
  
  type InputOrNull = HTMLInputElement | null;
  
  interface Props {
    title: string;
    email: string;
    length?: number;
  }
  
  const schema = yup
    .array()
    .required()
    .of(yup.number().required())
    .when("$length", (len, schema) => {
      // @ts-ignore
      if (len) return schema.length(len);
      else return schema;
    });
  
  const EmailVerification: FC<Props> = ({ title, email, length = 6 }) => {
    // @ts-ignore
    const { signUpEmail, setUserEmailVerified, snackbarOpen, setSnackbarOpen, snackbarMessage, setSnackbarMessage, snackbarSeverity, setSnackbarSeverity } = SiteData();
    const RESEND_BUTTON_TIMER_DELAY = StaticFrontendLabel.RESEND_BUTTON_TIMER_DELAY;
  
    const router = useRouter();
    const navigateToPage = (path) => {
    router.push(path);
    };

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false);
    const [verificationServerResponse, setVerificationServerResponse] =
      useState(null);
    const [code, setCode] = useState<string[]>(Array(length).fill(""));
    const update = useCallback((index: number, val: string) => {
      return setCode((prevState) => {
        const slice = prevState.slice();
        slice[index] = val;
        return slice;
      });
    }, []);
  
  
    const formRef = useRef<HTMLFormElement>(null);
  
    function handleKeyDown(evt: KeyboardEvent<HTMLInputElement>) {
      const index = parseInt(evt.currentTarget.dataset.index as string);
      const form = formRef.current;
      if (isNaN(index) || form === null) return; // just in case
  
      const prevIndex = index - 1;
      const nextIndex = index + 1;
      const prevInput: InputOrNull = form.querySelector(`.input-${prevIndex}`);
      const nextInput: InputOrNull = form.querySelector(`.input-${nextIndex}`);
      switch (evt.key) {
        case "Backspace":
          if (code[index]) update(index, "");
          else if (prevInput) prevInput.select();
          break;
        case "ArrowRight":
          evt.preventDefault();
          if (nextInput) nextInput.focus();
          break;
        case "ArrowLeft":
          evt.preventDefault();
          if (prevInput) prevInput.focus();
      }
    }
  
    function handleChange(evt: FormEvent<HTMLInputElement>) {
      const value = evt.currentTarget.value;
      const index = parseInt(evt.currentTarget.dataset.index as string);
      const form = formRef.current;
      if (isNaN(index) || form === null) return; // just in case
  
      let nextIndex = index + 1;
      let nextInput: InputOrNull = form.querySelector(`.input-${nextIndex}`);
  



      update(index, value[0] || "");
      if (value.length === 1) nextInput?.focus();
      else if (index < length - 1) {
        const split = value.slice(index + 1, length).split("");
        split.forEach((val) => {
          update(nextIndex, val);
          nextInput?.focus();
          nextIndex++;
          nextInput = form.querySelector(`.input-${nextIndex}`);
        });
      }
    }
  
    function handleFocus(evt: FocusEvent<HTMLInputElement>) {
      evt.currentTarget.select();
    }
  
    useEffect(() => {
      // check validity if form has been submitted
      if (isSubmitted) {
        try {
          setIsValid(schema.isValidSync(code, { context: { length } }));
        } catch (e) {}
      }
    }, [code]); // eslint-disable-line
  
    /**
     * Verify the code from backend
     */
  
     const handleResendEmail = async () => {
      console.log("The user clicked on the email verification resend button");


      const response = await fetch("/api/resendVerificationToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddress: signUpEmail }), // Send the parameters in the request body
        cache: 'no-store' // Ensures the data is fetched on every request
      });

      const data = await response.json();

    if (response.status === 200) {
        console.log(`Sucessfully resent the email verification again`);
      } else {
        // handleFailedVerificationCode(data.message);
        console.log(`User with email: ${signUpEmail} was not found. Showing error message`);
      }



  
    //   BackendAxios.post("/resendVerificationToken", {
    //     emailAddress: signUpEmail
    //   }).then((response) => {
    //     console.log(response.data);
  
    //     // Invalid Token
    //     if (response.data.message) {
    //       handleFailedVerificationCode(response.data.message);
    //     } else {
    //       // Valid Token
    //       if (response.data[0]) {
    //         handleSuccessVerificationCode();
    //       }
    //     }
    //   });
  
      setDisabled(true);
      setTimer(RESEND_BUTTON_TIMER_DELAY); // Reset timer
      startTimer();
    };
  
    //@ts-ignore
    const handleFailedVerificationCode = (message) => {
      setVerificationServerResponse(message);
      setIsVerificationCodeValid(false);
      setUserEmailVerified(false);
  
      // Set Snackbar state
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.log(message);
    }
    
    //@ts-ignore
    const handleSuccessVerificationCode = () => {
      setIsVerificationCodeValid(true);
      setVerificationServerResponse(null);
      setUserEmailVerified(true);
      console.log("Verification success");
  
      // Set Snackbar state
      setSnackbarMessage("Success! Your email is now verified!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
  
      navigateToPage('/login');
    }
  
    // @ts-ignore
    const handleSubmit = async (e) => {
      e.preventDefault();
      // Remove commas and convert the string to a number
      const codeAsInt = parseInt(code.join(""), 10);
  
      console.log(
        `The user clicked on button confirm to confirm the code with value: ${codeAsInt}`
      );

      const response = await fetch("/api/verifyCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddress: signUpEmail, verificationCode: codeAsInt }), // Send the parameters in the request body
        cache: 'no-store' // Ensures the data is fetched on every request
      });

      const data = await response.json();

    if (response.status === 200) {
        console.log(`User with email: ${signUpEmail} was found. Redirecting user to  /resetInstructions`);
        navigateToPage('/login');
        handleSuccessVerificationCode();
      } else {
        handleFailedVerificationCode(data.message);
        console.log(`User with email: ${signUpEmail} was not found. Showing error message`);
      }

    };
  
    const [disabled, setDisabled] = useState(false);
    const [timer, setTimer] = useState<number | null>(null);
  
    const startTimer = () => {
      let timeLeft = RESEND_BUTTON_TIMER_DELAY; // 120 seconds = 2 minutes
  
      const intervalId = setInterval(() => {
        setTimer(timeLeft);
        timeLeft--;
  
        if (timeLeft < 0) {
          clearInterval(intervalId);
          setTimer(null);
          setDisabled(false);
        }
      }, 1000); // Update timer every second
    };
  
    useEffect(() => {
      if (timer === null) {
        console.log("Timer stopped or not started yet");
      } else {
        console.log("Timer:", timer);
      }
    }, [timer]);
  
    return (
      <div
        component="form"
        // @ts-ignore
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        bgcolor="white"
        py={5}
        px={{ xs: 2.5, md: 5.5 }}
        borderRadius="16px"
        boxShadow={3}
        className="activate-account-primary-box"
      >
        <SnackBarAlert
          message={snackbarMessage}
          open={snackbarOpen}
          handleClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        />
  
        <div className="email-verification-box">
          {/* ---------------------------- TITLE ----------------------------*/}
          <div>
            <h1>Activate Account</h1>
            <p className="email-was-sent-to">
              An email with a verification code was sent to: {signUpEmail}
            </p>
          </div>
  
          {/* ---------------------------- 6 DIGITS ----------------------------*/}
          <div>
            <Stack
              component={"fieldset"}
              border={"none"}
              direction={"row"}
              spacing={1.4}
              justifyContent={"center"}
            >
              {code.map((value, i) => (
                <VerificationInput
                  key={i}
                  value={value}
                  error={isSubmitted && !isValid}
                  inputProps={{
                    type: "number",
                    className: `input-${i}`,
                    "aria-label": `Number ${i + 1}`,
                    "data-index": i,
                    pattern: "[0-9]*",
                    inputtype: "numeric",
                    onChange: handleChange,
                    onKeyDown: handleKeyDown,
                    onFocus: handleFocus,
                  }}
                />
              ))}
            </Stack>
          </div>
  
          {/* ---------------------------- CONFIRMATION BUTTON ----------------------------*/}
          <div
            style={
              // @ts-ignore
              { "padding-top": "30px" }
            }
          >
            <LoadingButton
              type="submit"
              size="large"
              variant="contained"
              sx={{ paddingX: (theme) => theme.spacing(8) }}
              onClick={handleSubmit}
            >
              {"confirm"}
            </LoadingButton>
          </div>
  
          {/* ---------------------------- SERVER RESPONSE ----------------------------*/}
          <p className="server-code-verification-response">
            {verificationServerResponse}
          </p>
  
          {/* ---------------------------- DIDNT RECEIVE THE CODE ----------------------------*/}
          <div style={{ paddingTop: '30px' }}>
        Didn't receive the code?{' '}
        <Button
          className="resend-verification-email-btn"
          onClick={handleResendEmail}
          disabled={disabled}
        >
          {disabled ? `Resend (${timer} seconds)` : 'Resend'}
        </Button>
      </div>
        </div>
      </div>
    );
  };
  
  export default EmailVerification;
  