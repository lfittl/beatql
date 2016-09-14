import express from 'express';
import graphQLHTTP from 'express-graphql';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {Schema} from '../data/schema';
import {pubsub} from '../data/database';
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

const subscriptionManager = new SubscriptionManager({
  schema: Schema,
  pubsub,
  setupFunctions: {
    songUpdated: (options, args) => ({
      songUpdated: result => {
        return result.id === args.songId;
      },
    }),
    sequencerAdded: (options, args) => ({
      sequencerAdded: result => {
        return result.sequencerAdded.songId === args.songId;
      },
    }),
    instrumentAdded: (options, args) => ({
      instrumentAdded: result => {
        console.log(result);
        console.log(args);
        return result.instrumentAdded.sequencerId === args.sequencerId;
      },
    }),
  },
});

const subscriptionServer = new SubscriptionServer({ subscriptionManager }, httpServer);
