import React from "react";
import "../../styles/support/Support.css";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

const SupportActionBar = () => {
  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };

  function handleSubmitTicketClick() {
    console.log("The user clicked on Submit Ticket button");
    navigateToPage("/createTicket");
  }

  return (
    <div className="container support-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>Ticket List</div>
        <Button variant="contained" onClick={handleSubmitTicketClick}>
          New Ticket
        </Button>
      </div>
    </div>
  );
};

export default SupportActionBar;
