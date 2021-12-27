import { combineReducers } from "redux";
import filmsReducer from "./filmsSlice";

const rootReducer = combineReducers({
	films: filmsReducer,
});

export default rootReducer;
