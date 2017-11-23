import { combineReducers } from "redux";
import { all } from "redux-saga/effects";

import app, { appSagas } from "./app";

export default combineReducers({
  app
});

export function* rootSaga() {
  yield all([...appSagas]);
}
