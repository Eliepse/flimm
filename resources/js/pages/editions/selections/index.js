import { useCallback, useEffect, useState } from "react";
import apiEdition from "lib/api/apiEdition";
import { Button, message, Popconfirm, Table } from "antd";
import TitleAndActionsLayout from "components/layouts/TitleAndActionsLayout";
import { useRouter } from "lib/useRouter";
import { SelectionBroker } from "lib/api/apiSelection";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import SelectionFormModal from "components/modals/SelectionFormModal";
import PropTypes from "prop-types";

const SelectionsIndexPage = () => {
	const { query } = useRouter();
	const editionId = Number(query.id);

	const [edition, setEdition] = useState();
	const [selections, setSelections] = useState([]);
	const [formModalVisible, setFormModalVisible] = useState(false);

	const loadSelectionList = useCallback(() => {
		const selectionBroker = new SelectionBroker(editionId);
		apiEdition.get(editionId).then(setEdition).catch(console.error);
		selectionBroker.all().then(setSelections).catch(console.error);
	}, [editionId]);

	useEffect(() => loadSelectionList(), [loadSelectionList]);

	/*
	 | ************************
	 | Actions
	 | ************************
	 */

	function showCreateSelectionModal() {
		setFormModalVisible(true);
	}

	function showEditSelectionModal(id) {
		if (typeof id !== "number") {
			return;
		}

		setFormModalVisible(id);
	}

	function deleteSelection(id) {
		new SelectionBroker(editionId)
			.delete(id)
			.then(() => {
				message.success("Sélection supprimée");
				setSelections((st) => st.filter((s) => s.id !== id));
			})
			.catch((e) => {
				console.error(e);
				message.error("Échec de la suppression de la sélection");
			});
	}

	/*
	 | ************************
	 | Render
	 | ************************
	 */

	const COLUMNS = [
		{ dataIndex: "name", title: "Nom" },
		{ key: "count", title: "Nb de films", render: (selection) => selection.films?.length || 0 },
		{
			dataIndex: "id",
			align: "right",
			render: (id) => <ActionsCell id={id} onEdit={showEditSelectionModal} onDelete={deleteSelection} />,
		},
	];

	const title = (
		<span className="inline-flex items-center">Sélections de l&apos;édition &quot;{edition?.title}&quot;</span>
	);

	return (
		<TitleAndActionsLayout
			title={title}
			actions={
				<Button icon={<PlusOutlined />} type="primary" onClick={showCreateSelectionModal}>
					Nouveau
				</Button>
			}
		>
			<Table
				dataSource={selections.map((selection) => ({ ...selection, key: selection.id }))}
				columns={COLUMNS}
				pagination={false}
			/>

			<SelectionFormModal
				editionId={editionId}
				visible={formModalVisible !== false}
				selectionId={typeof formModalVisible === "number" ? formModalVisible : undefined}
				onSuccess={loadSelectionList}
				onClose={() => setFormModalVisible(false)}
			/>
		</TitleAndActionsLayout>
	);
};

const ActionsCell = ({ id, onEdit, onDelete }) => {
	return (
		<>
			<Button icon={<EditOutlined />} className="mr-2" onClick={() => onEdit(id)} />
			<Popconfirm title="Souhaitez-vous vraimer supprimer cette sélection ?" onConfirm={() => onDelete(id)}>
				<Button type="text" icon={<DeleteOutlined />} />
			</Popconfirm>
		</>
	);
};

ActionsCell.propTypes = {
	id: PropTypes.number.isRequired,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

export default SelectionsIndexPage;
