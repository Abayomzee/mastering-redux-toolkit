import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegin } from "./api";
import moment from "moment";

let lastId = 0;
const bugSlice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    bugRequested: (bugs, action) => {
      bugs.loading = true;
    },
    bugRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },
    bugReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },
    bugAssignedToUser: (bugs, action) => {
      const { id: bugId, userId } = action.payload;
      const index = bugs.list.findIndex((bug) => bug.id === bugId);
      bugs.list[index] = action.payload;
    },
    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload);
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index] = action.payload;
    },
    bugRemoved: (bugs, action) => {
      return bugs.list.filter((bug) => bug.id !== action.payload.id);
    },
  },
});

export const {
  bugAssignedToUser,
  bugAdded,
  bugResolved,
  bugRemoved,
  bugReceived,
  bugRequested,
  bugRequestFailed,
} = bugSlice.actions;
export default bugSlice.reducer;

const url = "/bugs";
export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;
  dispatch(
    apiCallBegin({
      url,
      onSuccess: bugReceived.type,
      onStart: bugRequested.type,
      onError: bugRequestFailed.type,
    })
  );
};

export const addBug = (bug) =>
  apiCallBegin({
    url,
    method: "post",
    data: bug,
    onSuccess: bugAdded.type,
  });

export const resolveBug = (bugId) =>
  apiCallBegin({
    url: `${url}/${bugId}`,
    method: "patch",
    data: { resolved: true },
    onSuccess: bugResolved.type,
  });

export const assignBugToUser = (bugId, userId) =>
  apiCallBegin({
    url: `${url}/${bugId}`,
    method: "patch",
    data: { userId },
    onSuccess: bugAssignedToUser.type,
  });

/**
 * This creates a memoization which ensures another
 * copy of the state isn't made if nothing
 * has changed in the state
 */
export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs,
  (bugs) => bugs.list.filter((bug) => !bug.resolved)
);

export const getBugsByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.list.filter((bug) => bug.userId === userId)
  );
