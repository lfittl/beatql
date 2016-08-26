import Promise from 'bluebird';
import {loadOne, loadMany, loaderFirstPass} from './database-helpers';

var pgp = require('pg-promise')({ promiseLib: Promise });

var dbconfig = {
    host: '192.168.99.100',
    port: 5432,
    database: 'beatql',
    user: 'beatql',
};

class Song {
  static primaryKey = 'song_id';
  static tableName = 'songs';
  static fieldToColumn = {
    songId: 'song_id',
    tempo: 'tempo',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(options) {
    this.id = options.song_id;
    this.songId = options.song_id;
    this.tempo = options.tempo;
  }
}

class Sequencer {
  static primaryKey = 'sequencer_id';
  static foreignKey = 'song_id';
  static tableName = 'sequencers';
  static fieldToColumn = {
    sequencerId: 'sequencer_id',
    songId: 'song_id',
    resolution: 'resolution',
    bars: 'bars',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(options) {
    this.id = options.sequencer_id;
    this.sequencerId = options.sequencer_id;
    this.songId = options.song_id;
    this.resolution = options.resolution;
    this.bars = options.bars;
  }
}

class Instrument {
  static primaryKey = 'instrument_id';
  static foreignKey = 'sequencer_id';
  static tableName = 'instruments';
  static fieldToColumn = {
    instrumentId: 'instrument_id',
    sequencerId: 'sequencer_id',
    instrumentType: 'instrument_type',
    songId: 'song_id',
    data: 'data',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  constructor(options) {
    this.id = options.instrument_id;
    this.instrumentId = options.instrument_id;
    this.sequencerId = options.sequencer_id;
    this.instrumentType = options.instrument_type;
    this.songId = options.song_id;
    this.data = options.data;
    this.createdAt = options.created_at;
  }
}

var db = pgp(dbconfig);

let sequencersLoader = loadMany(db, Sequencer);
let instrumentsLoader = loadMany(db, Instrument);

module.exports = {
  getSong: (id, info) => loadOne(db, Song, id, info),
  getSequencer: (id, info) => loadOne(db, Sequencer, id, info),
  getSequencersForSong: (obj, info) => sequencersLoader.load(loaderFirstPass(Sequencer, obj, info)),
  getInstrumentsForSequencer: (obj, info) => instrumentsLoader.load(loaderFirstPass(Instrument, obj, info)),
  Song,
  Sequencer,
};
