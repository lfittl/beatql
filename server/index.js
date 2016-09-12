import express from 'express';
import graphQLHTTP from 'express-graphql';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {Schema} from '../data/schema';
import {setupDbListener} from '../data/database';
import path from 'path';
import {Server as WebSocketServer} from 'ws';

const server = require('http').createServer();
const app = express();
const SERVER_PORT = 5000;

app.use('/', express.static(path.resolve(__dirname, '..', 'public')));

app.use('/graphql', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema,
}));

server.on('request', app);
server.listen(SERVER_PORT, () => {
  console.log(`Server is now running on http://localhost:${SERVER_PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setupDbListener((data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
});
