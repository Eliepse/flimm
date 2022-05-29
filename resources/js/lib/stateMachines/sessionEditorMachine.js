import { createMachine, invoke, reduce, state, state as final, transition } from "robot3";
import apiSession from "lib/api/apiSession";
import { message } from "antd";

export const MODE = {
	create: 0,
	edit: 1,
};

function isCreateMode(ctx) {
	return ctx.mode === MODE.create;
}

function loadSession(ctx) {
	if (isCreateMode(ctx)) {
		return Promise.resolve({});
	}

	return apiSession.get(ctx.id).catch((e) => {
		console.error(e);
		message.error("Erreur du chargement de la séance");
	});
}

function saveSession(ctx) {
	console.debug(ctx);
	if (isCreateMode(ctx)) {
		return apiSession
			.create(ctx.dataToSend)
			.then(() => {
				message.success("Séance crée");
			})
			.catch((e) => {
				message.error("Échec de création d'une séance");
				console.error(e);
			});
	}

	return apiSession
		.update({ id: ctx.id, ...ctx.dataToSend })
		.then(() => {
			message.success("Séance sauvegardée");
		})
		.catch((e) => {
			message.error("Échec de la sauvegarde");
			console.error(e);
		});
}

//noinspection JSCheckFunctionSignatures
export default createMachine(
	"init",
	{
		init: invoke(
			loadSession,
			transition(
				"done",
				"updateForm",
				reduce((ctx, ev) => ({ ...ctx, data: ev.data }))
			),
			transition("error", "error")
		),
		updateForm: state(transition("done", "idle")),
		idle: state(
			transition(
				"save",
				"submiting",
				reduce((ctx, ev) => ({ ...ctx, dataToSend: ev.data }))
			)
		),
		submiting: invoke(saveSession, transition("done", "updateForm"), transition("error", "idle")),
		error: final(),
	},
	(e) => ({
		id: undefined,
		mode: MODE.create,
		data: {},
		...e,
	})
);
