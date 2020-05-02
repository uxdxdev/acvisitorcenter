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
  const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);
  const handleCopy = () => {
    urlRef.current.select();
    document.execCommand("copy");
    setIsCopiedToClipboard(true);
    firebase.analytics().logEvent("share_link");
  };

  const classes = useStyles();

  return (
    <Box align="center">
      <TextField
        className={classes.root}
        value={window.location.href}
        id="url"
        inputProps={{ ref: urlRef, readOnly: true }}
      />

      <Button
        color="primary"
        variant="contained"
        size="small"
        onClick={() => handleCopy()}
      >
        {isCopiedToClipboard ? "Copied!" : "Share link"}
      </Button>
    </Box>
  );
};

export default ShareLink;
