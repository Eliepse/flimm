import { Form, message, Modal } from "antd";
import { SelectionForm } from "components/forms/SelectionForm";
import { SelectionBroker } from "lib/api/apiSelection";
import { dummyFn, optionFn } from "lib/support/functions";
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

const SelectionFormModal = ({ editionId, selectionId, onClose, onSuccess, ...rest }) => {
	const isEdition = typeof selectionId === "number";
	const selectionBroker = new SelectionBroker(editionId);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	/*
	 | ************************
	 | Actions
	 | ************************
	 */

	const close = useCallback(() => {
		form.resetFields();
		optionFn(onClose)();
	}, [form, onClose]);

	function submit() {
		setLoading(true);
		form
			.validateFields()
			.then((data) => {
				const request = isEdition ? selectionBroker.update({ id: selectionId, ...data }) : selectionBroker.create(data);

				return request
					.then((selection) => {
						optionFn(onSuccess)(selection);
						message.success("Sauvegarde réussie !");
						close();
					})
					.catch((data) => {
						console.error(data);
						message.error("Échec de l'enregistrement de la sélection");
					});
			})
			.catch(dummyFn)
			.finally(() => setLoading(false));
	}

	/*
	 | ************************
	 | Initialization
	 | ************************
	 */

	useEffect(() => {
		if (!editionId || !selectionId) {
			return;
		}

		const selectionBroker = new SelectionBroker(editionId);
		selectionBroker
			.get(selectionId)
			.then((data) =>
				form.setFieldsValue({ name: data.name, intro: data.intro, films: data.films.map((f) => f.id) })
			)
			.catch((e) => {
				console.error(e);
				message.error("Erreur lors du chargement de la sélection.");
				close();
			});
	}, [close, editionId, form, selectionId]);

	/*
	 | ************************
	 | Render
	 | ************************
	 */

	return (
		<Modal
			{...rest}
			title={editionId ? "Ajout d'une sélection" : "Modification d'un sélection"}
			onOk={submit}
			onCancel={close}
			confirmLoading={loading}
		>
			<SelectionForm form={form} layout="vertical" />
		</Modal>
	);
};

SelectionFormModal.propTypes = {
	editionId: PropTypes.number.isRequired,
	selectionId: PropTypes.number,
	onClose: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
	visible: PropTypes.bool,
};

export default SelectionFormModal;
