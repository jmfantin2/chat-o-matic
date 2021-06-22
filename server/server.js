// PubSub saves your ass when having to give that realtime feel
// by preventing timed overload and only bringing in new data
// when it actually is posted
const { GraphQLServer, PubSub } = require('graphql-yoga');

//this will store retrieved data
const messages = [];

// every graphql server needs types to define a schema
const typeDefs = `
  type Message {
    id: ID!
    user: String!
    content: String!
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    postMessage(user: String!, content: String!): ID!
  }

	type Subscription {
		messages: [Message!]
	}
`;

// yay
const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

// ok, you got your types, but how do i actually GET the data?
const resolvers = {
	Query: {
		messages: () => messages,
	},
	Mutation: {
		postMessage: (parent, { user, content }) => {
			const id = messages.length;
			messages.push({
				id,
				user,
				content,
			});
			subscribers.forEach((fn) => fn());
			return id;
		},
	},
	Subscription: {
		messages: {
			subscribe: (parent, args, { pubsub }) => {
				// ok a bit of dark magic
				const channel = Math.random().toString(36).slice(2, 15);
				onMessagesUpdates(() => pubsub.publish(channel, { messages }));
				setTimeout(() => pubsub.publish(channel, { messages }), 0);
				return pubsub.asyncIterator(channel);
			},
		},
	},
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

server.start(({ port }) => {
	console.log(`Server on http://localhost:${port}/`);
});
