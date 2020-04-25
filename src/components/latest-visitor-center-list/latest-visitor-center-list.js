import React from "react";
import { useLatestVisitorCenterList } from "./hooks";

const LatestVisitorCenterList = () => {
  const { latestQueues, isFetchingLatestQueues } = useLatestVisitorCenterList();
  return (
    <>
      <h2>Latest visitor centers</h2>
      {isFetchingLatestQueues ? (
        <div>Loading...</div>
      ) : (
        <>
          {latestQueues?.length > 0 ? (
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
          ) : (
            <div>There are no visitor centers</div>
          )}
        </>
      )}
    </>
  );
};

export default LatestVisitorCenterList;
