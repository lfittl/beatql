import React from 'react';
import update from 'react-addons-update';
import { graphql, withApollo } from 'react-apollo';
import { withRouter } from 'react-router';

import { QUERY_SONG } from '../../api/queries';
import { MUTATION_CREATE_SEQUENCER, MUTATION_DELETE_SONG } from '../../api/mutations';
import { SUBSCRIPTION_SONG_UPDATED, SUBSCRIPTION_SEQUENCER_ADDED, SUBSCRIPTION_INSTRUMENT_ADDED } from '../../api/subscriptions';
import { withMutations } from '../../util/mutations';
import { addSequencerToSong, deleteSongFromSongList, deleteSong } from '../../reducers';
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
    if (nextProps.error) {
      if (nextProps.error.message == 'GraphQL error: Record not found') {
        this.props.router.push('/');
      }
    } else {
      if (this.subscriptionSongId !== nextProps.song.id) {
        this.unsubscribe();
        this.subscribe(nextProps.song.id, nextProps.updateQuery);
      }
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.props.error) {
      return <div className="alert alert-danger">{this.props.error.message}</div>;
    }

    if (this.props.loading) return <div>Loading...</div>;

    return (
      <div>
        <div className="col-md-6">
          <Player song={this.props.song} />
        </div>

        <div className="col-md-6">
          {this.props.song.sequencers.length == 0 && <h3>No sequencers yet</h3>}
          {this.props.song.sequencers.map(sequencer =>
            <Sequencer client={this.props.client} updateQuery={this.props.updateQuery} sequencer={sequencer} key={sequencer.id} />
          )}

          <button className="btn btn-success" onClick={this.handleCreateSequencer.bind(this)}>Create Sequencer</button>
          <button className="btn btn-danger" onClick={this.handleDeleteSong.bind(this)}>Delete Song</button>
        </div>
      </div>
    );
  }

  handleCreateSequencer() {
    this.props.createSequencer(this.props.song.id, 16, 4);
  }

  handleDeleteSong() {
    this.props.deleteSong(this.props.song.id);
    this.props.router.push('/');
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
  deleteSong: {
    gql: MUTATION_DELETE_SONG,
    prop: (mutate, songId) => mutate({
      variables: { songId },
      updateQueries: {
        songList: (prev, { mutationResult }) => {
          return deleteSongFromSongList(prev, mutationResult.data.deleteSong);
        },
      }
    })
  }
});

const SongWithDataAndMutations = withRouter(withApollo(graphql(QUERY_SONG, {
  options: ({ params }) => ({ variables: { songId: params.songId } }),
  props: ({ data: { loading, updateQuery, song, error } }) => ({
    loading,
    updateQuery,
    song,
    error,
  }),
})(SongWithMutations)));

export default SongWithDataAndMutations;
