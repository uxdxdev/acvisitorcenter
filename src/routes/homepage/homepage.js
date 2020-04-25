import React from "react";
import { CreateVisitorCenter } from "../../components/create-visitor-center";
import { LatestQueues } from "../../components/latest-queues";

const Homepage = () => {
  return (
    <>
      <CreateVisitorCenter />
      <LatestQueues />
    </>
  );
};

export default Homepage;
