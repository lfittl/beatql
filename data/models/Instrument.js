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

  static subscriptionTriggers = {
    INSERT: 'instrumentAdded',
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

export default Instrument;
