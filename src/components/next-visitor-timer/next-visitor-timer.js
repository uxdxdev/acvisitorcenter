import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { Typography } from "@material-ui/core";
import { store } from "../../store";

const NextVisitorTimer = () => {
  const context = useContext(store);
  const { state } = context;
  const {
    visitorCenter: { visitorCenterData: currentCenterData },
  } = state;

  const waitingList = currentCenterData?.waiting;

  const [prevVisitor, setPrevVisitor] = useState(null);
  const [currentVisitor, setCurrentVisitor] = useState(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (waitingList) {
      setPrevVisitor(String(currentVisitor));
      setCurrentVisitor(String(waitingList[0]?.uid));

      if (prevVisitor !== currentVisitor) {
        setSeconds(0);
      }
    }
  }, [waitingList, prevVisitor, currentVisitor]);

  const tick = () => {
    setSeconds((current) => current + 1);
  };

  useEffect(() => {
    let interval = null;
    if (waitingList?.length > 0) {
      interval = setInterval(tick, 1000);
    }
    return () => {
      interval && clearInterval(interval);
    };
  }, [waitingList]);

  const formatted = moment.utc(seconds * 1000).format("HH:mm:ss");

  return <Typography variant="subtitle1">Last update {formatted}</Typography>;
};

export default NextVisitorTimer;
