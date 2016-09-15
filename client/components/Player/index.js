import React from 'react';
import { isEmpty } from 'lodash';
import { Song, Analyser, Sequencer, Sampler, Synth } from 'react-music';

import Visualization from './Visualization';

class Player extends React.Component {
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
        <Visualization ref={(c) => { this.visualization = c; }} />

        <button className="react-music-button" type="button" onClick={this.handlePlayToggle}>
          {this.state.playing ? 'Stop' : 'Play'}
        </button>

        <Song playing={this.state.playing} tempo={this.props.song.tempo}>
          <Analyser onAudioProcess={this.handleAudioProcess}>
            {this.props.song.sequencers.map(sequencer =>
              <Sequencer key={sequencer.id} resolution={sequencer.resolution} bars={sequencer.bars}>
                {sequencer.instruments.map(instrument => this.renderInstrument(instrument))}
              </Sequencer>
            )}
          </Analyser>
        </Song>
      </div>
    );
  }

  renderInstrument(instrument) {
    if (isEmpty(instrument.data)) {
      return null;
    }

    switch (instrument.instrumentType) {
    case 'Sampler':
      return <Sampler key={instrument.id} sample={instrument.data.sample} steps={instrument.data.steps} />;
    case 'Synth':
      return <Synth key={instrument.id} type={instrument.data.type} volume={instrument.data.volume} envelope={instrument.data.envelope} steps={instrument.data.steps} />;
    default:
      console.error('Unknown instrument type: ' + instrument.instrumentType);
    }
  }
}

export default Player;
