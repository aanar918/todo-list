"use client";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import Todo from "./components/Todo";
import createApolloClient from "./apollo-client";
import Box from '@mui/material/Box';

function App() {
	const client = createApolloClient();

	return (
		<ApolloProvider client={client}>
			<Todo />;
		</ApolloProvider>
	);
}

export default App;
