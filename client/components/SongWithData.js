import React from 'react';

import { graphql, withApollo } from 'react-apollo';
import update from 'react-addons-update';

import { Song, Analyser, Sequencer, Sampler, Synth } from 'react-music';

import { QUERY_SONG, SUBSCRIPTION_SONG_UPDATED, SUBSCRIPTION_SEQUENCER_ADDED, SUBSCRIPTION_INSTRUMENT_ADDED } from './queries';
import Visualization from './Visualization';

function renderInstrument(instrument) {
  switch (instrument.instrumentType) {
  case 'Sampler':
    return <Sampler key={instrument.id} sample={instrument.data.sample} steps={instrument.data.steps} />;
  case 'Synth':
    return <Synth key={instrument.id} type={instrument.data.type} volume={instrument.data.volume} envelope={instrument.data.envelope} steps={instrument.data.steps} />;
  default:
    console.error('Unknown instrument type: ' + instrument.instrumentType);
  }
}

class SongWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false, // true,
    };

    this.handleAudioProcess = this.handleAudioProcess.bind(this);
    this.handlePlayToggle = this.handlePlayToggle.bind(this);

    this.subscriptionObserverSongUpdated = null;
    this.subscriptionObserverSequencerAdded = null;
    this.subscriptionObserverInstrumentAdded = null;
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

    this.subscriptionObserverInstrumentAdded = this.props.client.subscribe({
      query: SUBSCRIPTION_INSTRUMENT_ADDED,
      variables: { songId },
    }).subscribe({
      next(data) {
        console.log("Instrument added");
        console.log(data);
        updateQuery((previousResult) => {
          return update(previousResult, {
            song: {
              sequencers: {
                [data.instrumentAdded.sequencerId]: {
                  $unshift: [data.instrumentAdded],
                },
              },
            },
          });
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
    if (this.subscriptionObserverInstrumentAdded) {
      this.subscriptionObserverInstrumentAdded.unsubscribe();
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

    console.log('render with tempo ' + this.props.song.tempo);

    return (
      <div>
        <Song playing={this.state.playing} tempo={this.props.song.tempo}>
          <Analyser onAudioProcess={this.handleAudioProcess}>
            {this.props.song.sequencers.map(sequencer =>
              <Sequencer key={sequencer.id} resolution={sequencer.resolution} bars={sequencer.bars}>
                {sequencer.instruments.map(instrument => renderInstrument(instrument))}
              </Sequencer>
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
