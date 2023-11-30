import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client";
import createApolloClient from "../apollo-client";
import makeStyles from "@material-ui/core/styles/makeStyles";
import "./styles.css";

const GET_TODOS = gql`
	query {
		todos {
			id
			text
			completed
			order
		}
	}
`;

const ADD_TODO = gql`
	mutation AddTodo($text: String!) {
		addTodo(text: $text) {
			id
			text
			completed
			order
		}
	}
`;

const TOGGLE_TODO = gql`
	mutation ToggleTodo($id: ID!) {
		toggleTodo(id: $id) {
			id
			completed
		}
	}
`;

const useStyles = makeStyles({
	flexPaper: {
		flex: 1,
		margin: 16,
		minWidth: 350,
	},
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
});
export default function App() {
	const classes = useStyles();
	const { loading, data } = useQuery(GET_TODOS);

	const [addTodo] = useMutation(ADD_TODO, {
		refetchQueries: [{ query: GET_TODOS }],
	});

	const [toggleTodo] = useMutation(TOGGLE_TODO, {
		refetchQueries: [{ query: GET_TODOS }],
	});

	const [newTodo, setNewTodo] = useState("");

	const handleAddTodo = async () => {
		if (newTodo.trim() !== "") {
			await addTodo({
				variables: { text: newTodo },
			});
			setNewTodo("");
		}
	};

	useEffect(() => {
		// addTodo({
		// 	variables: { text: "newTodo" },
		// });
	}, []);

	const handleToggleTodo = async (id) => {
		await toggleTodo({
			variables: { id },
		});
	};

	return (
		<div>
			<h1>Todo List</h1>
			<div>
				<input
					type="text"
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
				/>
				<button onClick={handleAddTodo}>Add Todo</button>
			</div>
			{loading ? (
				<p>Loading...</p>
			) : (
				<ul>
					{data.todos.map((todo) => (
						<li
							key={todo.id}
							style={{
								textDecoration: todo.completed
									? "line-through"
									: "none",
							}}
							onClick={() => handleToggleTodo(todo.id)}
						>
							{todo.text}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
