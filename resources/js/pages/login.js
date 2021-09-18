import { Button, Notification, PasswordInput, TextInput } from "hds-react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import { useAuth } from "lib/auth/useAuth";
import { useRouter } from "lib/useRouter";
import EmptyLayout from "components/layouts/EmptyLayout";

const loginSchema = Yup.object().shape({
	email: Yup.string().email("Email invalide").required("Email requis"),
	password: Yup.string().min(5, "Trop court").required("Mot de passe requis"),
});

export default function LoginPage() {
	const { login } = useAuth();
	const [error, setError] = useState();
	const router = useRouter();

	const formik = useFormik({
		initialValues: { email: "", password: "" },
		validationSchema: loginSchema,
		validateOnChange: false,
		onSubmit: ({ email, password }) => {
			setError();
			login(email, password)
				.then(() => {
					router.push("/admin/");
				})
				.catch(handleLoginFailed);
		},
	});

	function handleLoginFailed(error) {
		setError(error.message);
	}

	return (
		<EmptyLayout>
			<div className="h-screen flex flex-col items-center justify-center">
				<div className="w-full max-w-md">
					{error && <Notification type="error" label={error} className="mb-6" />}

					<form onSubmit={formik.handleSubmit}>
						<TextInput
							type="email"
							id="email"
							label="E-mail"
							className="mb-6"
							required
							onChange={formik.handleChange}
							value={formik.values.email}
							errorText={formik.errors.email}
							invalid={formik.errors.email}
						/>

						<PasswordInput
							label="Mot de passe"
							id="password"
							includeShowPasswordButton
							concealPasswordButtonAriaLabel="Masquer le mot de passe"
							revealPasswordButtonAriaLabel="Afficher le mot de passe"
							className="mb-6"
							required
							onChange={formik.handleChange}
							value={formik.values.password}
							errorText={formik.errors.password}
							invalid={formik.errors.password}
						/>

						<Button type="submit">Se connecter</Button>
					</form>
				</div>
			</div>
		</EmptyLayout>
	);
}
