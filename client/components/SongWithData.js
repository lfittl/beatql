import React from 'react';

import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'react-addons-update';

import { Song, Analyser, Sequencer, Sampler, Synth } from 'react-music';
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

const INITIAL_QUERY = gql`
  query song {
    song {
      id
      tempo
      sequencers {
        id
        resolution
        bars
        instruments {
          id
          instrumentType
          data
        }
      }
    }
  }
`;

const SUBSCRIPTION_QUERY = gql`
  subscription onSongUpdated($songId: String!){
    songUpdated(songId: $songId){
      id
      tempo
      sequencers {
        id
        resolution
        bars
        instruments {
          id
          instrumentType
          data
        }
      }
    }
  }
`;

class SongWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: true,
    };

    this.handleAudioProcess = this.handleAudioProcess.bind(this);
    this.handlePlayToggle = this.handlePlayToggle.bind(this);

    this.subscriptionObserver = null;
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

  subscribe(songId, updateSongQuery) {
    this.subscriptionSongId = songId;
    this.subscriptionObserver = this.props.client.subscribe({
      query: SUBSCRIPTION_QUERY,
      variables: { songId },
    }).subscribe({
      next(data) {
        const newSong = data.songUpdated;
        updateSongQuery((previousResult) => {
          return update(previousResult, { song: { $set: newSong } });
        });
      },
      error(err) { err.forEach(e => console.error(e)); },
    });
  }

  componentDidMount() {
    if (this.props.loading === false) {
      this.subscribe(this.props.song.id, this.props.updateSongQuery);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.subscriptionSongId !== nextProps.song.id) {
      if (this.subscriptionObserver) {
        this.subscriptionObserver.unsubscribe();
      }
      this.subscribe(nextProps.song.id, nextProps.updateSongQuery);
    }
  }

  componentWillUnmount() {
    if (this.subscriptionObserver) {
      this.subscriptionObserver.unsubscribe();
    }
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

const SongWithData = withApollo(graphql(INITIAL_QUERY, {
  props: ({data: { loading, song, updateQuery }}) => ({
    loading,
    song,
    updateSongQuery: updateQuery,
  }),
})(SongWrapper));

export default SongWithData;
