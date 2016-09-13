import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

import SongWithData from './SongWithData';

class App extends React.Component {
  constructor(...args) {
    super(...args);

    this.client = new ApolloClient({
      networkInterface: createNetworkInterface('http://localhost:5000/graphql'),
      dataIdFromObject: r => r.id,
    });
  }

  componentDidMount() {
    let ws = new WebSocket(location.origin.replace(/^http/, 'ws'));

    ws.onmessage = function (event) {
      console.log(JSON.parse(event.data));
    };
  }

  render() {
    return (
      <ApolloProvider client={this.client}>
        <SongWithData />
      </ApolloProvider>
    );
  }
}

export default App;
