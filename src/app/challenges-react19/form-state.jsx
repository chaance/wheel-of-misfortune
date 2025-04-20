import * as React from "react";
import { addToCart } from "~/actions";

// action file...
("use server");

export async function addToCartAction(prevState, formData) {
	try {
		let id = formData.get("itemID");
		if (!id) return "Item ID is required";

		await addToCart(formData.get("itemID"));
		return "Added to cart!";
	} catch {
		return "Sold out!";
	}
}

// component file...

export function FormState({ item }) {
	let [message, formAction, isAdding] = React.useActionState(
		addToCartAction,
		null,
	);

	return (
		<form action={formAction}>
			<h2>{item.name}</h2>
			<input type="hidden" name="itemID" value={item.id} />
			<button type="submit">Add to Cart</button>
			{isAdding ? "Adding…" : message}
		</form>
	);
}
