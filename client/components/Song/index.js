import React from 'react';
import update from 'react-addons-update';
import { graphql, withApollo } from 'react-apollo';

import { QUERY_SONG } from '../../api/queries';
import { SUBSCRIPTION_SONG_UPDATED, SUBSCRIPTION_SEQUENCER_ADDED, SUBSCRIPTION_INSTRUMENT_ADDED } from '../../api/subscriptions';
import Sequencer from '../Sequencer';
import Player from '../Player';

class Song extends React.Component {
  constructor(props) {
    super(props);

    this.subscriptionObserverSongUpdated = null;
    this.subscriptionObserverSequencerAdded = null;
    this.subscriptionSongId = null;
  }

  subscribe(songId, updateQuery) {
    this.subscriptionSongId = songId;

    this.subscriptionObserverSongUpdated = this.props.client.subscribe({
      query: SUBSCRIPTION_SONG_UPDATED,
      variables: { songId },
    }).subscribe({
      next(data) {
        updateQuery((previousResult) => {
          return update(previousResult, { song: { $set: data.songUpdated } });
        });
      },
      error(err) { err.forEach(e => console.error(e)) },
    });

    this.subscriptionObserverSequencerAdded = this.props.client.subscribe({
      query: SUBSCRIPTION_SEQUENCER_ADDED,
      variables: { songId },
    }).subscribe({
      next(data) {
        updateQuery((previousResult) => {
          return update(previousResult, { song: { sequencers: { $unshift: [data.sequencerAdded] } } });
        });
      },
      error(err) { err.forEach(e => console.error(e)) },
    });
  }

  unsubscribe() {
    if (this.subscriptionObserverSongUpdated) {
      this.subscriptionObserverSongUpdated.unsubscribe();
    }
    if (this.subscriptionObserverSequencerAdded) {
      this.subscriptionObserverSequencerAdded.unsubscribe();
    }
  }

  componentDidMount() {
    if (this.props.loading === false) {
      this.subscribe(this.props.song.id, this.props.updateQuery);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.subscriptionSongId !== nextProps.song.id) {
      this.unsubscribe();
      this.subscribe(nextProps.song.id, nextProps.updateQuery);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.props.loading) return <div>Loading...</div>;

    return (
      <div>
        {<Player song={this.props.song} />}

        {this.props.song.sequencers.map(sequencer =>
          <Sequencer client={this.props.client} updateQuery={this.props.updateQuery} sequencer={sequencer} key={sequencer.id} />
        )}
      </div>
    );
  }
}

const SongWithData = withApollo(graphql(QUERY_SONG, {
  props: ({data: { loading, updateQuery, song }}) => ({
    loading,
    updateQuery,
    song,
  }),
})(Song));

export default SongWithData;
