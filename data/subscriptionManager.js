import {Schema} from './schema';
import {pubsub} from './database';
import {SubscriptionManager} from 'graphql-subscriptions';

export const subscriptionManager = new SubscriptionManager({
  schema: Schema,
  pubsub,
  setupFunctions: {
    songUpdated: (options, args) => ({
      songUpdated: result => {
        return result.id === args.songId;
      },
    }),
    sequencerAdded: (options, args) => ({
      sequencerAdded: result => {
        return result.sequencerAdded.songId === args.songId;
      },
    }),
    sequencerAdded: (options, args) => ({
      sequencerAdded: result => {
        return result.sequencerAdded.songId === args.songId;
      },
    }),
    sequencerUpdated: (options, args) => ({
      sequencerUpdated: result => {
        return result.sequencerUpdated.sequencerId === args.sequencerId;
      },
    }),
    sequencerDeleted: (options, args) => ({
      sequencerDeleted: result => {
        return result.sequencerDeleted.sequencerId === args.sequencerId;
      },
    }),
    instrumentAdded: (options, args) => ({
      instrumentAdded: result => {
        return result.instrumentAdded.sequencerId === args.sequencerId;
      },
    }),
    instrumentUpdated: (options, args) => ({
      instrumentUpdated: result => {
        return result.instrumentUpdated.instrumentId === args.instrumentId;
      },
    }),
    instrumentDeleted: (options, args) => ({
      instrumentDeleted: result => {
        return result.instrumentDeleted.instrumentId === args.instrumentId;
      },
    }),
  },
});

export default subscriptionManager;
