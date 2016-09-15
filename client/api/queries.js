import gql from 'graphql-tag';

export const QUERY_SONG = gql`
  query song {
    song {
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
