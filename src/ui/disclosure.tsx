"use client";

import * as React from "react";
import styles from "./disclosure.module.css";
import { useControllableState } from "~/lib/use-controllable-state";
import cx from "clsx";
import { useId } from "~/lib/use-id";
import { composeEventHandlers } from "~/lib/use-composed-event-handlers";
import { useComposedRefs } from "~/lib/use-composed-refs";
import { useEffectEvent } from "~/lib/use-effect-event";
import { flushSync } from "react-dom";
import { canUseDOM } from "~/lib/utils";

type PartIds = { trigger: string | undefined; panel: string | undefined };

interface DisclosureContextValue {
	expanded: boolean;
	setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
	disabled: boolean;
	rootId: string;
	partIds: PartIds;
	setPartIds: React.Dispatch<React.SetStateAction<PartIds>>;
}

const DisclosureContext = React.createContext<DisclosureContextValue | null>(
	null,
);
DisclosureContext.displayName = "DisclosureContext";

const useDisclosureContext = () => {
	const context = React.use(DisclosureContext);
	if (!context) {
		throw new Error("useDisclosureContext must be used within a Disclosure");
	}
	return context;
};

interface DisclosureOwnProps {
	defaultExpanded?: boolean;
	expanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
	disabled?: boolean;
}

interface DisclosureProps
	extends DisclosureOwnProps,
		Omit<React.ComponentProps<"div">, keyof DisclosureOwnProps> {}

function Disclosure({
	children,
	defaultExpanded = false,
	expanded: expandedProp,
	onExpandedChange,
	className,
	disabled = false,
	...props
}: DisclosureProps) {
	let [expanded, setExpanded] = useControllableState<boolean, boolean, []>(
		expandedProp,
		defaultExpanded,
		onExpandedChange,
	);
	let rootId = useId(props.id, "Disclosure");
	let [partIds, setPartIds] = React.useState<PartIds>({
		panel: undefined,
		trigger: undefined,
	});
	return (
		<div className={cx(styles.Disclosure, className)} {...props}>
			<DisclosureContext
				value={{
					disabled,
					expanded,
					rootId,
					setExpanded,
					partIds,
					setPartIds,
				}}
			>
				{children}
			</DisclosureContext>
		</div>
	);
}
Disclosure.displayName = "Disclosure.Root";

interface DisclosureTriggerOwnProps {}

interface DisclosureTriggerProps
	extends DisclosureTriggerOwnProps,
		Omit<
			React.ComponentProps<"button">,
			| keyof DisclosureTriggerOwnProps
			| "type"
			| "form"
			| "formAction"
			| "formEncType"
			| "formMethod"
			| "formNoValidate"
			| "formTarget"
		> {}

function DisclosureTrigger({
	children,
	className,
	disabled: disabledProp,
	onClick,
	...props
}: DisclosureTriggerProps) {
	const { expanded, setPartIds, partIds, setExpanded, ...context } =
		useDisclosureContext();
	const id = useId(props.id, "DisclosureTrigger");
	React.useEffect(() => {
		setPartIds((ids) => ({ ...ids, trigger: id }));
	}, [id]);
	const disabled = disabledProp || context.disabled;
	return (
		<button
			className={cx(styles.DisclosureTrigger, className)}
			id={partIds.trigger}
			aria-expanded={expanded}
			aria-controls={partIds.panel}
			disabled={disabledProp}
			aria-disabled={disabledProp ? undefined : disabled || undefined}
			tabIndex={disabled ? -1 : undefined}
			onClick={composeEventHandlers(onClick, (event) => {
				if (disabled) {
					event.preventDefault();
					event.stopPropagation();
				} else {
					setExpanded((prev) => !prev);
				}
			})}
			{...props}
			type="button"
		>
			{children}
		</button>
	);
}
DisclosureTrigger.displayName = "Disclosure.Trigger";

interface DisclosurePanelOwnProps {
	/**
	 * Called when the experimental `beforematch` event is fired. Currently only
	 * supported on Chromium-based browsers.
	 */
	onBeforeMatch?: (event: Event) => void;
	searchable?: boolean;
}

interface DisclosurePanelProps
	extends DisclosurePanelOwnProps,
		Omit<React.ComponentProps<"div">, keyof DisclosurePanelOwnProps> {}

function DisclosurePanel({
	children,
	className,
	ref: refProp,
	onBeforeMatch,
	searchable = true,
	...props
}: DisclosurePanelProps) {
	let { expanded, setPartIds, partIds, setExpanded, disabled } =
		useDisclosureContext();
	let id = useId(props.id, "DisclosureTrigger");
	React.useEffect(() => {
		setPartIds((ids) => ({ ...ids, panel: id }));
	}, [id]);

	let panelRef = React.useRef<HTMLDivElement>(null);
	let rafId = React.useRef<number | null>(null);

	let supportsBeforeMatch = canUseDOM && "onbeforematch" in document.body;
	let canSearch =
		supportsBeforeMatch && !disabled && searchable && props.hidden == null;

	React.useEffect(() => {
		const panel = panelRef.current;
		if (!panel || !canSearch) {
			return;
		}

		let handleBeforeMatch = () => {
			rafId.current = window.requestAnimationFrame(() => {
				panel.setAttribute("hidden", "until-found");
			});
			flushSync(() => {
				setExpanded((prev) => !prev);
			});
		};

		panel.addEventListener("beforematch", handleBeforeMatch);
		return () => {
			panel.removeEventListener("beforematch", handleBeforeMatch);
		};
	}, [setExpanded, canSearch]);

	React.useLayoutEffect(() => {
		if (rafId.current) {
			window.cancelAnimationFrame(rafId.current);
		}

		const panel = panelRef.current;
		if (!panel || !canSearch) {
			return;
		}

		// https://github.com/facebook/react/pull/24741
		if (expanded) {
			panel.removeAttribute("hidden");
		} else {
			panel.setAttribute("hidden", "until-found");
		}
	}, [canSearch, expanded]);

	React.useEffect(() => {
		return () => {
			if (rafId.current) {
				window.cancelAnimationFrame(rafId.current);
			}
		};
	}, []);

	let ref = useComposedRefs(refProp, panelRef);

	return (
		<div
			ref={ref}
			className={cx(styles.DisclosurePanel, className)}
			id={partIds.panel}
			role="group"
			aria-expanded={expanded}
			aria-labelledby={partIds.trigger}
			aria-hidden={expanded ? undefined : true}
			hidden={canSearch ? true : !expanded || undefined}
			{...props}
		>
			{children}
		</div>
	);
}
DisclosurePanel.displayName = "Disclosure.Panel";

export {
	Disclosure as Root,
	DisclosureTrigger as Trigger,
	DisclosurePanel as Panel,
};

export type {
	DisclosureProps as RootProps,
	DisclosureTriggerProps as TriggerProps,
	DisclosurePanelProps as PanelProps,
};
