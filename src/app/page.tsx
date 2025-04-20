import * as React from "react";
import { Wheel } from "./spin/wheel";
import styles from "./page.module.css";
import cx from "clsx";
import Link from "next/link";

export default function HomePage() {
	return (
		<div className={styles.root}>
			<header className={styles.header}>
				<h1 className={styles.title}>React Miami</h1>
				<dl className={styles.bio}>
					<div className={styles.bioStat}>
						<dt>🧔‍♂️</dt>
						<dd>chance</dd>
					</div>
					<div className={styles.bioStat}>
						<dt>🛠️</dt>
						<dd>WorkOS</dd>
					</div>
					<div className={styles.bioStat}>
						<dt>🦋</dt>
						<dd>@chance.dev</dd>
					</div>
				</dl>
			</header>
			<SpinButton />
		</div>
	);
}

function SpinButton() {
	return (
		<Link href="/spin" className={cx("button", styles.spinButton)}>
			Let's F*ckin Go
		</Link>
	);
}
