const SYMBOL_ID_PREFIX = "rm-icon";
type IdPrefix = typeof SYMBOL_ID_PREFIX;

export type IconId =
	//
	"x-mark";

type SymbolProps = Omit<React.ComponentProps<"symbol">, "id"> & {
	id: `${IdPrefix}-${IconId}`;
};

const toId = (id: IconId): `${IdPrefix}-${IconId}` => {
	return `${SYMBOL_ID_PREFIX}-${id}`;
};

export function IconSprites() {
	// cheap way to get type-checking for the ID without runtime overhead of a
	// separate component
	const Symbol = "symbol" as unknown as React.ComponentType<SymbolProps>;
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className="sr-only">
			<defs>
				<Symbol viewBox="0 0 24 24" id={toId("x-mark")}>
					<path
						clipRule="evenodd"
						fillRule="evenodd"
						d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
					/>
				</Symbol>
			</defs>
		</svg>
	);
}

type IconProps = Omit<
	React.ComponentProps<"svg">,
	"viewBox" | "xmlns" | "children" | "id"
> & {
	id: IconId;
	alt?: string;
};

export function Icon(props: IconProps) {
	const { id, alt, ...rest } = props;
	return (
		<svg role="img" aria-label={alt} fill="currentColor" {...rest}>
			<use href={`#${toId(id)}`} />
		</svg>
	);
}
