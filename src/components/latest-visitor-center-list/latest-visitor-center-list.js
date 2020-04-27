import React from "react";
import { useLatestVisitorCenterList } from "./hooks";
import { Link } from "react-router-dom";

const LatestVisitorCenterList = () => {
  const { latestCenters, isLoading } = useLatestVisitorCenterList();

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <h2>Latest visitor centers</h2>
      {latestCenters?.length > 0 ? (
        <ul>
          {latestCenters?.map((center) => {
            const id = center?.owner;
            const url = `/center/${id}`;
            const name = center?.name;
            return (
              <li key={id}>
                {name} <Link to={url}>Visit</Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div>There are no visitor centers</div>
      )}
    </>
  );
};

export default LatestVisitorCenterList;
