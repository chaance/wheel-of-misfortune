import * as React from "react";

function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
	try {
		if (typeof ref === "function") {
			return ref(value);
		} else if (ref) {
			ref.current = value;
		}
	} catch {
		console.error(
			"Invalid ref value. Expected a function or an object with a `current` property.",
		);
	}
}

export function composeRefs<T>(
	...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
	return (value) => {
		const cleanupFunctions = new Set<() => void>();
		for (const ref of refs) {
			const result = assignRef(ref, value);
			if (typeof result === "function") {
				cleanupFunctions.add(result);
			}
		}

		if (cleanupFunctions.size) {
			return () => {
				for (const cleanup of cleanupFunctions) {
					cleanup();
				}
			};
		}
	};
}

export function useComposedRefs<T>(
	...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
	return React.useMemo(
		() => composeRefs(...refs),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		refs,
	);
}
