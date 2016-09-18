import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { Router, browserHistory } from 'react-router';
import { Client } from 'subscriptions-transport-ws';

import addGraphQLSubscriptions from '../util/subscriptions';
import routes from '../routes';

import Song from './Song';
import SongList from './SongList';

const PAGE_SONG_LIST = 'PAGE_SONG_LIST';
const PAGE_SONG_DETAILS = 'PAGE_SONG_DETAILS';

class App extends React.Component {
  constructor(props) {
    super(props);

    const wsClient = new Client(location.origin.replace(/^http/, 'ws'));

    this.client = new ApolloClient({
      networkInterface: addGraphQLSubscriptions(
        createNetworkInterface('/graphql'),
        wsClient,
      ),
      dataIdFromObject: r => r.id,
    });
  }

  render() {
    return (
      <ApolloProvider client={this.client}>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
