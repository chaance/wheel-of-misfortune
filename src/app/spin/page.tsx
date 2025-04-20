import * as React from "react";
import { Wheel } from "./wheel";
import styles from "./page.module.css";
import layoutStyles from "../layout.module.css";

export default function HomePage() {
	return (
		<div className={styles.root}>
			<header className={styles.header}>
				<h1 className={layoutStyles.title}>React Miami</h1>
				<p className={styles.subTitle}>Wheel of Misfortune</p>
			</header>
			<Wheel />
		</div>
	);
}
