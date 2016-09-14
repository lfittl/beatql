import {PubSubEngine} from 'graphql-subscriptions/dist/pubsub';

import { keys, values } from 'lodash';

class DatabasePubSub implements PubSubEngine {
  constructor(db, tableToModel) {
    this.tableToModel = tableToModel;

    this.subscriptions = {};
    this.nextSubscriptionId = 1;

    db.connect({direct: true})
    .then(sco => {
      sco.client.on('notification', rawData => {
        const change = JSON.parse(rawData.payload);
        const model = tableToModel[change.table];
        const trigger = model.subscriptionTriggers && model.subscriptionTriggers[change.action];

        if (trigger) {
          const record = new model(change.data);
          console.log(`Notifying '${trigger}' with id ${record.id}`);

          values(this.subscriptions[trigger]).forEach(onMessage => {
            onMessage({ id: record.id, [trigger]: record });
          });
        } else {
          console.log(`No triggers defined for ${change.action} on table ${change.table}, ignoring change notification.`);
        }
      });
      return sco.none('LISTEN $1~', 'changes');
    })
    .catch(error => {
      console.log('Error:', error);
    });
  }

  publish(trigger, payload) {
    throw "ERROR - Don't use publish(..) with the DatabasePubSub adapter - simply modify a database record to publish a change.";
    return false;
  }

  subscribe(trigger, onMessage) {
    console.log('subscribe', trigger);

    if (!this.subscriptions[trigger]) {
      this.subscriptions[trigger] = {};
    }

    const subscriptionId = this.nextSubscriptionId;
    this.nextSubscriptionId++;

    this.subscriptions[trigger][subscriptionId] = onMessage;

    return Promise.resolve(subscriptionId);
  }

  unsubscribe(subId) {
    console.log('unsubscribe', subId);

    keys(this.subscriptions).forEach(trigger => {
      delete this.subscriptions[trigger][subId];
    });
  }
}

export default DatabasePubSub;
