import * as React from "react";

type AnyEvent = { defaultPrevented: boolean };

type EventHandler<Event extends AnyEvent> = (event: Event) => void;

export function composeEventHandlers<Event extends AnyEvent>(
	...handlers: Array<EventHandler<Event> | undefined>
) {
	return (event: Event) => {
		for (const handler of handlers) {
			if (event.defaultPrevented) {
				return;
			}
			handler?.(event);
		}
	};
}

export function useComposedEventHandlers<Event extends AnyEvent>(
	...handlers: Array<EventHandler<Event> | undefined>
) {
	return React.useMemo(
		() => composeEventHandlers(...handlers),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		handlers,
	);
}
