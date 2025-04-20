import * as React from "react";
import { fetchPokemonStats } from "~/data";

export async function DataFetching({ pokemon }) {
	let state = { current: "init", data: null };
	try {
		state.data = await fetchPokemonStats(pokemon.id);
		state.current = "loaded";
	} catch (error) {
		state.current = "error";
		state.error = error.message;
	}

	return (
		<div>
			<h1>{pokemon.name}</h1>
			<img src={pokemon.image} alt={pokemon.name} />
			{state.current === "loaded" && (
				<div>
					<h2>Stats</h2>
					<p>HP: {state.data.hp}</p>
					<p>Attack: {state.data.attack}</p>
					<p>Defense: {state.data.defense}</p>
				</div>
			)}
			{state.current === "error" && <p>Error loading data</p>}
		</div>
	);
}
