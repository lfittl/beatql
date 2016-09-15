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
  getSong,
  getRandomSong,
  getSequencer,
  getSequencers,
  getSequencersForSong,
  getInstrumentsForSequencer,
  createInstrument,
  updateInstrument,
  deleteInstrument,
  createSequencer,
  deleteSequencer,
} from './database';

var instrumentType = new GraphQLObjectType({
  name: 'Instrument',
  description: 'An instrument',
  fields: {
    id: { type: GraphQLString, description: 'ID of the instrument' },
    sequencerId: { type: GraphQLString, description: 'ID of the sequencer the instrument belongs to' },
    instrumentType: { type: GraphQLString, description: 'The type of instrument' },
    data: { type: GraphQLJSON, description: 'The data for the instrument' },
    createdAt: { type: GraphQLInt, description: 'The unix timestamp of when the sequencer was created' },
    updatedAt: { type: GraphQLInt, description: 'The unix timestamp of when the sequencer was last updated' },
  },
});

var deletedInstrumentType = new GraphQLObjectType({
   name: 'DeletedInstrument',
   fields: {
     id: { type: GraphQLString, description: 'ID of the instrument' },
   },
});

var sequencerType = new GraphQLObjectType({
  name: 'Sequencer',
  description: 'A sequencer',
  fields: {
    id: { type: GraphQLString, description: 'ID of the sequencer' },
    songId: { type: GraphQLString, description: 'ID of the song the sequencer belongs to' },
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
  },
});

var deletedSequencerType = new GraphQLObjectType({
   name: 'DeletedSequencer',
   fields: {
     id: { type: GraphQLString, description: 'ID of the sequencer' },
   },
});

var songType = new GraphQLObjectType({
  name: 'Song',
  description: 'A song',
  fields: {
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
  },
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    song: {
      args: { songId: { type: GraphQLString } },
      type: songType,
      resolve(obj, args, context, info) {
        return getSong(args.songId, info);
      },
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createInstrument: {
      args: { sequencerId: { type: GraphQLString }, instrumentType: { type: GraphQLString }, data: { type: GraphQLJSON } },
      type: instrumentType,
      resolve(obj, { sequencerId, instrumentType, data }, context, info) {
        return createInstrument({ sequencerId, instrumentType, data }, info);
      }
    },
    updateInstrument: {
      args: { instrumentId: { type: GraphQLString }, data: { type: GraphQLJSON } },
      type: instrumentType,
      resolve(obj, { instrumentId, data }, context, info) {
        return updateInstrument(instrumentId, data, info);
      }
    },
    deleteInstrument: {
      args: { instrumentId: { type: GraphQLString } },
      type: deletedInstrumentType,
      resolve(obj, { instrumentId }, context, info) {
        return deleteInstrument(instrumentId);
      }
    },
    createSequencer: {
      args: { songId: { type: GraphQLString }, resolution: { type: GraphQLInt }, bars: { type: GraphQLInt } },
      type: sequencerType,
      resolve(obj, { songId, resolution, bars }, context, info) {
        return createSequencer({ songId, resolution, bars }, info);
      }
    },
    deleteSequencer: {
      args: { sequencerId: { type: GraphQLString } },
      type: deletedSequencerType,
      resolve(obj, { sequencerId }, context, info) {
        return deleteSequencer(sequencerId);
      }
    },
  },
});

const subscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    songUpdated: {
      args: { songId: { type: GraphQLString } },
      type: songType,
    },
    sequencerAdded: {
      args: { songId: { type: GraphQLString } },
      type: sequencerType,
    },
    instrumentAdded: {
      args: { sequencerId: { type: GraphQLString } },
      type: instrumentType,
    },
  },
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
  subscription: subscriptionType,
});
