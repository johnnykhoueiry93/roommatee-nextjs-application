"use client";

import React from "react"; 
import "../../styles/support/CreateTicket.css";
import { useRouter } from 'next/navigation';
import ProfileComponentTitle from "../myProfile/ProfileComponentTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { SiteData } from "../../context/SiteWrapper";
import BackToResultsBtn from "../modals/BackToResultsBtn";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

const CreateTicket = () => {
  //@ts-ignore
  const { userInfo, setSupportTicketsUpdate, snackbarOpen, setSnackbarOpen, snackbarMessage, setSnackbarMessage, snackbarSeverity, setSnackbarSeverity } = SiteData();

  if(!userInfo) {
    return (<div>
      Loading userInfo at CreateTicket
    </div>)
  }

  const router = useRouter();
const navigateToPage = (path) => {
  router.push(path);
};

  const [ticketData, setTicketData] = useState({
    subject: "",
    caseArea: "",
    description: "",
    userProfileId: userInfo.id,
    emailAddress: userInfo.emailAddress,
    firstName: userInfo.firstName,
  });

  //@ts-ignore
  const handleSubmitTicket = async (e) => {
    //@ts-ignore
    e.preventDefault();
    console.log("The user clicked on the Submit Ticket button: " , ticketData);

    try {
      const response = await fetch("/api/createTicket", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ticketData }),
        cache: 'no-store'
      });
    
      console.log('Response status:', response.status);
      console.log('Response OK:', response.ok);
    
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
    
      const data = await response.json();
      console.log('Ticket details: ', data.data);
    
      if (response.status === 200) {
        console.log('Setting the user support tickets in userSupportTickets');
        setSupportTicketsUpdate((prevCount) => prevCount + 1); // this is to ensure that supportTicketsUpdate which is listened to by a useEffect to fetch again all support tickets if the user adds a new one
        localStorage.setItem("userSupportTickets", JSON.stringify(data.data));
        console.log('Stored in localStorage:', localStorage.getItem("userSupportTickets"));
        setSnackbarMessage("Success! Support ticket submitted");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to create support ticket");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      // Handle the error here
      window.alert(`Error: ${error}`);
      console.error('Fetch error:', error);
    }

    navigateToPage("/support");

  };


  return (
    <div className="container support-container mt-3">

    <BackToResultsBtn prevPage={"/support"} text={"Back to tickets"} />


      <ProfileComponentTitle title={"Create Ticket"} />
      <form id="signInForm" onSubmit={handleSubmitTicket}>
        <div>
          {/* ----------------------------- SUBJECT ----------------------------- */}
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel htmlFor="subject">Subject</InputLabel>
            <OutlinedInput
              required
              autoFocus
              id="subject"
              type="txt"
              label="Subject"
              onChange={(e) =>
                setTicketData({
                  ...ticketData,
                  subject: e.target.value,
                })
              }
            />
          </FormControl>




          <div className='pt-3'>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Issue Area</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Issue Area"
              onChange={(e) =>
                setTicketData({
                  ...ticketData, //@ts-ignore
                  caseArea: e.target.value,
                })
              }
            >
              <MenuItem value={"Application Bug"}>Application Bug</MenuItem>
              <MenuItem value={"System Slowness"}>System Slowness</MenuItem>
              <MenuItem value={"Can't create new listing"}>Can't create new listing</MenuItem>
              <MenuItem value={"Can't list my profile"}>Can't list my profile</MenuItem>
              <MenuItem value={"Unable to search for properties"}>Unable to search for properties</MenuItem>
              <MenuItem value={"Chat system not functionning"}>Chat system not functionning</MenuItem>
              <MenuItem value={"Other"}>Other</MenuItem>
            </Select>
          </FormControl>
        </div>
       
          {/* ----------------------------- DESCRIPTION ----------------------------- */}
          <div className="pt-3 ml-auto">
            <TextField
              required
              id="outlined-multiline-flexible"
              label="Issue description"
              inputProps={{
                maxLength: 1000,
                style: { height: "150px" },
              }}
              multiline
              maxRows={4}
              placeholder="Your Message"
              variant="outlined"
              className="input-width"
              style={{ width: "100%" }}
              onChange={(e) =>
                setTicketData({
                  ...ticketData,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="pt-3 ml-auto">
          <Button variant="contained" type="submit">
            Submit Ticket
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
