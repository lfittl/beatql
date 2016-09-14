// Taken from https://github.com/apollostack/GitHunt-React/blob/master/ui/subscriptions.js

import { print } from 'graphql-tag/printer';

// quick way to add the subscribe and unsubscribe functions to the network interface
export default function addGraphQLSubscriptions(networkInterface, wsClient) {
  return Object.assign(networkInterface, {
     subscribe(request, handler) {
       return wsClient.subscribe({
         query: print(request.query),
        variables: request.variables,
       }, handler);
     },
     unsubscribe(id: number) {
       wsClient.unsubscribe(id);
     },
  });
}
