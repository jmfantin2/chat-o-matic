const { GraphQLServer } = require('graphql-yoga');

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
`;

//ok, you got your types, but how do i actually GET the data?
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
			return id;
		},
	},
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(({ port }) => {
	console.log(`Server on http://localhost:${port}/`);
});
