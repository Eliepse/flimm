import SettingsPage from "pages/settings";
import ArticleIndexPage from "pages/articles/articleIndex";
import HomePage from "pages/home";
import ArticleEditorPage from "pages/articles/articleEditor";
import FilmIndexPage from "pages/films/filmIndex";
import FilmEditorPage from "pages/films/filmEditor";
import EditionIndexPage from "pages/editions/editionIndex";
import EditionEditorPage from "pages/editions/editionEditor";
import SessionsIndexPage from "pages/sessions";
import SessionEditorPage from "pages/sessions/editor";

export const URL_PREFIX = "/admin";

export default {
	URL_PREFIX,
};

export const PAGES = {
	"/": HomePage,
	"/settings": SettingsPage,
	"/articles": ArticleIndexPage,
	"/articles/:id": ArticleEditorPage,
	"/films": FilmIndexPage,
	"/films/create": FilmEditorPage,
	"/films/:id": FilmEditorPage,
	"/editions": EditionIndexPage,
	"/editions/create": EditionEditorPage,
	"/editions/:id": EditionEditorPage,
	"/sessions": SessionsIndexPage,
	"/sessions/create": SessionEditorPage,
	"/sessions/:id": SessionEditorPage,
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
