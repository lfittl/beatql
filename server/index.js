import express from 'express';
import graphQLHTTP from 'express-graphql';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {Schema} from '../data/schema';
import subscriptionManager from '../data/subscriptionManager';
import path from 'path';
import {SubscriptionServer} from 'subscriptions-transport-ws';

const httpServer = require('http').createServer();
const app = express();
const SERVER_PORT = process.env.PORT || 5000;

app.use('/', express.static(path.resolve(__dirname, '..', 'public')));

app.use('/graphql', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema,
}));

app.use(express.static(__dirname + '/public'));

app.get('*', (request, response) => {
  response.sendfile('./public/index.html');
});

httpServer.on('request', app);
httpServer.listen(SERVER_PORT, () => {
  console.log(`Server is now running on http://localhost:${SERVER_PORT}`);
});

const subscriptionServer = new SubscriptionServer({ subscriptionManager }, httpServer);
