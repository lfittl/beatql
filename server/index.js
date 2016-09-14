import express from 'express';
import graphQLHTTP from 'express-graphql';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {Schema} from '../data/schema';
import {setupDbListener} from '../data/database';
import path from 'path';
import {PubSub, SubscriptionManager} from 'graphql-subscriptions';
import {SubscriptionServer} from 'subscriptions-transport-ws';

const httpServer = require('http').createServer();
const app = express();
const SERVER_PORT = 5000;

app.use('/', express.static(path.resolve(__dirname, '..', 'public')));

app.use('/graphql', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema,
}));

httpServer.on('request', app);
httpServer.listen(SERVER_PORT, () => {
  console.log(`Server is now running on http://localhost:${SERVER_PORT}`);
});

// TODO - Postgres comes here
const pubsub = new PubSub();

const subscriptionManager = new SubscriptionManager({
  schema: Schema,
  pubsub,
  setupFunctions: {
    songUpdated: (options, args) => ({
      songUpdated: song => song.id === args.songId,
    }),
  },
});

const subscriptionServer = new SubscriptionServer({ subscriptionManager }, httpServer);

/*const wss = new WebSocketServer({ httpServer });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setupDbListener((data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
});*/
