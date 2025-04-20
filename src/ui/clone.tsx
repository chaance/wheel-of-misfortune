import * as React from "react";
import { useMergedProps } from "~/lib/use-merged-props";

export function Clone<
	Props extends { children?: React.ReactNode } = { children: React.ReactNode },
>({ children, ...props }: Props): React.ReactNode {
	try {
		const child = React.Children.only(children);
		if (!React.isValidElement(child)) {
			throw new Error();
		}
		const mergedProps = useMergedProps(props, child.props as {});
		return React.cloneElement(child as React.ReactElement, mergedProps);
	} catch {
		throw new Error("Clone component requires a single child element.");
	}
}
