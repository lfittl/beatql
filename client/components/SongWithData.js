import React from 'react';
import update from 'react-addons-update';
import { graphql, withApollo } from 'react-apollo';
import { Song, Analyser } from 'react-music';

import { QUERY_SONG, SUBSCRIPTION_SONG_UPDATED, SUBSCRIPTION_SEQUENCER_ADDED, SUBSCRIPTION_INSTRUMENT_ADDED } from './queries';
import Visualization from './Visualization';
import Sequencer from './Sequencer';

class SongWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: true,
    };

    this.handleAudioProcess = this.handleAudioProcess.bind(this);
    this.handlePlayToggle = this.handlePlayToggle.bind(this);

    this.subscriptionObserverSongUpdated = null;
    this.subscriptionObserverSequencerAdded = null;
    this.subscriptionSongId = null;
  }

  handleAudioProcess(analyser) {
    this.visualization.audioProcess(analyser);
  }

  handlePlayToggle() {
    this.setState({
      playing: !this.state.playing,
    });
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
        <Song playing={this.state.playing} tempo={this.props.song.tempo}>
          <Analyser onAudioProcess={this.handleAudioProcess}>
            {this.props.song.sequencers.map(sequencer =>
              <Sequencer client={this.props.client} updateQuery={this.props.updateQuery} sequencer={sequencer} key={sequencer.id} />
            )}
          </Analyser>
        </Song>
        <Visualization ref={(c) => { this.visualization = c; }} />

        <button className="react-music-button" type="button" onClick={this.handlePlayToggle}>
          {this.state.playing ? 'Stop' : 'Play'}
        </button>
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
})(SongWrapper));

export default SongWithData;
