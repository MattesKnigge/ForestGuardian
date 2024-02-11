import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";
export default function withSnackbar(WrappedComponent) {
  return function WithSnackbar(props) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("info");

    const handleClose = () => {
      setOpen(false);
    };

    const showMessage = (message, severity = "info") => {
      setMessage(typeof message === "string" ? message : "Internal error");
      setSeverity(severity);
      setOpen(true);
    };

    return (
      <>
        <WrappedComponent {...props} showMessage={showMessage} />
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
        >
          <Alert onClose={handleClose} severity={severity}>
            {message}
          </Alert>
        </Snackbar>
      </>
    );
  };
}
