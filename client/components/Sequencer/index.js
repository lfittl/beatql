import React from 'react';
import { map } from 'lodash';

import { MUTATION_CREATE_INSTRUMENT } from '../../api/mutations';
import { SUBSCRIPTION_INSTRUMENT_ADDED } from '../../api/subscriptions';
import Instrument from '../Instrument';
import { addInstrumentToSong } from '../../reducers';
import { withMutations } from '../../util/mutations';

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
      next(data) { updateQuery(prev => addInstrumentToSong(prev, data.instrumentAdded)) },
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
      <div>
        <h2>Sequencer {sequencer.id}</h2>
        <div>
          <dt>Bars:</dt>
          <dd>{sequencer.bars}</dd>
          <dt>Resolution:</dt>
          <dd>{sequencer.resolution}</dd>
        </div>

        <h3>Instruments:</h3>
        {map(sequencer.instruments, instrument => <Instrument instrument={instrument} key={instrument.id} />)}

        <button onClick={this.handleCreateInstrument.bind(this, 'Sampler')}>Create Sampler</button>
        <button onClick={this.handleCreateInstrument.bind(this, 'Synth')}>Create Synth</button>
      </div>
    );
  }

  handleCreateInstrument(instrumentType) {
    this.props.createInstrument(this.props.sequencer.id, instrumentType, {});
  }
}

const SequencerWithMutations = withMutations(Sequencer, {
  createInstrument: {
    gql: MUTATION_CREATE_INSTRUMENT,
    prop: (mutate, sequencerId, instrumentType, data) => mutate({
      variables: { sequencerId, instrumentType, data },
      updateQueries: {
        song: (prev, { mutationResult }) => {
          return addInstrumentToSong(prev, mutationResult.data.createInstrument);
        },
      },
    }),
  },
});

export default SequencerWithMutations;
