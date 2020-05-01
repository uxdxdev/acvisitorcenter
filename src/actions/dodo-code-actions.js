import { firebase } from "../utils/firebase";

export const fetchDodoCode = (dispatch, ownerUid) => {
  dispatch({ type: "FETCH_DODO_CODE" });

  return firebase
    .firestore()
    .collection("users")
    .doc(ownerUid)
    .get()
    .then((result) => {
      const { dodoCode } = result.data();
      dispatch({ type: "FETCH_DODO_CODE_SUCCESS", dodoCode });
    })
    .catch((error) => {
      dispatch({
        type: "FETCH_DODO_CODE_FAIL",
        error,
      });
    });
};
