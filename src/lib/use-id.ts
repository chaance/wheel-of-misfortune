import * as React from "react";

export function useId(
	fallbackId: string | number | null | undefined,
	prefix?: string,
) {
	const generatedId = React.useId();
	if (fallbackId != null) {
		return String(fallbackId);
	}

	return `${prefix}${generatedId}`;
}
