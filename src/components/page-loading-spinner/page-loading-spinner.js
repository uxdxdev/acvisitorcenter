import React from "react";
import { Box, CircularProgress } from "@material-ui/core";

const PageLoadingSpinner = (props) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" {...props}>
      <CircularProgress />
    </Box>
  );
};

export default PageLoadingSpinner;
