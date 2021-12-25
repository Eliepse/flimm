import { Link } from "app";
import { Badge, Button, Table } from "antd";
import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import TitleAndActionsLayout from "components/layouts/TitleAndActionsLayout";
import { useEffect, useState } from "react";
import apiSession from "lib/api/apiSession";
import { optionalArr } from "lib/support/arrays";

const COLUMNS = [
	{
		title: "title",
		dataIndex: "title",
		key: "title",
	},
	{
		title: "Réalisateur",
		dataIndex: "filmmaker",
		key: "filmmaker",
	},
	{
		key: "actions",
		width: 200,
		render: (session) => <ActionsCell session={session} />,
	},
];

export default function SessionsIndexPage() {
	const [sessions, setSessions] = useState();

	useEffect(() => {
		apiSession
			.all()
			.then(setSessions)
			.catch((e) => {
				console.error(e);
				setSessions([]);
			});
	}, []);

	const title = (
		<span className="inline-flex items-center">
			Sessions
			{sessions && (
				<Badge
					count={sessions.length}
					overflowCount={99999}
					className="ml-2"
					style={{
						backgroundColor: "#f3f4f6",
						color: "#4b5563",
					}}
				/>
			)}
		</span>
	);

	return (
		<TitleAndActionsLayout
			title={title}
			actions={
				<Link to="/sessions/create">
					<Button icon={<PlusOutlined />} type="primary">
						Nouveau
					</Button>
				</Link>
			}
		>
			<Table
				dataSource={optionalArr(sessions).map((session) => ({ ...session, key: session.id }))}
				loading={sessions === undefined}
				columns={COLUMNS}
				pagination={false}
			/>
		</TitleAndActionsLayout>
	);
}

const ActionsCell = ({ session }) => {
	console.debug(session);
	return (
		<>
			<Link key="edit" to={`/sessions/${session.id}`}>
				<Button size="small" type="primary" icon={<EditOutlined />} className="mr-2">
					Editer
				</Button>
			</Link>
			<Button
				key="view"
				size="small"
				type="link"
				href={`/seances/${session.id}`}
				rel="noreferrer"
				target="_blank"
				icon={<EyeOutlined />}
			>
				Afficher
			</Button>
		</>
	);
}
