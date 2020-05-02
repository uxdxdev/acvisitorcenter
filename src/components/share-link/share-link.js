import React, { useRef, useState } from "react";
import { Button, TextField, Box } from "@material-ui/core";
import { firebase } from "../../utils/firebase";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginRight: theme.spacing(1),
    },
  },
}));

const ShareLink = () => {
  const urlRef = useRef(null);
  const [buttonText, setButtonText] = useState("Share link");
  const handleCopy = () => {
    urlRef.current.select();
    document.execCommand("copy");
    setButtonText("Copied!");
    firebase.analytics().logEvent("share_link");
  };

  const classes = useStyles();

  return (
    <Box align="center">
      <TextField
        className={classes.root}
        // type="text"
        value={window.location.href}
        id="url"
        // size="small"
        // hidden/
        inputProps={{ ref: urlRef }}
        // ref={urlRef}
        onChange={() => {}}
      />

      <Button
        color="primary"
        variant="contained"
        size="small"
        onClick={() => handleCopy()}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default ShareLink;
