import { useContext, useMemo } from "react";
import { authContext } from "lib/auth/authProvider";
import PropTypes from "prop-types";
import { Avatar, Menu } from "antd";
import { useRouter } from "lib/useRouter";
import { MENU } from "configs/app";

const DashboardLayout = ({ children }) => {
	const router = useRouter();
	const { user, logout } = useContext(authContext);

	function handleMenuClick(item) {
		router.pushAdmin(item.key);
	}

	const menu = useMemo(() => {
		return MENU.map(({ path, label }) => <Menu.Item key={path}>{label}</Menu.Item>);
	}, []);

	const activeMenu = MENU.find(({ path, strict }) => {
		if (strict === true) {
			return router.pathnameAdmin === path;
		}

		return router.pathnameAdmin.startsWith(path);
	});

	return (
		<div className="flex flex-col min-h-screen">
			<div className="border-b border-solid border-gray-200">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					{/* Title */}
					<a href="/">
						<div className="flex items-center font-bold text-xl leading-none mr-6">FLiMM</div>
					</a>

					{/* Menu */}
					<Menu mode="horizontal" className="border-0" onClick={handleMenuClick} selectedKeys={[activeMenu.path]}>
						{menu}
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
			<div className="flex-auto w-full pt-6 mx-auto max-w-6xl">{children}</div>
		</div>
	);
};

DashboardLayout.propTypes = {
	children: PropTypes.any,
};

export default DashboardLayout;
