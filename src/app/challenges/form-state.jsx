import * as React from "react";
import { addToCart } from "~/actions";

export function FormState({ item }) {
	// need to show the form's state during and after submission 🤔
	let [isAdding, setIsAdding] = React.useState(false);
	let [message, setMessage] = React.useState(null);
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				let formData = new FormData(event.target);
				let itemID = formData.get("itemID");
				addToCart(itemID);
			}}
		>
			<h2>{item.name}</h2>
			<input type="hidden" name="itemID" value={item.id} />
			<button type="submit">Add to Cart</button>
			{isAdding ? "Adding…" : message}
		</form>
	);
}
