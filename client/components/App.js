import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

import { Client } from 'subscriptions-transport-ws';
import addGraphQLSubscriptions from '../util/subscriptions';

import Song from './Song';

class App extends React.Component {
  constructor(...args) {
    super(...args);

    const wsClient = new Client(location.origin.replace(/^http/, 'ws'));

    this.client = new ApolloClient({
      networkInterface: addGraphQLSubscriptions(
        createNetworkInterface('http://localhost:5000/graphql'),
        wsClient,
      ),
      dataIdFromObject: r => r.id,
    });
  }

  render() {
    return (
      <ApolloProvider client={this.client}>
        <Song />
      </ApolloProvider>
    );
  }
}

export default App;
