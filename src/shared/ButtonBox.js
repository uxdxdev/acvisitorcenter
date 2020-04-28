import React from "react";
import { Box } from "@material-ui/core";

const ButtonBox = ({ children, ...rest }) => {
  return <Box {...rest}>{children}</Box>;
};

export default ButtonBox;
