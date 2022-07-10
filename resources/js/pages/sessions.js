import { Link } from "app";
import { Badge, Button, message, Popconfirm, Table } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import TitleAndActionsLayout from "components/layouts/TitleAndActionsLayout";
import { useEffect, useState } from "react";
import apiSession from "lib/api/apiSession";
import { optionalArr } from "lib/support/arrays";

export default function SessionsIndexPage() {
	const [state, setState] = useState("loading");
	const [sessions, setSessions] = useState([]);

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
			align: "right",
			render: (session) => <ActionsCell session={session} onDelete={() => deleteSession(session.id)} />,
		},
	];

	/*
	 | ************************
	 | Actions
	 | ************************
	 */

	function deleteSession(id) {
		apiSession
			.delete(id)
			.then(() => {
				setSessions((st) => st.filter((session) => session.id !== id));
				message.success("Séance supprimée");
			})
			.catch((e) => {
				console.debug(e);
				message.error("Impossible de supprimer la séance");
			});
	}

	/*
	 | ************************
	 | Initial load
	 | ************************
	 */

	useEffect(() => {
		apiSession
			.all()
			.then((data) => {
				setSessions(data);
				setState("done");
			})
			.catch((e) => {
				console.error(e);
				setSessions([]);
				setState("error");
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
				loading={state === "loading"}
				columns={COLUMNS}
				pagination={false}
			/>
		</TitleAndActionsLayout>
	);
}

const ActionsCell = ({ session, onDelete }) => {
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
			<Popconfirm title={`Supprimer ${session.title} ?`} onConfirm={onDelete}>
				<Button type="text" className="ml-2" icon={<DeleteOutlined />} />
			</Popconfirm>
		</>
	);
};
