import React from "react";
import { useVisitorCenterStatus } from "./hooks";

const VisitorCenterStatus = () => {
  const { isVisitorCenterOpen } = useVisitorCenterStatus();
  return <h2>{isVisitorCenterOpen ? "Open" : "Closed"}</h2>;
};

export default VisitorCenterStatus;
