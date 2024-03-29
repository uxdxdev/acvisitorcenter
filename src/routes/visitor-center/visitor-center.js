import React, { useEffect, useState, useContext } from "react";
import { VisitorCenterInformation } from "../../components/visitor-center-information";
import { store } from "../../store";
import { useParams } from "react-router-dom";
import { firebase } from "../../utils/firebase";
import { PageLoadingSpinner } from "../../components/page-loading-spinner";

const VisitorCenter = () => {
  const context = useContext(store);
  const { dispatch } = context;
  const { id: centerId } = useParams();
  const [visitorCenterExists, setVisitorCenterExists] = useState(false);

  useEffect(() => {
    const db = firebase.firestore();

    db.collection("centers")
      .doc(centerId)
      .get()
      .then((result) => {
        if (result.exists) {
          setVisitorCenterExists(true);
        } else {
          dispatch({
            type: "FETCH_VISITOR_CENTER_DATA_FAIL",
            error: "visitor center does not exist",
          });
        }
      })
      .catch((error) => {
        dispatch({ type: "FETCH_VISITOR_CENTER_DATA_FAIL", error });
      });
  }, [centerId, dispatch]);

  return (
    <>
      {visitorCenterExists ? (
        <VisitorCenterInformation />
      ) : (
        <PageLoadingSpinner />
      )}
    </>
  );
};

export default VisitorCenter;
