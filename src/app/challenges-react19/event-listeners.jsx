import * as React from "react";
import { track } from "~/tracking";
import { WelcomeSurvey } from "~/components";

export function EventListeners({ dialogRef }) {
	function onBeforeToggle(event) {
		if (event.newState === "open") {
			track("survey_opened");
		}
	}

	return (
		<dialog
			ref={(dialog) => {
				dialog?.addEventListener("beforetoggle", onBeforeToggle);
				return () => {
					dialog?.removeEventListener("beforetoggle", onBeforeToggle);
				};
			}}
		>
			<WelcomeSurvey />
			<form method="dialog">
				<button>Cancel</button>
			</form>
		</dialog>
	);
}
