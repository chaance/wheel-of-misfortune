import type { Metadata } from "next";
import { Yellowtail } from "next/font/google";
import localFont from "next/font/local";
import "./styles/app.css";
import styles from "./layout.module.css";
import cx from "clsx";
import { IconSprites } from "~/ui/icons";

const yellowtail = Yellowtail({
	weight: ["400"],
	subsets: ["latin"],
	fallback: ["cursive"],
	display: "swap",
	variable: "--font-yellowtail",
});

const clarendon = localFont({
	src: "./clarendon-bold.woff",
	display: "swap",
	variable: "--font-clarendon",
});

const fortuneWheel = localFont({
	src: "./fortune-wheel.ttf",
	display: "swap",
	variable: "--font-fortune-wheel",
});

const berkeleyMono = localFont({
	src: "./berkeley-mono.woff2",
	display: "swap",
	variable: "--font-berkeley-mono",
});

export const metadata: Metadata = {
	title: "React Miami ☀️🌴",
};

interface NavItem {
	path: string;
	label: string;
}

const quizzes: NavItem[] = [
	{ path: "/preload-assets", label: "Preload Assets" },
	{ path: "/optimistic-updates", label: "Optimistic Updates" },
];

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cx(
				yellowtail.variable,
				clarendon.variable,
				fortuneWheel.variable,
				berkeleyMono.variable,
			)}
		>
			<body>
				<div className={cx("rm-root", styles.root)}>
					<main className={styles.main}>
						<Container className={styles.mainContainer}>{children}</Container>
					</main>
				</div>
				<IconSprites />
			</body>
		</html>
	);
}

function Container({
	children,
	className,
}: Readonly<{
	children: React.ReactNode;
	className?: string;
}>) {
	return <div className={cx(styles.container, className)}>{children}</div>;
}
