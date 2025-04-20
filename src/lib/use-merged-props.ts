import cx from "clsx";
import { composeEventHandlers } from "~/lib/use-composed-event-handlers";
import { useComposedRefs } from "./use-composed-refs";

export function useMergedProps<SourceProps extends Record<string, any>>(
	source: SourceProps,
	...propObjects: Array<Record<string, any>>
): SourceProps {
	const mergedProps: Record<string, any> = {};
	const refs: any[] = [];
	for (const props of [source, ...propObjects]) {
		for (const key in props) {
			if (key === "className") {
				mergedProps.className = cx(mergedProps.className, props.className);
			} else if (/^on[A-Z]/.test(key)) {
				const previous = mergedProps[key];
				mergedProps[key] = composeEventHandlers(previous, props[key]);
			} else if (key === "ref") {
				refs.push(props.ref);
			} else {
				mergedProps[key] = props[key];
			}
		}
	}
	const ref = useComposedRefs(...refs);
	mergedProps.ref = ref;
	return mergedProps as SourceProps;
}
