import React, { useRef, useContext } from "react";
import { firebase } from "../../utils/firebase";
import { store } from "../../store";

const CreateQueue = () => {
  const context = useContext(store);
  const {
    state: { uid, isCreatingQueue },
    dispatch,
  } = context;

  let nameRef = useRef();
  let summaryRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    let summary = event.target.summary.value;

    nameRef.current.value = "";
    summaryRef.current.value = "";

    if (name && summary) {
      const db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp;

      dispatch({ type: "CREATE_QUEUE" });

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
        })
        .catch((error) => {
          dispatch({ type: "CREATE_QUEUE_FAIL", error });
        });
    } else {
      console.log("invalid data");
    }
  };

  return (
    <div>
      <h2>Create queue</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input
            type="text"
            id="name"
            name="name"
            required
            ref={nameRef}
            maxLength="50"
          />
        </div>

        <div>
          <label htmlFor="summary">Summary</label>
          <br />
          <textarea
            id="summary"
            name="summary"
            required
            ref={summaryRef}
            rows="5"
            maxLength="1000"
          />
        </div>
        <div>
          <button type="submit" disabled={isCreatingQueue}>
            Create a queue
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQueue;
