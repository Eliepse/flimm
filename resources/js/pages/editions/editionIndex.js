import DashboardLayout from "components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { Link } from "app";
import apiEdition from "lib/api/apiEdition";
import { Button, Table } from "antd";
import { ClockCircleOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

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
		render: (edition) => [
			<Link key="edit" to={`/editions/${edition.id}`}>
				<Button size="small" type="primary" icon={<EditOutlined />} className="mr-2">
					Editer
				</Button>
			</Link>,
			<Button
				key="view"
				size="small"
				type="link"
				href={`/editions/${edition.slug}`}
				rel="noreferrer"
				target="_blank"
				icon={<EyeOutlined />}
			>
				Afficher
			</Button>,
		],
	},
];

const EditionIndexPage = () => {
	const [editions, setEditions] = useState([]);

	useEffect(() => {
		apiEdition.all().then(setEditions).catch(console.error);
	}, []);

	return (
		<DashboardLayout>
			<div className="flex justify-between items-center">
				<h1>Editions</h1>
				<div>
					<Link to="/editions/create">
						<Button icon={<PlusOutlined />} type="primary">
							Nouveau
						</Button>
					</Link>
				</div>
			</div>
			<Table
				dataSource={editions.map((edition) => ({
					...edition,
					key: edition.id,
				}))}
				columns={COLUMNS}
				pagination={false}
			/>
		</DashboardLayout>
	);
};

const dateFormat = "D MMM YYYY"

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

export default EditionIndexPage;
