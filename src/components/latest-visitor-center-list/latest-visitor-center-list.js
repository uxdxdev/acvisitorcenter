import React from "react";
import { useLatestVisitorCenterList } from "./hooks";

const LatestVisitorCenterList = () => {
  const {
    latestCenters,
    isFetchingLatestCenters,
  } = useLatestVisitorCenterList();
  return (
    <>
      <h2>Latest visitor centers</h2>
      {isFetchingLatestCenters ? (
        <div>Loading...</div>
      ) : (
        <>
          {latestCenters?.length > 0 ? (
            <ul>
              {latestCenters?.map((center) => {
                const url = `${window.location.origin}/center/${center.id}`;
                const name = center?.name;
                return (
                  <li key={center.id}>
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
