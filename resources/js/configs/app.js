import SettingsPage from "pages/settings";
import ArticleIndexPage from "pages/articles/articleIndex";
import HomePage from "pages/home";
import ArticleEditorPage from "pages/articles/articleEditor";
import FilmIndexPage from "pages/films/filmIndex";
import FilmEditorPage from "pages/films/filmEditor";
import EditionIndexPage from "pages/editions/editionIndex";
import EditionEditorPage from "pages/editions/editionEditor";

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
		label: "Paramètres",
		path: "/settings",
	},
];
