import React from "react";
import { CreateQueue } from "../../components/create-queue";
import { LatestQueues } from "../../components/latest-queues";

const Homepage = () => {
  return (
    <>
      <CreateQueue />
      <LatestQueues />
    </>
  );
};

export default Homepage;
