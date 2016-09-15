import React from 'react';
import update from 'react-addons-update';
import { graphql, withApollo } from 'react-apollo';

import { QUERY_SONG } from '../../api/queries';
import { MUTATION_CREATE_SEQUENCER } from '../../api/mutations';
import { SUBSCRIPTION_SONG_UPDATED, SUBSCRIPTION_SEQUENCER_ADDED, SUBSCRIPTION_INSTRUMENT_ADDED } from '../../api/subscriptions';
import { withMutations } from '../../util/mutations';
import { addSequencerToSong } from '../../reducers';
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
        updateQuery((prev) => {
          return addSequencerToSong(prev, data.sequencerAdded);
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

        <button onClick={this.handleCreateSequencer.bind(this)}>Create Sequencer</button>
      </div>
    );
  }

  handleCreateSequencer(instrumentType) {
    this.props.createSequencer(this.props.song.id, 16, 4);
  }
}

const SongWithMutations = withMutations(Song, {
  createSequencer: {
    gql: MUTATION_CREATE_SEQUENCER,
    prop: (mutate, songId, resolution, bars) => mutate({
      variables: { songId, resolution, bars },
      updateQueries: {
        song: (prev, { mutationResult }) => {
          return addSequencerToSong(prev, mutationResult.data.createSequencer);
        },
      },
    }),
  },
});

const SongWithDataAndMutations = withApollo(graphql(QUERY_SONG, {
  options: ({ songId }) => ({ variables: { songId } }),
  props: ({ data: { loading, updateQuery, song } }) => ({
    loading,
    updateQuery,
    song,
  }),
})(SongWithMutations));

export default SongWithDataAndMutations;
