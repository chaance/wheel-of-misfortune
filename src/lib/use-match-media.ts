import * as React from "react";

export function useMatchMedia(
	query: string,
	options?: {
		initialMatches?: boolean;
		onChange?: (matches: boolean) => void;
		onInitialMatch?: (matches: boolean) => void;
	},
): boolean {
	const { onChange, onInitialMatch, initialMatches = false } = options || {};
	const [matches, setMatches] = React.useState(initialMatches);
	const callbackRef = React.useRef({ onChange, onInitialMatch });
	React.useInsertionEffect(
		() => void (callbackRef.current = { onChange, onInitialMatch }),
		[onChange, onInitialMatch],
	);
	React.useEffect(() => {
		const mediaQueryList = window.matchMedia(query);
		setMatches(mediaQueryList.matches);
		callbackRef.current.onInitialMatch?.(mediaQueryList.matches);
		function handleMatchMediaChange(event: MediaQueryListEvent) {
			callbackRef.current.onChange?.(event.matches);
			return setMatches(event.matches);
		}

		mediaQueryList.addEventListener("change", handleMatchMediaChange);
		return () => {
			mediaQueryList.removeEventListener("change", handleMatchMediaChange);
		};
	}, [query]);

	return matches;
}
