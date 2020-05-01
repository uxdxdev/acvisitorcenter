import { useContext } from "react";

import { store } from "../../../store";

const useWaitingListStatus = () => {
  const context = useContext(store);
  const {
    state: {
      visitorCenter: { onlineStatus, visitorCenterData },
    },
  } = context;

  const gatesOpen = visitorCenterData?.gatesOpen;
  const isOwnerOnline = onlineStatus === "online";
  const isQueueUnlocked = isOwnerOnline && gatesOpen;

  return {
    isQueueUnlocked,
  };
};

export default useWaitingListStatus;
