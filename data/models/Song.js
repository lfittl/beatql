class Song {
  static primaryKey = 'song_id';
  static tableName = 'songs';
  static fieldToColumn = {
    songId: 'song_id',
    tempo: 'tempo',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  static subscriptionTriggers = {
    UPDATE: 'songUpdated',
  };

  constructor(options) {
    this.id = options.song_id;
    this.songId = options.song_id;
    this.tempo = options.tempo;
  }
}

export default Song;
