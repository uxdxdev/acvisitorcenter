import React from "react";
import { WaitingList } from "../../components/waiting-list";
import { VisitorCenterInformation } from "../../components/visitor-center-information";

const VisitorCenter = () => {
  return (
    <>
      <VisitorCenterInformation />
      <WaitingList />
    </>
  );
};

export default VisitorCenter;
