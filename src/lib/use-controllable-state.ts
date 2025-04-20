/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import * as React from "react";

type Dispatcher<T, A extends any[] = any[]> = (
	value: T | ((prevState: T) => T),
	...args: A
) => void;

export function useControllableState<T, C = T, A extends any[] = any[]>(
	value: Exclude<T, undefined>,
	defaultValue: Exclude<T, undefined> | undefined,
	onChange?: (v: C, ...args: A) => void,
): [T, Dispatcher<T, A>];

export function useControllableState<T, C = T, A extends any[] = any[]>(
	value: Exclude<T, undefined> | undefined,
	defaultValue: Exclude<T, undefined>,
	onChange?: (v: C, ...args: A) => void,
): [T, Dispatcher<T, A>];

export function useControllableState<T, C = T, A extends any[] = any[]>(
	value: T,
	defaultValue: T,
	onChange?: (v: C, ...args: A) => void,
): [T, Dispatcher<T, A>] {
	let [stateValue, setStateValue] = React.useState(value || defaultValue);
	let isControlled = value !== undefined;
	let currentValue = isControlled ? value : stateValue;
	let setValue = React.useCallback<Dispatcher<T, A>>(
		(value, ...args) => {
			let onChangeCaller = (value: C, ...onChangeArgs: A) => {
				if (onChange && !Object.is(currentValue, value)) {
					onChange(value, ...onChangeArgs);
				}
				if (!isControlled) {
					// If uncontrolled, mutate the currentValue local variable so that
					// calling setState multiple times with the same value only emits
					// onChange once. We do not use a ref for this because we specifically
					// _do_ want the value to reset every render, and assigning to a ref
					// in render breaks aborted suspended renders.
					// eslint-disable-next-line react-hooks/exhaustive-deps
					currentValue = value as unknown as T;
				}
			};

			if (isFunction(value)) {
				// this supports functional updates https://reactjs.org/docs/hooks-reference.html#functional-updates
				// when someone using useControllableState calls
				// setControlledState(myFunc) this will call our useState setState with
				// a function as well which invokes myFunc and calls onChange with the
				// value from myFunc if we're in an uncontrolled state, then we also
				// return the value of myFunc which to setState looks as though it was
				// just called with myFunc from the beginning otherwise we just return
				// the controlled value, which won't cause a rerender because React
				// knows to bail out when the value is the same
				let updateFunction = (oldValue: T, ...functionArgs: any[]) => {
					let interceptedValue = value(
						isControlled ? currentValue : oldValue,
						// @ts-expect-error
						...functionArgs,
					);
					onChangeCaller(interceptedValue as unknown as C, ...args);
					if (!isControlled) {
						return interceptedValue;
					}
					return oldValue;
				};
				setStateValue(updateFunction);
			} else {
				if (!isControlled) {
					setStateValue(value);
				}
				onChangeCaller(value as unknown as C, ...args);
			}
		},
		[isControlled, currentValue, onChange],
	);

	return [currentValue, setValue];
}

function isFunction(value: unknown): value is (...args: any[]) => any {
	return typeof value === "function";
}
