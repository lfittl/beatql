/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

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

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Song') {
      return getSong(id); // FIXME: Determine fields
    } else if (type === 'Sequencer') {
      return getSequencer(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Song) {
      return songType;
    } else if (obj instanceof Sequencer)  {
      return sequencerType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var songType = new GraphQLObjectType({
  name: 'Song',
  description: 'A song',
  fields: () => ({
    id: globalIdField('Song'),
    tempo: {
      type: GraphQLInt,
      description: 'The tempo of the song',
    },
    createdAt: {
      type: GraphQLInt,
      description: 'The unix timestamp of when the song was created',
    },
    updatedAt: {
      type: GraphQLInt,
      description: 'The unix timestamp of when the song was last updated',
    },
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
    //songId: , TBD
    resolution: {
      type: GraphQLInt,
      description: 'The resolution of the sequencer',
    },
    bars: {
      type: GraphQLInt,
      description: 'The number of bars of the sequencer',
    },
    createdAt: {
      type: GraphQLInt,
      description: 'The unix timestamp of when the sequencer was created',
    },
    updatedAt: {
      type: GraphQLInt,
      description: 'The unix timestamp of when the sequencer was last updated',
    },
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
    instrumentType: {
      type: GraphQLString,
      description: 'The type of instrument',
    },
    data: {
      type: GraphQLJSON,
      description: 'The data for the instrument',
    },
    createdAt: {
      type: GraphQLInt,
      description: 'The unix timestamp of when the sequencer was created',
    },
    updatedAt: {
      type: GraphQLInt,
      description: 'The unix timestamp of when the sequencer was last updated',
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */

var {connectionType: sequencerConnection} =
  connectionDefinitions({name: 'Sequencer', nodeType: sequencerType});

var {connectionType: instrumentConnection} =
 connectionDefinitions({name: 'Instrument', nodeType: instrumentType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    song: {
      type: songType,
      resolve: () => getRandomSong(),
      resolve(obj, args, context, info) {
        return getSong('00c60941-3c2f-4935-b2f3-589b4594d302', info);
      },
    },
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
