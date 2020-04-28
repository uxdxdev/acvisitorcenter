import React from "react";
import { CreateVisitorCenter } from "../../components/create-visitor-center";
import { LatestVisitorCenterList } from "../../components/latest-visitor-center-list";
import { Faq } from "../../components/faq";

const LandingPage = () => {
  return (
    <>
      <CreateVisitorCenter />
      <Faq />
      <LatestVisitorCenterList />
    </>
  );
};

export default LandingPage;
