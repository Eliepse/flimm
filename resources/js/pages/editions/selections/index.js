import { useEffect, useState } from "react";
import apiEdition from "lib/api/apiEdition";
import { Table } from "antd";
import TitleAndActionsLayout from "components/layouts/TitleAndActionsLayout";
import { useRouter } from "lib/useRouter";
import { SelectionBroker } from "lib/api/apiSelection";

const COLUMNS = [{ dataIndex: "name" }, { key: "count", render: (selection) => selection.films?.length || 0 }];

const SelectionsIndexPage = () => {
	const { query } = useRouter();
	const editionId = query.id;

	const [edition, setEdition] = useState();
	const [selections, setSelections] = useState([]);

	useEffect(() => {
		const selectionBroker = new SelectionBroker(editionId);

		apiEdition.get(editionId).then(setEdition).catch(console.error);
		selectionBroker.all().then(setSelections).catch(console.error);
	}, [editionId]);

	const title = (
		<span className="inline-flex items-center">Sélections de l&apos;édition &quot;{edition?.title}&quot;</span>
	);

	return (
		<TitleAndActionsLayout
			title={title}
			//actions={
			//<Link to="/editions/create">
			//<Button icon={<PlusOutlined />} type="primary">
			//	Nouveau
			//</Button>
			//</Link>
			//}
		>
			<Table
				dataSource={selections.map((selection) => ({ ...selection, key: selection.id }))}
				columns={COLUMNS}
				pagination={false}
			/>
		</TitleAndActionsLayout>
	);
};

export default SelectionsIndexPage;
