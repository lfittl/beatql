import React from 'react';
import { cloneDeep, map, reject } from 'lodash';
import { graphql } from 'react-apollo';

import Form from './Form';
import { MUTATION_UPDATE_INSTRUMENT, MUTATION_DELETE_INSTRUMENT } from '../../api/mutations';

class Instrument extends React.Component {
  state: {
    editing: boolean,
  };

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
    };
  }

  render() {
    const { instrument } = this.props;

    return (
      <div>
        <h3>Instrument {instrument.id} ({instrument.instrumentType})</h3>
        <div>
          {map(instrument.data, (v, k) => {
            return (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{JSON.stringify(v)}</dd>
              </div>
            );
          })}
        </div>
        <button onClick={this.handleEdit.bind(this)}>Edit</button>
        <button onClick={this.handleDelete.bind(this)}>Delete</button>
        {this.state.editing && <Form instrument={this.props.instrument} handleSubmit={this.handleSubmit.bind(this)} />}
      </div>
    );
  }

  handleEdit() {
    this.setState({ editing: true });
  }

  handleDelete() {
    this.props.deleteInstrument(this.props.instrument.id);
  }

  handleSubmit({ instrumentData }) {
    this.setState({ editing: false });
    this.props.updateInstrument(this.props.instrument.id, instrumentData);
  }
}

const InstrumentWithMutation = graphql(MUTATION_UPDATE_INSTRUMENT, {
  props: ({ mutate }) => ({
    updateInstrument: (instrumentId, data) => mutate({ variables: { instrumentId, data } }),
  }),
})(Instrument);

const InstrumentWithMutation2 = graphql(MUTATION_DELETE_INSTRUMENT, {
  props: ({ mutate }) => ({
    deleteInstrument: (instrumentId) => mutate({
      variables: { instrumentId },
      updateQueries: {
        song: (prev, { mutationResult }) => {
          const deletedId = mutationResult.data.deleteInstrument.id;
          let next = cloneDeep(prev);

          prev.song.sequencers.forEach(sequencer => {
            sequencer.instruments = reject(sequencer.instruments, instrument => instrument.id == deletedId);
          });

          return prev;
        },
      },
    }),
  }),
})(InstrumentWithMutation);

export default InstrumentWithMutation2;
