import { useContext } from "react";
import { store } from "../store";

const useUser = () => {
  const context = useContext(store);
  const {
    state: {
      auth: { uid },
    },
  } = context;

  return { uid };
};

export default useUser;
