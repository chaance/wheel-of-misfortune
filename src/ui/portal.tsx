import * as React from "react";
import ReactDOM from "react-dom";
import cx from "clsx";
import {
	composeEventHandlers,
	useComposedEventHandlers,
} from "~/lib/use-composed-event-handlers";
import { composeRefs, useComposedRefs } from "~/lib/use-composed-refs";
import { Clone } from "./clone";

const PORTAL_NAME = "Portal";

type PrimitiveDivProps = React.ComponentPropsWithRef<"div">;

type MountNode = Element | DocumentFragment;
interface PortalOwnProps {
	container?: MountNode | null;
	as?: "div" | "span";
	asChild?: boolean;
}

interface PortalProps
	extends PortalOwnProps,
		Omit<React.ComponentPropsWithRef<"div">, keyof PortalOwnProps> {}

function Portal(props: PortalProps) {
	const {
		container: containerProp,
		as: Component = "div",
		asChild,
		children,
		...portalProps
	} = props;

	const [mountNode, setMountNode] = React.useState<MountNode | null>(
		containerProp ?? null,
	);
	React.useLayoutEffect(
		() => setMountNode(containerProp || globalThis.document.body),
		[containerProp],
	);

	return mountNode
		? ReactDOM.createPortal(
				asChild ? (
					<Clone {...portalProps}>{children}</Clone>
				) : (
					<Component {...portalProps}>{children}</Component>
				),
				mountNode,
			)
		: null;
}

export { Portal };
export type { PortalProps };
