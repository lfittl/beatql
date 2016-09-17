import React from 'react';
import { cloneDeep, map, reject } from 'lodash';

import Form from './Form';
import { MUTATION_UPDATE_INSTRUMENT, MUTATION_DELETE_INSTRUMENT } from '../../api/mutations';
import { SUBSCRIPTION_INSTRUMENT_UPDATED, SUBSCRIPTION_INSTRUMENT_DELETED } from '../../api/subscriptions';
import { updateInstrumentInSong, deleteInstrumentFromSong } from '../../reducers';
import { withMutations } from '../../util/mutations';

class Instrument extends React.Component {
  state: {
    editing: boolean,
  };

  constructor(props) {
    super(props);

    this.subscriptionObserverInstrumentUpdated = null;
    this.subscriptionObserverInstrumentDeleted = null;
    this.subscriptionInstrumentId = null;

    this.state = {
      editing: false,
    };
  }

  subscribe(instrumentId, updateQuery) {
    this.subscriptionInstrumentId = instrumentId;

    this.subscriptionObserverInstrumentUpdated = this.props.client.subscribe({
      query: SUBSCRIPTION_INSTRUMENT_UPDATED,
      variables: { instrumentId },
    }).subscribe({
      next(data) { updateQuery(prev => updateInstrumentInSong(prev, data.instrumentUpdated)) },
      error(err) { err.forEach(e => console.error(e)) },
    });

    this.subscriptionObserverInstrumentDeleted = this.props.client.subscribe({
      query: SUBSCRIPTION_INSTRUMENT_DELETED,
      variables: { instrumentId },
    }).subscribe({
      next(data) { updateQuery(prev => deleteInstrumentFromSong(prev, data.instrumentDeleted)) },
      error(err) { err.forEach(e => console.error(e)) },
    });
  }

  unsubscribe() {
    if (this.subscriptionObserverInstrumentUpdated) {
      this.subscriptionObserverInstrumentUpdated.unsubscribe();
    }
    if (this.subscriptionObserverInstrumentDeleted) {
      this.subscriptionObserverInstrumentDeleted.unsubscribe();
    }
  }

  componentDidMount() {
    this.subscribe(this.props.instrument.id, this.props.updateQuery);
  }

  componentWillReceiveProps(nextProps) {
    if (this.subscriptionInstrumentId !== nextProps.instrument.id) {
      this.unsubscribe();
      this.subscribe(nextProps.instrument.id, nextProps.updateQuery);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
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
