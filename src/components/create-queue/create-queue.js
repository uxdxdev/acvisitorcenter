import React, { useRef } from "react";
import { useCreateQueue } from "./hooks";

const CreateQueue = () => {
  const { isCreatingQueue, createQueue } = useCreateQueue();

  let nameRef = useRef();
  let summaryRef = useRef();
  let codeRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    let summary = event.target.summary.value;
    let code = event.target.code.value;

    nameRef.current.value = "";
    summaryRef.current.value = "";
    codeRef.current.value = "";

    createQueue(name, summary, code);
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
          <label htmlFor="code">Code</label>
          <br />
          <input
            type="text"
            id="code"
            name="code"
            required
            ref={codeRef}
            maxLength="10"
            style={{ textTransform: "uppercase" }}
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
