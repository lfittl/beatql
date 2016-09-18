import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Layout from './components/Layout';
import Song from './components/Song';
import SongList from './components/SongList';

export default (
  <Route path="/" component={Layout}>
    <IndexRoute component={SongList} />
    <Route path="/:songId" component={Song} />
  </Route>
);
