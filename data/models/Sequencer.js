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

  static subscriptionTriggers = {
    INSERT: 'sequencerAdded',
    UPDATE: 'sequencerUpdated',
    DELETE: 'sequencerDeleted',
  };

  constructor(options) {
    this.id = options.sequencer_id;
    this.sequencerId = options.sequencer_id;
    this.songId = options.song_id;
    this.resolution = options.resolution;
    this.bars = options.bars;
  }
}

export default Sequencer;
