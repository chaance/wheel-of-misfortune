"use client";
import * as React from "react";
import { Portal } from "./portal";
import { useComposedRefs } from "~/lib/use-composed-refs";
import cx from "clsx";
import styles from "./dialog.module.css";
import { Icon } from "./icons";
import { composeEventHandlers } from "~/lib/use-composed-event-handlers";

const DialogContext = React.createContext<{
	dialogRef: React.RefObject<HTMLDialogElement | null>;
}>(null!);
DialogContext.displayName = "DialogContext";

function DialogRoot({ children }: { children: React.ReactNode }) {
	const dialogRef = React.useRef<HTMLDialogElement>(null);
	return <DialogContext value={{ dialogRef }}>{children}</DialogContext>;
}

function DialogTrigger({
	children,
}: {
	children: React.ReactElement<React.ComponentProps<"button">>;
}) {
	const { dialogRef } = React.use(DialogContext);
	return React.cloneElement(
		children,
		{
			type: "button",
			onClick: () => {
				dialogRef.current?.showModal();
			},
		},
		children.props?.children,
	);
}

interface DialogOwnProps {
	children?: React.ReactNode;
	onOpenChange?(open: boolean): void;
}

interface DialogProps
	extends DialogOwnProps,
		Omit<React.ComponentPropsWithRef<"dialog">, keyof DialogOwnProps> {}

function Dialog({
	ref: forwardedRef,
	onOpenChange,
	children,
	className,
	onClick,
	...props
}: DialogProps) {
	const { dialogRef } = React.use(DialogContext);
	let [dialogElement, setDialogElement] =
		React.useState<HTMLDialogElement | null>(null);
	let open = React.useSyncExternalStore(
		React.useCallback(
			function subscribe(callback) {
				if (!dialogElement) {
					callback();
					return () => void 0;
				}

				// currently no widely-supported events fired for when a dialog is
				// opened, so subscribe to the state via mutations to the `open`
				// attribute
				const observer = new MutationObserver((mutationList) => {
					for (const mutation of mutationList) {
						if (
							mutation.type === "attributes" &&
							mutation.attributeName === "open"
						) {
							callback();
						}
					}
				});
				observer.observe(dialogElement, { attributes: true });
				return () => {
					observer.disconnect();
				};
			},
			[dialogElement],
		),
		React.useCallback(
			function getSnapshot() {
				return dialogElement?.open ?? false;
			},
			[dialogElement],
		),
		() => false,
	);

	const bodyOverflowRef = React.useRef<string | null>(null);
	const openRef = React.useRef(open);
	React.useEffect(() => {
		if (!dialogElement) {
			return;
		}

		const wasOpen = openRef.current;
		openRef.current = open;
		if (wasOpen === open) {
			return;
		}

		const document = dialogElement.ownerDocument;
		if (open) {
			bodyOverflowRef.current = document.body.style.overflow;
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = bodyOverflowRef.current ?? "";
			bodyOverflowRef.current = null;
		}
	}, [dialogElement, open]);

	const composedRefs = useComposedRefs(
		forwardedRef,
		dialogRef,
		setDialogElement,
	);

	return (
		<Portal asChild>
			<dialog
				ref={composedRefs}
				data-state={getState(open)}
				className={cx(className, styles.Dialog)}
				onClick={composeEventHandlers(onClick, (event) => {
					if ((event.target as HTMLElement).nodeName === "DIALOG") {
						(event.target as HTMLDialogElement).close("dismiss");
					}
				})}
				{...props}
			>
				<div className={cx(className, styles.DialogContent)}>{children}</div>
				<form method="dialog" className={cx(styles.DialogCloseForm)}>
					<button className={cx(styles.DialogCloseButton)}>
						<Icon
							aria-hidden
							id="x-mark"
							className={cx(styles.DialogCloseIcon)}
							role={undefined}
						/>
						<span className="sr-only">Close dialog</span>
					</button>
				</form>
			</dialog>
		</Portal>
	);
}

function getState(open: boolean) {
	return open ? "open" : "closed";
}

export { Dialog, DialogRoot, DialogTrigger };
export type { DialogProps };
