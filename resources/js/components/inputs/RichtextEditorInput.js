import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { Skeleton } from "antd";
import PropTypes from "prop-types";
import { DEFAULT_TOOLS, makeImageTool } from "configs/editorjsConfig";

const RichtextEditorInput = ({ value, imageEndpoint, loading = false, onChange, ...rest }) => {
	const ref = useRef();
	const editorRef = useRef();
	const [isReady, setIsReady] = useState(false);
	const previousTimestamp = useRef(0);

	/** @param {EditorJS} editor */
	function handleChange(editor) {
		editor.saver.save().then((data) => {
			previousTimestamp.current = data.time;
			onChange(data);
		});
	}

	/**
	 * This use effect handle initializing content when ready,
	 * and update the Editor when the value changes.
	 */
	useEffect(() => {
		if (!isReady || !editorRef.current || !value || loading) {
			return;
		}

		/** @var {EditorJS} */
		const editor = editorRef.current;

		// Prevent update loop
		if (previousTimestamp.current >= value.time) {
			return;
		}

		// Update editorjs content
		editor.render(value);

		// Keep the timestamp to prevent update loop
		previousTimestamp.current = value.time;
	}, [isReady, loading, value]);

	/**
	 * This useEffect creates the editor itself.
	 */
	useEffect(() => {
		if (loading) {
			return;
		}

		//noinspection JSValidateTypes,JSCheckFunctionSignatures
		editorRef.current = new EditorJS({
			holder: ref.current,
			onReady: () => setIsReady(true),
			onChange: handleChange,
			data: {},
			logLevel: "ERROR",
			minHeight: 150,
			placeholder: "Écrivez votre article ici...",
			tools: {
				...DEFAULT_TOOLS,
				image: makeImageTool(imageEndpoint),
			},
		});

		//eslint-disable-next-line
	}, [loading]);

	if (loading) {
		return <Skeleton active loading />;
	}

	return <div {...rest} ref={ref} />;
};

RichtextEditorInput.propTypes = {
	value: PropTypes.exact({
		time: PropTypes.number.isRequired,
		blocks: PropTypes.array.isRequired,
		version: PropTypes.string,
	}),
	imageEndpoint: PropTypes.string.isRequired,
	loading: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
};

export default RichtextEditorInput;
