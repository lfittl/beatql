import React from 'react';
import Relay from 'react-relay';

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
    return (
      <div>
        <Song playing={this.state.playing} tempo={this.props.song.tempo}>
          <Analyser onAudioProcess={this.handleAudioProcess}>
            {this.props.song.sequencers.edges.map(edge =>
              <Sequencer key={edge.node.id} resolution={edge.node.resolution} bars={edge.node.bars}>
                {edge.node.instruments.edges.map(edge => renderInstrument(edge.node))}
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

class App extends React.Component {
  render() {
    return (
      <div>
        <SongWrapper song={this.props.song} />
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    song: () => Relay.QL`
      fragment on Song {
        tempo
        sequencers(first: 10) {
          edges {
            node {
              id
              resolution
              bars
              instruments(first: 10) {
                edges {
                  node {
                    id
                    instrumentType
                    data
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
});
