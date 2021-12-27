import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
	name: "films",
	initialState: {},
	reducers: {
		hydrate: (state, action) => {
			const { payload } = action;

			if (!Array.isArray(payload)) {
				return state;
			}

			return Object.fromEntries(payload.map((film) => [film.id, film]));
		},
	},
});

/*
| -------------------------
| Selectors
| -------------------------
*/

export const getFilmsList = (state) => Object.values(state.films);

/*
| -------------------------
| Export reducers
| -------------------------
*/

export const { hydrate: hydrateFilms } = slice.actions;

export default slice.reducer;
