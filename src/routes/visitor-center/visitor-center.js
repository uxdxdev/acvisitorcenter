import React from "react";
import WaitiingList from "../../components/waiting-list/waiting-list";
import VisitorCenterInformation from "../../components/visitor-center-information/visitor-center-information";

const VisitorCenter = () => {
  return (
    <>
      <VisitorCenterInformation />
      <WaitiingList />
    </>
  );
};

export default VisitorCenter;
