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
  connectionArgs,
  connectionDefinitions,
  connectionFromPromisedArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

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

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    console.error("Lookup by globalId not supported yet (got ID " + globalId + ")");
    return null;
  },
  (obj) => {
    if (obj instanceof Song) {
      return songType;
    } else if (obj instanceof Sequencer)  {
      return sequencerType;
    } else if (obj instanceof Instrument)  {
      return instrumentType;
    } else {
      return null;
    }
  }
);

var songType = new GraphQLObjectType({
  name: 'Song',
  description: 'A song',
  fields: () => ({
    id: globalIdField('Song'),
    tempo: { type: GraphQLInt, description: 'The tempo of the song' },
    createdAt: { type: GraphQLInt, description: 'The unix timestamp of when the song was created' },
    updatedAt: { type: GraphQLInt, description: 'The unix timestamp of when the song was last updated' },
    sequencers: {
      type: sequencerConnection,
      description: 'A song\'s sequencers',
      args: connectionArgs,
      resolve(obj, args, context, info) {
        return connectionFromPromisedArray(getSequencersForSong(obj, info), args);
      },
    },
  }),
  interfaces: [nodeInterface],
});

var sequencerType = new GraphQLObjectType({
  name: 'Sequencer',
  description: 'A sequencer',
  fields: () => ({
    id: globalIdField('Sequencer'),
    resolution: { type: GraphQLInt, description: 'The resolution of the sequencer' },
    bars: { type: GraphQLInt, description: 'The number of bars of the sequencer' },
    createdAt: { type: GraphQLInt, description: 'The unix timestamp of when the sequencer was created' },
    updatedAt: { type: GraphQLInt, description: 'The unix timestamp of when the sequencer was last updated' },
    instruments: {
      type: instrumentConnection,
      description: 'A sequencer\'s instruments',
      args: connectionArgs,
      resolve(obj, args, context, info) {
        return connectionFromPromisedArray(getInstrumentsForSequencer(obj, info), args);
      },
    },
  }),
  interfaces: [nodeInterface],
});

var instrumentType = new GraphQLObjectType({
  name: 'Instrument',
  description: 'An instrument',
  fields: () => ({
    id: globalIdField('Instrument'),
    instrumentType: { type: GraphQLString, description: 'The type of instrument' },
    data: { type: GraphQLJSON, description: 'The data for the instrument' },
    createdAt: { type: GraphQLInt, description: 'The unix timestamp of when the sequencer was created' },
    updatedAt: { type: GraphQLInt, description: 'The unix timestamp of when the sequencer was last updated' },
  }),
  interfaces: [nodeInterface],
});

var {connectionType: sequencerConnection} =
  connectionDefinitions({name: 'Sequencer', nodeType: sequencerType});

var {connectionType: instrumentConnection} =
 connectionDefinitions({name: 'Instrument', nodeType: instrumentType});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
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
