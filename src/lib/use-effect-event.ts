import * as React from "react";

export function useEffectEvent<T extends (args: any[]) => void>(fn?: T): T {
	const ref = React.useRef<T | null | undefined>(null);
	React.useInsertionEffect(() => {
		ref.current = fn;
	}, [fn]);
	return React.useCallback(
		((...args) => {
			return ref.current?.(...args);
		}) as T,
		[],
	);
}
