import React from "react";
import { CreateVisitorCenter } from "../../components/create-visitor-center";
import { LatestVisitorCenterList } from "../../components/latest-visitor-center-list";

const LandingPage = () => {
  return (
    <>
      <CreateVisitorCenter />
      <LatestVisitorCenterList />
    </>
  );
};

export default LandingPage;