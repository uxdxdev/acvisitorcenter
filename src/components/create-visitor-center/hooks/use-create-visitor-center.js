import { useContext } from "react";
import { firebase } from "../../../utils/firebase";
import { store } from "../../../store";

const useCreateVisitorCenter = () => {
  const context = useContext(store);
  const {
    state: { uid, isCreatingCenter },
    dispatch,
  } = context;

  const createCenter = (name, summary, code) => {
    if (name && summary && code) {
      const db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp;

      dispatch({ type: "CREATE_CENTER" });

      // add document to collection
      db.collection("centers")
        .add({
          name,
          owner: uid,
          createdAt: timestamp(),
          waiting: [],
          summary,
        })
        .then((result) => {
          dispatch({ type: "CREATE_CENTER_SUCCESS", centerId: result.id });

          db.collection("users")
            .doc(uid)
            .set({
              dodoCode: code,
              next: "",
            })
            .then(() => {
              // success
              console.log("updated island code in users/");
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          dispatch({ type: "CREATE_CENTER_FAIL", error });
        });
    } else {
      console.log("invalid data");
    }
  };

  return { createCenter, isCreatingCenter };
};

export default useCreateVisitorCenter;
