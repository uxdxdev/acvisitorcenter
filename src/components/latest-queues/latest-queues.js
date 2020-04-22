import React from "react";
import { useLatestQueues } from "./hooks";

const LatestQueues = () => {
  const { latestQueues, isFetchingLatestQueues } = useLatestQueues();
  return (
    <>
      <h2>Latest queues</h2>
      {isFetchingLatestQueues ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {latestQueues?.map((queue) => {
            const url = `${window.location.origin}/queue/${queue.id}`;
            const name = queue?.name;
            return (
              <li key={queue.id}>
                {name}{" "}
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Open
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default LatestQueues;
