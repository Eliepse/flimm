import {lazy} from "react";

export const URL_PREFIX = "/admin";

export default {
	URL_PREFIX,
};

export const PAGES = {
	"/": lazy(() => import("../pages/home")),
	"/settings": lazy(() => import("../pages/settings")),
	"/articles": lazy(() => import("../pages/articles/articleIndex")),
	"/articles/:id": lazy(() => import("../pages/articles/articleEditor")),
	"/films": lazy(() => import("../pages/films/filmIndex")),
	"/films/create": lazy(() => import("../pages/films/filmEditor")),
	"/films/:id": lazy(() => import("../pages/films/filmEditor")),
	"/editions": lazy(() => import("../pages/editions/editionIndex")),
	"/editions/create": lazy(() => import("../pages/editions/editionEditor")),
	"/editions/:id": lazy(() => import("../pages/editions/editionEditor")),
	"/editions/:id/selections": lazy(() => import("../pages/editions/selections")),
	"/sessions": lazy(() => import("../pages/sessions")),
	"/sessions/create": lazy(() => import("../pages/sessions/editor")),
	"/sessions/:id": lazy(() => import("../pages/sessions/editor")),
};

export const MENU = [
	{
		label: "Dashboard",
		path: "/",
		strict: true,
	},
	{
		label: "Articles",
		path: "/articles",
	},
	{
		label: "Films",
		path: "/films",
	},
	{
		label: "Editions",
		path: "/editions",
	},
	{
		label: "Séances",
		path: "/sessions",
	},
	{
		label: "Paramètres",
		path: "/settings",
	},
];
