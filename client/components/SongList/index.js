import React from 'react';
import { graphql } from 'react-apollo';
import { map } from 'lodash';

import { QUERY_SONG_LIST } from '../../api/queries';
import { MUTATION_CREATE_SONG } from '../../api/mutations';
import { withMutations } from '../../util/mutations';
import { addSongToSongList } from '../../reducers';
import Item from './Item';

class SongList extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <h2>Pick a song:</h2>
        <ul>
        {map(this.props.songList, song => <Item key={song.id} song={song} />)}
        </ul>
        <hr />
        <button className="btn btn-success" onClick={this.handleCreate.bind(this)}>
          Create a new song
        </button>
      </div>
    );
  }

  handleCreate() {
    this.props.createSong(190);
  }
}

const SongListWithMutations = withMutations(SongList, {
  createSong: {
    gql: MUTATION_CREATE_SONG,
    prop: (mutate, tempo) => mutate({
      variables: { tempo },
      updateQueries: {
        songList: (prev, { mutationResult }) => {
          return addSongToSongList(prev, mutationResult.data.createSong);
        },
      },
    }),
  },
});

const SongListWithDataAndMutations = graphql(QUERY_SONG_LIST, {
  props: ({ data: { loading, songList } }) => ({
    loading,
    songList,
  }),
})(SongListWithMutations);

export default SongListWithDataAndMutations;
