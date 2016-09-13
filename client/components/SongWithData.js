import React from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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

class SongWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: true,
    };

    this.handleAudioProcess = this.handleAudioProcess.bind(this);
    this.handlePlayToggle = this.handlePlayToggle.bind(this);
  }

  handleAudioProcess(analyser) {
    this.visualization.audioProcess(analyser);
  }

  handlePlayToggle() {
    this.setState({
      playing: !this.state.playing,
    });
  }

  render() {
    if (this.props.loading) return <div>Loading...</div>;

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

const songQuery = gql`
  query song {
    song {
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
`

const SongWithData = graphql(songQuery, {
  props: ({data: { loading, song }}) => ({
    loading,
    song,
  }),
})(SongWrapper);

export default SongWithData;
