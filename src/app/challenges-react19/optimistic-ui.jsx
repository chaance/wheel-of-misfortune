import * as React from "react";
import { useTodosMutation } from "~/data";
import { Todo } from "~/components";

export function OptimisticUI({ todos }) {
	// need to update todo state before mutation is complete 🤔
	const todosMutation = useTodosMutation();
	const [optimisticTodos, updateOptimisticTodo] = useOptimistic(
		todos,
		(todos, { id, completed }) => {
			let todo = todos.find((todo) => todo.id === id);
			return [
				...todos.slice(0, todos.indexOf(todo)),
				{ ...todo, completed: !completed },
				...todos.slice(todos.indexOf(todo) + 1),
			];
		},
	);

	async function toggleTodo(todo) {
		updateOptimisticTodo(todo);
		await todosMutation.mutate(todo.id, {
			completed: checked,
		});
	}

	return (
		<Todo.List>
			{optimisticTodos.map((todo) => (
				<Todo.Item key={todo.id}>
					<Todo.Checkbox
						checked={todo.completed}
						onCheck={() => toggleTodo(todo)}
					/>
					<Todo.Text>{todo.text}</Todo.Text>
				</Todo.Item>
			))}
		</Todo.List>
	);
}
