import React, { useRef } from "react";
import { handleCopyToClipboardByRef } from "../../utils/functions";

const ManageQueue = () => {
  let urlRef = useRef(null);
  const url = window.location.href;

  return (
    <div>
      <h3>URL</h3>
      <div>
        <input
          type="text"
          value={url}
          id="url"
          ref={urlRef}
          onChange={() => {}}
        />
        <button onClick={() => handleCopyToClipboardByRef(urlRef.current)}>
          Copy URL to clipboard
        </button>
      </div>
    </div>
  );
};

export default ManageQueue;
