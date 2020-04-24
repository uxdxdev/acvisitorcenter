import { useContext } from "react";
import { firebase } from "../../../utils/firebase";
import { store } from "../../../store";

const useCreateQueue = () => {
  const context = useContext(store);
  const {
    state: { uid, isCreatingQueue },
    dispatch,
  } = context;

  const createQueue = (name, summary, code) => {
    if (name && summary && code) {
      const db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp;

      dispatch({ type: "CREATE_QUEUE" });

      // add document to collection
      db.collection("queues")
        .add({
          name,
          owner: uid,
          createdAt: timestamp(),
          waiting: [],
          summary,
        })
        .then((result) => {
          dispatch({ type: "CREATE_QUEUE_SUCCESS", queueId: result.id });

          // update island code for queue
          db.collection("users")
            .doc(uid)
            .set({
              islandCode: code,
              next: "",
            })
            .then(() => {
              // success
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          dispatch({ type: "CREATE_QUEUE_FAIL", error });
        });
    } else {
      console.log("invalid data");
    }
  };

  return { createQueue, isCreatingQueue };
};

export default useCreateQueue;