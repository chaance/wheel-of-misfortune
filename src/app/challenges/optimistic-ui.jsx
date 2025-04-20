import * as React from "react";
import { useTodosMutation } from "~/data";
import { Todo } from "~/components";

export function OptimisticUI({ todos }) {
	// need to update todo state before mutation is complete 🤔
	const todosMutation = useTodosMutation();
	return (
		<Todo.List>
			{todos.map((todo) => (
				<Todo.Item key={todo.id}>
					<Todo.Checkbox
						checked={todo.completed}
						onCheck={() => {
							todosMutation.mutate(todo.id, {
								completed: !todo.completed,
							});
						}}
					/>
					<Todo.Text>{todo.text}</Todo.Text>
				</Todo.Item>
			))}
		</Todo.List>
	);
}
