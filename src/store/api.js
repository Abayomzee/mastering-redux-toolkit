import { createAction } from "@reduxjs/toolkit";

export const apiCallBegin = createAction("api/callBegin");
export const apiCallSuccessful = createAction("api/CallSuccessful");
export const apiCallFailed = createAction("api/CallFailed");
