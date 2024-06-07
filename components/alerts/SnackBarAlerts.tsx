import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

interface SnackBarAlertProps {
  message: string;
  open: boolean;
  handleClose: () => void;
  severity: "success" | "error" | "warning" | "info";
}

const SnackBarAlert: React.FC<SnackBarAlertProps> = ({
  message,
  open,
  handleClose,
  severity,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBarAlert;
