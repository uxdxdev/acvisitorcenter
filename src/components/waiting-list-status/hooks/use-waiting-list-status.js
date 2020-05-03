import { useContext } from "react";

import { store } from "../../../store";

const useWaitingListStatus = () => {
  const context = useContext(store);
  const {
    state: {
      visitorCenter: { onlineStatus, gatesOpen },
    },
  } = context;

  const isOwnerOnline = onlineStatus === "online";
  const isQueueUnlocked = isOwnerOnline && gatesOpen;

  return {
    isQueueUnlocked,
  };
};

export default useWaitingListStatus;
