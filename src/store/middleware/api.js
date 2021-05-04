import { apiCallBegin, apiCallFailed, apiCallSuccessful } from "./../api";
import axios from "axios";

const api = ({ getState, dispatch }) => (next) => async (action) => {
  if (action.type !== apiCallBegin.type) return next(action);

  const { url, onSuccess, onError, onStart, method, data } = action.payload;

  if (onStart) dispatch({ type: onStart });

  next(action);

  try {
    const response = await axios.request({
      baseURL: "http://localhost:9001/api",
      url,
      method,
      data,
    });
    // General case
    dispatch(apiCallSuccessful(response.data));
    // Specific cases
    if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    //   General case
    dispatch(apiCallFailed(error.message));
    // Specific cases
    if (onError) dispatch({ type: onError, payload: error.message });
  }
};

export default api;
