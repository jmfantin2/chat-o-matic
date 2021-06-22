import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import './index.css';

import Chat from 'chat/Chat';

import { Container } from 'shards-react';

const App = () => (
	<Container>
		<p>
			We knew the world would not be the same. Few people laughed. Few
			people cried. Most people were silent. I remember the line of the
			hindu scripture, the Bhagavad Gita. Vishnu is trying to persuade the
			prince that he should do his duty and, to impress him, takes on his
			multiarmed form and says "Now I am the commander, the destroyer of
			worlds". I suppose we all thought that, in a way or another.
		</p>
		<h1>Chat!</h1>
		<Chat />
		<p>
			We knew the world would not be the same. Few people laughed. Few
			people cried. Most people were silent. I remember the line of the
			hindu scripture, the Bhagavad Gita. Vishnu is trying to persuade the
			prince that he should do his duty and, to impress him, takes on his
			multiarmed form and says "Now I am the commander, the destroyer of
			worlds". I suppose we all thought that, in a way or another.
		</p>
	</Container>
);

ReactDOM.render(<App />, document.getElementById('app'));
