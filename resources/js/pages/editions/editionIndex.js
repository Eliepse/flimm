import { useEffect, useState } from "react";
import { Link } from "app";
import apiEdition from "lib/api/apiEdition";
import { Badge, Button, Table } from "antd";
import { ClockCircleOutlined, EditOutlined, EyeOutlined, PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import TitleAndActionsLayout from "components/layouts/TitleAndActionsLayout";

const COLUMNS = [
	{
		key: "title",
		render: (edition) => <SummaryCell edition={edition} />,
	},
	{
		title: "Publication",
		dataIndex: "published_at",
		key: "published_at",
		width: 160,
		render: (date) => date?.format("L LT"),
	},
	{
		title: "Modification",
		dataIndex: "updated_at",
		key: "updated_at",
		width: 160,
		render: (date) => date.format("L LT"),
	},
	{
		align: "right",
		width: 200,
		render: (edition) => <ActionsCell edition={edition} />,
	},
];

const EditionIndexPage = () => {
	const [editions, setEditions] = useState([]);

	useEffect(() => {
		apiEdition.all().then(setEditions).catch(console.error);
	}, []);

	const title = (
		<span className="inline-flex items-center">
			Éditions
			<Badge
				count={editions.length}
				overflowCount={99999}
				className="ml-2"
				style={{
					backgroundColor: "#f3f4f6",
					color: "#4b5563",
				}}
			/>
		</span>
	);

	return (
		<TitleAndActionsLayout
			title={title}
			actions={
				<Link to="/editions/create">
					<Button icon={<PlusOutlined />} type="primary">
						Nouveau
					</Button>
				</Link>
			}
		>
			<Table
				dataSource={editions.map((edition) => ({
					...edition,
					key: edition.id,
				}))}
				columns={COLUMNS}
				pagination={false}
			/>
		</TitleAndActionsLayout>
	);
};

const dateFormat = "D MMM YYYY";

const SummaryCell = ({ edition }) => {
	const isPeriodComplete = edition.open_at && edition.close_at;
	const openAtFormated = edition.open_at?.format(dateFormat) || "?";
	const closeAtFormated = edition.close_at?.format(dateFormat) || "?";

	return (
		<>
			<div className="mb-2 font-bold text-base">{edition.title}</div>
			<div className="leading-none">
				<ClockCircleOutlined className="mr-2" />
				{isPeriodComplete ? openAtFormated + " — " + closeAtFormated : "?"}
			</div>
		</>
	);
};

SummaryCell.propTypes = {
	edition: PropTypes.object,
};

const ActionsCell = ({ edition }) => {
	return (
		<>
			<Link key="edit" to={`/editions/${edition.id}`}>
				<Button type="primary" icon={<EditOutlined />} className="mr-2" />
			</Link>
			<Button icon={<UnorderedListOutlined />} className="mr-2" />
			<Button
				key="view"
				type="link"
				href={`/editions/${edition.slug}`}
				rel="noreferrer"
				target="_blank"
				icon={<EyeOutlined />}
			/>
		</>
	);
};

ActionsCell.propTypes = {
	edition: PropTypes.object,
};

export default EditionIndexPage;
