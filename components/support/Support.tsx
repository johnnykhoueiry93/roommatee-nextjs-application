"use client";

import React from "react";
import "../../styles/support/Support.css";
import SupportActionBar from "./SupportActionBar";
import SupportTickets from "./SupportTickets";
import { SiteData } from "../../context/SiteWrapper";
import SnackBarAlert from "../alerts/SnackBarAlerts";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import MessageComponentLoader from "../loaders/MessageComponentLoader";

const Support = () => {
  //@ts-ignore
  const { userInfo, userAuth, snackbarOpen, setSnackbarOpen, snackbarMessage, snackbarSeverity, supportTicketsUpdate,  setSupportTickets, supportTickets, setIntendedDestination} = SiteData();

  const router = useRouter();

  const navigateToPage = (path) => {
    router.push(path);
  };
  
  useEffect(() => {
    if (!userAuth) {
      setIntendedDestination('/support');
      navigateToPage("/login");
    } 
  }, []);

  const [loading, setLoading] = useState(true); // Add loading state

  async function fetchSupportTickets() {
    if (userInfo) {
      try {
        const response = await fetch("/api/getSupportTickets", {
          method: "POST",
          body: JSON.stringify({ userId: userInfo.id, userType: userInfo.userType, emailAddress: userInfo.emailAddress }),
          cache: 'no-store'
        });
      
        if (!response.ok) {
          throw new Error('Network response was not ok' + response.statusText);
        }
      
        const data = await response.json();
        console.log('tickets: ' , data.data);
        if (response.status == 200) {
          console.log('Setting the user support tickets in userSupportTickets')
          setSupportTickets(data.data);
          localStorage.setItem("userSupportTickets", JSON.stringify(data.data));
          // console.log('[DEBUG] - Stored in localStorage:', localStorage.getItem("userSupportTickets"));
        } else {
          console.error("Error room listing: " + data.message);
        }
      } catch (error) {
        // Handle the error here
        console.error("Error:", error);
      }  finally {
        setLoading(false); // Update loading state after fetching
      }
    }
  }

  useEffect(() => {
    fetchSupportTickets();
  }, [supportTicketsUpdate]);

  useEffect(() => {
    console.log('Support component loaded')
    fetchSupportTickets();
  }, []);

  useEffect(() => {
    console.log('Support tickets state:', supportTickets);
  }, [supportTickets]);

  if (loading) {
    return <div><MessageComponentLoader loadingMessage={"Loading support tickets..."}/></div>; // Render loading message while fetching
  }

  function returnSupportTickets() {
    if (!supportTickets || supportTickets.length === 0) {
      return <div>No support tickets available.</div>; // Render message if no support tickets are found
    } else {
      return (<>
        <SupportTickets />
      </>)
    }
  }

  return (
    <>
      <SnackBarAlert
        message={snackbarMessage}
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />

      <div className="pt-3">
        <SupportActionBar />
      </div>

      <div className="pt-3">
        {returnSupportTickets()}
      </div>
    </>
  );
};

export default Support;
