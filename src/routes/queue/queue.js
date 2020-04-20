import React, { useRef } from "react";
import { useParams, useLocation } from "react-router-dom";

const Queue = () => {
  let urlInputRef = useRef(null);
  const { id } = useParams();
  const location = useLocation();

  // get data for id in db
  const username = "username";
  const queueLimit = 150;

  const handleCopyToClipboard = () => {
    urlInputRef.select();
    // urlInputRef.setSelectionRange(0, 99999);
    document.execCommand("copy");
  };

  return (
    <div>
      <h1>{username}'s queue</h1>
      <div>Limit: {queueLimit}</div>
      <div>
        Share URL:{" "}
        <input
          type="text"
          value={location.pathname}
          id="url"
          ref={(ref) => (urlInputRef = ref)}
          onChange={() => {}}
        />
        <button onClick={handleCopyToClipboard}>Copy URL</button>
      </div>
    </div>
  );
};

export default Queue;
