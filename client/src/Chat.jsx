import React, { useState } from 'react';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	useSubscription,
	useMutation,
	gql,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { Container, Row, Col, FormInput, Button } from 'shards-react';

// makes query run through websockets, though i didn't
// exactly understand what changed
const link = new WebSocketLink({
	uri: `ws://localhost:4000`,
	options: {
		reconnect: true,
	},
});

const client = new ApolloClient({
	link,
	// there we go. this should point to our graphql server
	uri: 'http://localhost:4000/',
	cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
	subscription {
		messages {
			id
			content
			user
		}
	}
`;

const POST_MESSAGE = gql`
	mutation ($user: String!, $content: String!) {
		postMessage(user: $user, content: $content)
	}
`;

const Messages = ({ user }) => {
	const { data } = useSubscription(GET_MESSAGES /*{pollInterval: 500}*/);
	// pollInterval is a nasty solution because of request hell
	if (!data) {
		return null;
	}
	return (
		<>
			{data.messages.map(({ id, user: messageUser, content }) => (
				<div
					style={{
						display: 'flex',
						justifyContent:
							user === messageUser ? 'flex-end' : 'flex-start',
						paddingBottom: '1em',
					}}
				>
					{user !== messageUser && (
						<div
							style={{
								height: 50,
								width: 50,
								marginRight: '0.5em',
								border: '2px solid #e5e6ea',
								borderRadius: 25,
								textAlign: 'center',
								fontSize: '18pt',
								paddingTop: 5,
							}}
						>
							{messageUser.slice(0, 2).toUpperCase()}
						</div>
					)}
					<div
						style={{
							background:
								user === messageUser ? '#58bf56' : '#e5e6ea',
							color: user === messageUser ? 'white' : 'black',
							padding: '1em',
							borderRadius: '20px',
							maxWidth: '60%',
						}}
					>
						{content}
					</div>
				</div>
			))}
		</>
	);
};

const Chat = () => {
	//user in state could be provided in some Auth context
	const [state, stateSet] = React.useState({
		user: 'Jack',
		content: '',
	});

	const [postMessage] = useMutation(POST_MESSAGE);
	const onSend = () => {
		if (state.content.length > 0) {
			postMessage({
				variables: state,
			});
		}
		stateSet({
			...state,
			content: '',
		});
	};

	return (
		<Container>
			<Messages user={state.user} />
			<Row>
				<Col xs={2} style={{ padding: 0 }}>
					<FormInput
						label="User"
						value={state.user}
						onChange={(evt) =>
							stateSet({
								...state,
								user: evt.target.value,
							})
						}
					/>
				</Col>
				<Col xs={8}>
					<FormInput
						label="User"
						value={state.content}
						onChange={(evt) =>
							stateSet({
								...state,
								content: evt.target.value,
							})
						}
						onKeyUp={(evt) => {
							if (evt.keyCode === 13) {
								//apparently that's Enter
								onSend();
							}
						}}
					/>
				</Col>
				<Col xs={2} style={{ padding: 0 }}>
					<Button onClick={() => onSend()} style={{ width: '100%' }}>
						Send
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

// ???? this is basically a Context hook
export default () => (
	<ApolloProvider client={client}>
		<Chat />
	</ApolloProvider>
);
