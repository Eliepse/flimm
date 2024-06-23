import { Form, Input } from "antd";
import FilmListInput from "components/inputs/FilmListInput";

export const SelectionForm = (props) => {
	return (
		<Form validateTrigger={[]} requiredMark={false} {...props}>
			<Form.Item name="name" label="Nom" rules={[{ required: true }]}>
				<Input />
			</Form.Item>

			<Form.Item name="intro" label="Introduction" rules={[{ max: 4096 }]}>
				<Input.TextArea maxLength={4096} autoSize showCount />
			</Form.Item>

			<Form.Item name="films" label="Films" rules={[{ required: true }]}>
				<FilmListInput />
			</Form.Item>
		</Form>
	);
};
