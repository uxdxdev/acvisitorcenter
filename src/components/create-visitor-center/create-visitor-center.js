import React, { useRef } from "react";
import { useCreateVisitorCenter } from "./hooks";

const CreateVisitorCenter = () => {
  const { isCreatingQueue, createQueue } = useCreateVisitorCenter();

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
      <h2>Create visitor center</h2>
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
          <label htmlFor="code">Island code</label>
          <br />
          <input
            type="text"
            id="code"
            name="code"
            required
            ref={codeRef}
            maxLength="10"
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
            Create visitor center
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVisitorCenter;
