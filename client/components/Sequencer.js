import React from 'react';
import update from 'react-addons-update';
import { Sequencer as MusicSequencer, Sampler, Synth } from 'react-music';
import { findIndex } from 'lodash';

import { SUBSCRIPTION_INSTRUMENT_ADDED } from './queries';

class Sequencer extends React.Component {
  constructor(props) {
    super(props);

    this.subscriptionObserverInstrumentAdded = null;
    this.subscriptionInstrumentId = null;
  }

  subscribe(sequencerId, updateQuery) {
    this.subscriptionSequencerId = sequencerId;

    this.subscriptionObserverInstrumentAdded = this.props.client.subscribe({
      query: SUBSCRIPTION_INSTRUMENT_ADDED,
      variables: { sequencerId },
    }).subscribe({
      next(data) {
        updateQuery((previousResult) => {
          const sequencerIdx = findIndex(previousResult.song.sequencers, s => s.id == data.instrumentAdded.sequencerId);

          return update(previousResult, {
            song: {
              sequencers: {
                [sequencerIdx]: {
                  instruments: {
                    $unshift: [data.instrumentAdded],
                  },
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
    if (this.subscriptionObserverInstrumentAdded) {
      this.subscriptionObserverInstrumentAdded.unsubscribe();
    }
  }

  componentDidMount() {
    this.subscribe(this.props.sequencer.id, this.props.updateQuery);
  }

  componentWillReceiveProps(nextProps) {
    if (this.subscriptionSequencerId !== nextProps.sequencer.id) {
      this.unsubscribe();
      this.subscribe(nextProps.sequencer.id, nextProps.updateQuery);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { sequencer } = this.props;

    return (
      <MusicSequencer key={sequencer.id} resolution={sequencer.resolution} bars={sequencer.bars}>
        {sequencer.instruments.map(instrument => this.renderInstrument(instrument))}
      </MusicSequencer>
    );
  }

  renderInstrument(instrument) {
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

export default Sequencer;
