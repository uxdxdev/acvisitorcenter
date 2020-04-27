import React, { useRef } from "react";
import { useCreateVisitorCenter } from "./hooks";
import { Link } from "react-router-dom";

const CreateVisitorCenter = () => {
  const {
    handleCreateVisitorCenter,
    visitorCenterData,
    isLoading,
  } = useCreateVisitorCenter();

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

    handleCreateVisitorCenter(name, summary, code);
  };

  const url = visitorCenterData && `/center/${visitorCenterData?.owner}`;

  return (
    <>
      <h2>Create visitor center</h2>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {visitorCenterData ? (
            <div>
              <Link to={url}>Go to your visitor center</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  id="name"
                  required
                  ref={nameRef}
                  maxLength="30"
                />
              </div>

              <div>
                <label htmlFor="code">Dodo code</label>
                <br />
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  ref={codeRef}
                  maxLength="5"
                  minLength="5"
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
                <button type="submit" disabled={isLoading}>
                  Create visitor center
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </>
  );
};

export default CreateVisitorCenter;
