import { createSlice } from "@reduxjs/toolkit";

let lastId = 0;
const userSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    userAdded: (user, actions) => {
      user.push({
        id: ++lastId,
        name: actions.payload.name,
      });
    },
  },
});

export const { userAdded } = userSlice.actions;
export default userSlice.reducer;
