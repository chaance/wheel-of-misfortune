import * as React from "react";
import * as ReactDOM from "react-dom";
import { Layout, WelcomeSurvey } from "~/components";

export function PreloadAssets({ imageUrl, imageAlt }) {
	const dialogRef = React.useRef(null);
	const open = () => dialogRef.current.showModal();
	return (
		<Layout>
			<button
				onClick={open}
				onMouseEnter={() => {
					ReactDOM.preload(imageUrl, { as: "image" });
				}}
			>
				Start Survey
			</button>
			<dialog ref={dialogRef}>
				<img src={imageUrl} alt={imageAlt} />
				<WelcomeSurvey />
			</dialog>
		</Layout>
	);
}
