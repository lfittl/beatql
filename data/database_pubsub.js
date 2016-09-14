import {PubSubEngine} from 'graphql-subscriptions/dist/pubsub';

class DatabasePubSub implements PubSubEngine {
  publish(trigger, payload) {
    // Not implemented
    return true;
  }

  subscribe(trigger, onMessage) {
    console.log('subscribe', trigger);
    setTimeout(function() {
      onMessage({ id: '00c60941-3c2f-4935-b2f3-589b4594d302', songUpdated: { id: '00c60941-3c2f-4935-b2f3-589b4594d302', tempo: 150 } });
    }, 5000);
    return Promise.resolve('my-id');
  }

  unsubscribe(subId) {
    console.log('unsubscribe', subId);
  }
}

export default DatabasePubSub;
