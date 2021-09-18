import { useContext } from "react";
import { authContext } from "lib/auth/authProvider";
import PropTypes from "prop-types";
import { Avatar, Menu } from "antd";
import { useRouter } from "lib/useRouter";

const DashboardLayout = ({ children }) => {
	const router = useRouter();
	const { user, logout } = useContext(authContext);

	function handleNavigationClick(item) {
		router.pushAdmin(item.key);
	}

	return (
		<div className="flex flex-col min-h-screen">
			<div className="border-b border-solid border-gray-200">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					{/* Title */}
					<div className="font-bold text-xl mr-6">FLiMM</div>

					{/* Menu */}
					<Menu mode="horizontal" className="border-0" onClick={handleNavigationClick}>
						<Menu.Item key="/">Dashboard</Menu.Item>
						<Menu.Item key="/articles">Articles</Menu.Item>
						<Menu.Item key="/films">Films</Menu.Item>
						<Menu.Item key="/editions">Editions</Menu.Item>
						<Menu.Item key="/settings">Paramètres</Menu.Item>
					</Menu>

					{/* User */}
					<Menu mode="horizontal">
						<Menu.SubMenu
							key="user"
							icon={
								<Avatar size={32} shape="square">
									{user.firstname[0] + user.lastname[0]}
								</Avatar>
							}
							title={`${user.firstname} ${user.lastname[0]}`}
						>
							<Menu.Item key="/logout" onClick={logout}>
								Se déconnecter
							</Menu.Item>
						</Menu.SubMenu>
					</Menu>
				</div>
			</div>
			{/*		<Navigation.Item label="Dashboard" as={Link} href="/" />*/}
			{/*		<Navigation.Item label="Articles" as={Link} href="/articles" />*/}
			{/*		<Navigation.Item label="Films" as={Link} href="/films" />*/}
			{/*		<Navigation.Item label="Editions" as={Link} href="/editions" />*/}
			{/*		<Navigation.Item label="Paramètres" as={Link} href="/settings" />*/}
			<div className="flex-auto w-full pt-6 mx-auto max-w-6xl">{children}</div>
		</div>
	);
};

DashboardLayout.propTypes = {
	children: PropTypes.any,
};

export default DashboardLayout;
