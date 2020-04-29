import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";

export default function AlertDialog(props) {
  const { open, handleClose, code, getCode } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        paper={{ backgroundColor: "red" }}
      >
        <DialogTitle disableTypography>
          <Typography variant="h2" align="center">
            Your next in the queue!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText align="center">{code}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button
            onClick={getCode}
            color="primary"
            variant="contained"
            autoFocus
          >
            Get code
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
