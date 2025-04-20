"use client";

import * as React from "react";
import styles from "./wheel.module.css";

interface Segment {
	path: string;
	value: string;
	color: string;
}

const segments: Segment[] = [
	{
		value: "Preload assets",
		color: "#ffc221",
		path: "/preload-assets",
	},
	{
		value: "Optimistic updates",
		color: "#90ebff",
		path: "/optimistic-updates",
	},
	{ value: "Form state", color: "#f74d9e", path: "/form-state" },
	{
		value: "Data fetching",
		color: "var(--color-pink-11)",
		path: "/data-fetching",
	},
	{
		value: "Event listeners",
		color: "var(--color-yellow-9)",
		path: "/event-listeners",
	},
	{
		value: "Page metadata",
		color: "#2FEEDB",
		path: "/page-metadata",
	},
	{ value: "Scoped styles", color: "#e997b7", path: "/scoped-styles" },
	{ value: "Bankrupt", color: "#222", path: "/bankrupt" },
];

// prettier-ignore
const CONTESTANTS = [
	{ id: "dave-kiss", name: "Dave Kiss", challenge: "Page metadata" },
	{ id: "mike-hartington", name: "Mike Hartington", challenge: "Event listeners" },
	{ id: "adam-rackis", name: "Adam Rackis", challenge: "Optimistic updates" },
	{ id: "david-k-piano", name: "David K. Piano", challenge: "Data fetching" },
] as const;

type Contestant = (typeof CONTESTANTS)[number];

const WHEEL_SIZE = 600;

type WheelTarget = { segment: Segment; angle: number };

type WheelState =
	| {
			state: "idle";
			segment: Segment;
			angle: number;
			target: null;
			error: string | null;
			spinCount: number;
			contestant: Contestant | null;
	  }
	| {
			state: "spinning";
			segment: Segment;
			angle: number;
			target: WheelTarget;
			error: null;
			spinCount: number;
			contestant: Contestant | null;
	  };

type WheelAction =
	| { type: "spin"; index: number; immediate?: boolean }
	| { type: "next-contestant" }
	| { type: "stop" };

export function Wheel() {
	let [state, dispatch] = React.useReducer(
		(state: WheelState, action: WheelAction): WheelState => {
			switch (action.type) {
				case "spin": {
					if (state.state === "spinning") {
						return state;
					}

					const index = action.index;
					const segment = segments[index];
					if (!segment) {
						return {
							...state,
							error: "Invalid segment index",
						};
					}

					let spins = 10; // Number of full spins
					let targetAngle = spins * 360 - index * (360 / segments.length);
					// find angle offset of current segment
					let currentIndex = segments.indexOf(state.segment);
					let offset = currentIndex * (360 / segments.length);
					let finalAngle = targetAngle + offset;
					return {
						contestant: state.contestant,
						error: null,
						state: "spinning",
						segment: action.immediate ? segment : state.segment,
						angle: state.angle,
						spinCount: state.spinCount + 1,
						target: {
							segment,
							angle: state.angle + finalAngle,
						},
					};
				}
				case "stop": {
					if (state.state !== "spinning") {
						return state;
					}

					return {
						contestant: state.contestant,
						state: "idle",
						error: null,
						segment: state.target.segment,
						angle: state.target.angle,
						target: null,
						spinCount: state.spinCount,
					};
				}
				case "next-contestant": {
					if (state.state === "spinning") {
						return state;
					}
					if (state.contestant === null) {
						return {
							...state,
							contestant: CONTESTANTS[0],
						};
					}
					if (
						Object.is(state.contestant, CONTESTANTS[CONTESTANTS.length - 1])
					) {
						return {
							...state,
							contestant: null,
						};
					}

					const currentIndex = CONTESTANTS.findIndex(
						(contestant) => contestant.id === state.contestant?.id,
					);
					const nextIndex = (currentIndex + 1) % CONTESTANTS.length;
					const nextContestant = CONTESTANTS[nextIndex];
					if (nextContestant) {
						return {
							...state,
							contestant: nextContestant,
						};
					}

					return state;
				}
			}

			return state;
		},
		{
			contestant: null,
			state: "idle",
			segment: segments[0]!,
			angle: 118,
			target: null,
			error: null,
			spinCount: 0,
		},
	);

	function spinRandom() {
		let index = Math.floor(Math.random() * segments.length);
		dispatch({ type: "spin", index });
	}

	React.useEffect(() => {
		const spin = new Audio("/spin.mp3");
		const bankrupt = new Audio("/bankrupt.mp3");
		if (state.state === "spinning") {
			spin.play();
		} else if (state.segment.value === "Bankrupt") {
			spin.pause();
			bankrupt.play();
		}
		return () => {
			spin.pause();
			spin.currentTime = 0;
			bankrupt.pause();
			bankrupt.currentTime = 0;
		};
	}, [state]);

	const renderContestantName = () => {
		const index = 0;
	};

	const contestant = state.contestant;
	const tryCount = React.useRef(0);

	return (
		<section className={styles.root}>
			<h3
				className={styles.contestant}
				role="button"
				tabIndex={0}
				onClick={() => {
					dispatch({ type: "next-contestant" });
				}}
				onKeyDown={(event) => {
					if (event.key === "Enter" || event.key === " ") {
						dispatch({ type: "next-contestant" });
					}
				}}
			>
				<>
					<span>Next up: </span>
					<span className={styles.contestantName}>
						{contestant?.name || "Who's next?"}
					</span>
				</>
			</h3>
			<div
				className={styles.wheelContainer}
				style={{
					// @ts-expect-error
					"--_items": segments.length,
					"--wheel-size": `${WHEEL_SIZE}px`,
				}}
				onTransitionEnd={() => dispatch({ type: "stop" })}
			>
				<ul
					data-item-count={segments.length}
					className={styles.wheel}
					style={{
						// @ts-expect-error
						"--rotation": `${(state.state === "spinning" ? state.target.angle : state.angle) + 266}deg`,
					}}
				>
					{segments.map((segment, index) => (
						<li
							key={segment.value}
							className={styles.wheelSegment}
							data-value={segment.value}
							style={{
								// @ts-expect-error
								"--_color-bg": segment.color,
								"--_color-fg": segment.value === "Bankrupt" ? "#fff" : "#000",
								"--_index": index,
							}}
						>
							<span
								className={styles.wheelSegmentValue}
								data-value={segment.value}
							>
								{segment.value}
							</span>
						</li>
					))}
				</ul>
				<button
					className={styles.spinButton}
					onClick={spinRandom}
					type="button"
					aria-label="Spin the wheel"
				>
					React 19
				</button>
			</div>
		</section>
	);
}
