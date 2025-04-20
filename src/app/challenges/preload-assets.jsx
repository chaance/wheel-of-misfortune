import * as React from "react";
import { Layout, WelcomeSurvey } from "~/components";

export function PreloadAssets({ imageUrl, imageAlt }) {
	// need to preload the image when user hovers over the button 🤔
	const dialogRef = React.useRef(null);
	const open = () => dialogRef.current.showModal();
	return (
		<Layout>
			<button onClick={open}>Start Survey</button>
			<dialog ref={dialogRef}>
				<img src={imageUrl} alt={imageAlt} />
				<WelcomeSurvey />
			</dialog>
		</Layout>
	);
}
