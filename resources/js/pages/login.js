import { useAuth } from "lib/auth/useAuth";
import { useRouter } from "lib/useRouter";
import EmptyLayout from "components/layouts/EmptyLayout";
import { Button, Form, Input, message } from "antd";

export default function LoginPage() {
	const { login } = useAuth();
	const router = useRouter();

	function handleFinish({ email, password }) {
		login(email, password)
			.then(router.goHome)
			.catch((error) => {
				//noinspection JSIgnoredPromiseFromCall
				message.error(error.message);
			});
	}

	return (
		<EmptyLayout>
			<div className="h-screen flex flex-col items-center justify-center">
				<div className="w-full max-w-xs">
					<Form layout="vertical" onFinish={handleFinish}>
						<Form.Item
							label="Email"
							name="email"
							rules={[
								{
									required: true,
									message: "Please input your username!",
								},
							]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label="Mot de passe"
							name="password"
							rules={[
								{
									required: true,
									message: "Please input your password!",
								},
							]}
						>
							<Input.Password />
						</Form.Item>

						<Button type="primary" htmlType="submit">
							Se connecter
						</Button>
					</Form>
				</div>
			</div>
		</EmptyLayout>
	);
}
