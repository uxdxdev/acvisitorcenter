import React, { useRef, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";
import ding from "../../ding.mp3";

export default function AlertDialog(props) {
  const { open, handleClose, code, getCode, isFetchingDodoCode } = props;

  const playerRef = useRef();

  useEffect(() => {
    const player = playerRef.current;
    open &&
      player.play().catch((error) => {
        //   console.log(error);
      });
    return () => {
      player.pause();
    };
  }, [open]);

  return (
    <div>
      <audio ref={playerRef} src={ding} loop="loop" />

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
          <DialogContentText align="center" variant="h2">
            {code}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
            }}
            variant="outlined"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              playerRef.current.pause();
              getCode();
            }}
            color="primary"
            variant="contained"
            autoFocus
            disabled={isFetchingDodoCode}
          >
            Get code
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
