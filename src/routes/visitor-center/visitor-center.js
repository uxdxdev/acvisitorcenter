import React, { useEffect, useState, useContext } from "react";
import { VisitorCenterInformation } from "../../components/visitor-center-information";
import { store } from "../../store";
import { useParams } from "react-router-dom";
import { firebase } from "../../utils/firebase";

const VisitorCenter = () => {
  const [visitorCenterExists, setVisitorCenterExists] = useState(false);
  const context = useContext(store);
  const { dispatch } = context;
  const { id: centerId } = useParams();

  useEffect(() => {
    async function checkIfExists() {
      const db = firebase.firestore();

      // check if the visitor center exists before making any further requests
      const visitorCenterExists = await db
        .collection("centers")
        .doc(centerId)
        .get()
        .then((result) => {
          if (result.exists) {
            setVisitorCenterExists(true);
          } else {
            dispatch({
              type: "FETCH_VISITOR_CENTER_FAIL",
              error: "visitor center does not exist",
            });
          }
        })
        .catch((error) => {
          // fails to listen
          dispatch({ type: "FETCH_VISITOR_CENTER_FAIL", error });
        });

      if (!visitorCenterExists) return null;
    }
    checkIfExists();
  }, [centerId, dispatch]);

  return <>{visitorCenterExists && <VisitorCenterInformation />}</>;
};

export default VisitorCenter;
