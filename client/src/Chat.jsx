import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
	// there we go. this should point to our graphql server
	uri: 'https://localhost:4000',
	cache: new InMemoryCache(),
});

const Chat = () => {
	return <div>hey i'm a chat</div>;
};

// 🤍 this is basically a Context hook
export default () => (
	<ApolloProvider client={client}>
		<Chat />
	</ApolloProvider>
);
