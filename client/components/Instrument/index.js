import React from 'react';
import { cloneDeep, map, reject } from 'lodash';

import Form from './Form';
import { MUTATION_UPDATE_INSTRUMENT, MUTATION_DELETE_INSTRUMENT } from '../../api/mutations';
import { deleteInstrumentFromSong } from '../../reducers';
import { withMutations } from '../../util/mutations';

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
        <h4>{instrument.instrumentType} Instrument <small>{instrument.id}</small></h4>
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
        <div className="btn-group">
          <button className="btn btn-primary btn-sm" onClick={this.handleEdit.bind(this)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={this.handleDelete.bind(this)}>Delete</button>
        </div>
        {this.state.editing && <Form instrument={this.props.instrument} handleSubmit={this.handleSubmit.bind(this)} />}
        <hr />
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

const InstrumentWithMutations = withMutations(Instrument, {
  updateInstrument: {
    gql: MUTATION_UPDATE_INSTRUMENT,
    prop: (mutate, instrumentId, data) => mutate({
      variables: { instrumentId, data }
    }),
  },
  deleteInstrument: {
    gql: MUTATION_DELETE_INSTRUMENT,
    prop: (mutate, instrumentId) => mutate({
      variables: { instrumentId },
      updateQueries: {
        song: (prev, { mutationResult }) => {
          return deleteInstrumentFromSong(prev, mutationResult.data.deleteInstrument);
        },
      },
    }),
  },
});

export default InstrumentWithMutations;
