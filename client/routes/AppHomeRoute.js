import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    song: () => Relay.QL`
      query {
        song
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
