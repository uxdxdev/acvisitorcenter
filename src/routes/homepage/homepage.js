import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

const Homepage = () => {
  const [queueId, setQueueId] = useState(null);

  // redirect to queue page when id available
  if (queueId) {
    return <Redirect to={`/queue/${queueId}`} />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // save data to DB
    const username = event.target.username.value;
    const queueLimit = event.target.queuelimit.value;

    // set queue id for redirect
    setQueueId(1234);
  };

  return (
    <div>
      <h1>Animal Crossing Visitor Queue</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="queuelimit">Limit</label>
          <input
            type="number"
            id="queuelimit"
            name="queuelimit"
            required
            min="1"
            max="150"
            defaultValue="1"
          />
        </div>
        <div>
          <button type="submit">Create a queue</button>
        </div>
      </form>
    </div>
  );
};

export default Homepage;
