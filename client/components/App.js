import React from 'react';
import Relay from 'react-relay';

import { Song, Sequencer, Sampler, Synth } from '../Music';

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
  render() {
    return (
      <Song tempo={this.props.song.tempo || 190}>
        {this.props.song.sequencers.edges.map(edge =>
          <Sequencer key={edge.node.id} resolution={edge.node.resolution} bars={edge.node.bars}>
            {edge.node.instruments.edges.map(edge => renderInstrument(edge.node))}
          </Sequencer>
        )}
      </Song>
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
