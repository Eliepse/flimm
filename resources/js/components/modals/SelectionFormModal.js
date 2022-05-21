import { Form, message, Modal } from "antd";
import { SelectionForm } from "components/forms/SelectionForm";
import { SelectionBroker } from "lib/api/apiSelection";
import { dummyFn, optionFn } from "lib/support/functions";
import { useState } from "react";

const SelectionFormModal = ({ editionId, onClose, onSuccess, ...rest }) => {
	const selectionBroker = new SelectionBroker(editionId);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	function submit() {
		setLoading(true);
		form
			.validateFields()
			.then((data) => {
				return selectionBroker
					.create(data)
					.then((selection) => {
						optionFn(onSuccess)(selection);
						optionFn(onClose)();
					})
					.catch((data) => {
						console.error(data);
						message.error("Échec de l'enregistrement de la sélection");
					});
			})
			.catch(dummyFn)
			.finally(() => setLoading(false));
	}

	return (
		<Modal
			{...rest}
			onCancel={onClose}
			title={editionId ? "Ajout d'une sélection" : "Modification d'un sélection"}
			onOk={submit}
			confirmLoading={loading}
			destroyOnClose
		>
			<SelectionForm form={form} />
		</Modal>
	);
};

export default SelectionFormModal;
