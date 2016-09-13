import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';

import {
  Song,
  Sequencer,
  getSong,
  getRandomSong,
  getSequencer,
  getSequencers,
  getSequencersForSong,
  getInstrumentsForSequencer,
} from './database';

var instrumentType = new GraphQLObjectType({
  name: 'Instrument',
  description: 'An instrument',
  fields: () => ({
    id: { type: GraphQLString, description: 'ID of the instruments' },
    instrumentType: { type: GraphQLString, description: 'The type of instrument' },
    data: { type: GraphQLJSON, description: 'The data for the instrument' },
    createdAt: { type: GraphQLInt, description: 'The unix timestamp of when the sequencer was created' },
    updatedAt: { type: GraphQLInt, description: 'The unix timestamp of when the sequencer was last updated' },
  }),
});

var sequencerType = new GraphQLObjectType({
  name: 'Sequencer',
  description: 'A sequencer',
  fields: () => ({
    id: { type: GraphQLString, description: 'ID of the sequencer' },
    resolution: { type: GraphQLInt, description: 'The resolution of the sequencer' },
    bars: { type: GraphQLInt, description: 'The number of bars of the sequencer' },
    createdAt: { type: GraphQLInt, description: 'The unix timestamp of when the sequencer was created' },
    updatedAt: { type: GraphQLInt, description: 'The unix timestamp of when the sequencer was last updated' },
    instruments: {
      type: new GraphQLList(instrumentType),
      description: 'A sequencer\'s instruments',
      resolve(obj, args, context, info) {
        return getInstrumentsForSequencer(obj, info);
      },
    },
  }),
});

var songType = new GraphQLObjectType({
  name: 'Song',
  description: 'A song',
  fields: () => ({
    id: { type: GraphQLString, description: 'ID of the song' },
    tempo: { type: GraphQLInt, description: 'The tempo of the song' },
    createdAt: { type: GraphQLInt, description: 'The unix timestamp of when the song was created' },
    updatedAt: { type: GraphQLInt, description: 'The unix timestamp of when the song was last updated' },
    sequencers: {
      type: new GraphQLList(sequencerType),
      description: 'A song\'s sequencers',
      resolve(obj, args, context, info) {
        return getSequencersForSong(obj, info);
      },
    },
  }),
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    song: {
      type: songType,
      resolve(obj, args, context, info) {
        return getSong('00c60941-3c2f-4935-b2f3-589b4594d302', info);
      },
    },
  }),
});

export var Schema = new GraphQLSchema({
  query: queryType,
});
