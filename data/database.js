import Promise from 'bluebird';
import {loadOne, loadMany, loaderFirstPass, createOne, updateOne, deleteOne} from './database_helpers';
import DatabasePubSub from './database_pubsub';

import Instrument from './models/Instrument';
import Sequencer from './models/Sequencer';
import Song from './models/Song';

var options = { promiseLib: Promise };

var pgp = require('pg-promise')(options);
var monitor = require('pg-monitor');

monitor.attach(options);

var dbconfig = {
    host: '192.168.99.100',
    port: 5432,
    database: 'beatql',
    user: 'beatql',
};

var db = pgp(dbconfig);

let sequencersLoader = loadMany(db, Sequencer);
let instrumentsLoader = loadMany(db, Instrument);

let pubsub = new DatabasePubSub(db, { songs: Song, sequencers: Sequencer, instruments: Instrument });

module.exports = {
  getSong: (id, info) => loadOne(db, Song, id, info),
  getSequencer: (id, info) => loadOne(db, Sequencer, id, info),
  getSequencersForSong: (obj, info) => sequencersLoader.load(loaderFirstPass(Sequencer, obj, info)),
  getInstrumentsForSequencer: (obj, info) => instrumentsLoader.load(loaderFirstPass(Instrument, obj, info)),
  createInstrument: (attrs, info) => createOne(db, Instrument, attrs, info),
  updateInstrument: (id, data, info) => updateOne(db, Instrument, id, { data }, info),
  deleteInstrument: (id) => deleteOne(db, Instrument, id),
  createSequencer: (attrs, info) => createOne(db, Sequencer, attrs, info),
  deleteSequencer: (id) => deleteOne(db, Sequencer, id),
  pubsub,
  Song,
  Sequencer,
};
