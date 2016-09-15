import gql from 'graphql-tag';

export const MUTATION_CREATE_INSTRUMENT = gql`
  mutation createInstrument($sequencerId: String!, $instrumentType: String!, $data: JSON!) {
    createInstrument(sequencerId: $sequencerId, instrumentType: $instrumentType, data: $data) {
      id
      instrumentType
      sequencerId
      data
    }
  }
`;

export const MUTATION_UPDATE_INSTRUMENT = gql`
  mutation updateInstrument($instrumentId: String!, $data: JSON!) {
    updateInstrument(instrumentId: $instrumentId, data: $data) {
      id
      data
    }
  }
`;

export const MUTATION_DELETE_INSTRUMENT = gql`
  mutation deleteInstrument($instrumentId: String!) {
    deleteInstrument(instrumentId: $instrumentId) {
      id
    }
  }
`;

export const MUTATION_CREATE_SEQUENCER = gql`
  mutation createSequencer($songId: String!, $resolution: Int!, $bars: Int!) {
    createSequencer(songId: $songId, resolution: $resolution, bars: $bars) {
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
`;

export const MUTATION_DELETE_SEQUENCER = gql`
  mutation deleteSequencer($sequencerId: String!) {
    deleteSequencer(sequencerId: $sequencerId) {
      id
    }
  }
`;
