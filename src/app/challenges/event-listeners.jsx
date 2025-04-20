import * as React from "react";
import { track } from "~/tracking";
import { WelcomeSurvey } from "~/components";

export function EventListeners({ dialogRef }) {
	// need to attach an event React DOM doesn't support 🤔
	function onBeforeToggle(event) {
		if (event.newState === "open") {
			track("survey_opened");
		}
	}

	return (
		<dialog ref={dialogRef}>
			<WelcomeSurvey />
			<form method="dialog">
				<button>Cancel</button>
			</form>
		</dialog>
	);
}
