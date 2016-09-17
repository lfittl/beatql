import gql from 'graphql-tag';

export const SUBSCRIPTION_SONG_UPDATED = gql`
  subscription onSongUpdated($songId: String!) {
    songUpdated(songId: $songId) {
      id
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
`;

export const SUBSCRIPTION_SEQUENCER_ADDED = gql`
  subscription onSequencerAdded($songId: String!) {
    sequencerAdded(songId: $songId){
      id
      songId
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

export const SUBSCRIPTION_SEQUENCER_UPDATED = gql`
  subscription onSequencerUpdated($sequencerId: String!) {
    sequencerUpdated(sequencerId: $sequencerId){
      id
      songId
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

export const SUBSCRIPTION_SEQUENCER_DELETED = gql`
  subscription onSequencerDeleted($sequencerId: String!) {
    sequencerDeleted(sequencerId: $sequencerId){
      id
    }
  }
`;

export const SUBSCRIPTION_INSTRUMENT_ADDED = gql`
  subscription onInstrumentAdded($sequencerId: String!) {
    instrumentAdded(sequencerId: $sequencerId){
      id
      sequencerId
      instrumentType
      data
    }
  }
`;

export const SUBSCRIPTION_INSTRUMENT_UPDATED = gql`
  subscription onInstrumentUpdated($instrumentId: String!) {
    instrumentUpdated(instrumentId: $instrumentId){
      id
      sequencerId
      instrumentType
      data
    }
  }
`;

export const SUBSCRIPTION_INSTRUMENT_DELETED = gql`
  subscription onInstrumentDeleted($instrumentId: String!) {
    instrumentDeleted(instrumentId: $instrumentId){
      id
    }
  }
`;
