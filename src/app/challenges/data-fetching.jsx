import * as React from "react";
import { fetchPokemonStats } from "~/data";

export function DataFetching({ pokemon }) {
	// need to fetch pokemon state when this component is rendered 🤔
	// function fetchPokemonStats(id): Promise<PokemonStats>
	let [isLoading, setIsLoading] = React.useState(false);
	let [isError, setIsError] = React.useState(false);
	let [data, setData] = React.useState(null);

	let pokemonId = pokemon.id;

	return (
		<div>
			<h1>{pokemon.name}</h1>
			<img src={pokemon.image} alt={pokemon.name} />
			{data && (
				<div>
					<h2>Stats</h2>
					<p>HP: {data.hp}</p>
					<p>Attack: {data.attack}</p>
					<p>Defense: {data.defense}</p>
				</div>
			)}
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error loading data</p>}
		</div>
	);
}
