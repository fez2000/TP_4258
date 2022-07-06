const Q = require('q');
const { logger } = require('../../../core');
const Pubsub = require('../pubsub');

const ACTION_SUBSCRIBE = 'subscribe';
const ACTION_PUBLISH = 'publish';
const noop = () => {};

class RabbitPubsub extends Pubsub {
  constructor(name, client) {
    super(name, client);
    this._publicationsBuffer = [];
    this._subscriptionsCache = [];
    this._subscriptionsPromisesBuffer = [];
  }

  setClient(client) {
    if (this.client) {
      logger.warn('Pubsub client already set. Overriding');
    }

    this.client = client;

    Q.all(this._subscriptionsCache.map(elem => this._subscribeToClient(elem.topic, elem.data)))
    .then(() => {
      this._publicationsBuffer.forEach(elem => {
        this.topic(elem.topic)[elem.action](elem.data)
        .catch(e => logger.error('Rabbit publish', e));
      });

      this._subscriptionsPromisesBuffer.forEach(resolve => resolve());

      this._publicationsBuffer = [];
      this._subscriptionsPromisesBuffer = [];
    })
    .catch(e => logger.error('Error applying subscriptions', e));
  }

  unsetClient(callback) {
    const oldClient = this.client;

    callback = callback || noop;
    this.client = undefined;

    if (oldClient) {
      try {
        oldClient.dispose(callback);
      } catch (e) {
        logger.debug('error on RabbitMQ channel closing', e);
      }
    } else {
      callback();
    }

  }

  _addCache(topic, action, data) {
    if (action === ACTION_PUBLISH) {
      this._publicationsBuffer.push({ topic, action, data });
    } else if (action === ACTION_SUBSCRIBE) {
      this._subscriptionsCache.push({ topic, action, data });
    }
  }

  _removeSubscriptionFromCache(topic, handler) {
    this._subscriptionsCache = this._subscriptionsCache.filter(subscription => (subscription.action !== ACTION_SUBSCRIBE || subscription.data !== handler));
  }

  _subscribeToClient(topic, handler) {
    logger.debug(this.name + '/SUBSCRIBE to', topic);

    return this.client.subscribe(topic, handler);
  }

  _createInterface(topic) {
    return {
      subscribe: handler => {
        this._addCache(topic, ACTION_SUBSCRIBE, handler);

        if (!this.client) {
          return Q(resolve => {
            this._subscriptionsPromisesBuffer.push(resolve);
          });
        }

        return this._subscribeToClient(topic, handler);
      },
      unsubscribe: handler => {
        this._removeSubscriptionFromCache(topic, handler);

        if (this.client) {
          logger.debug(this.name + '/UNSUBSCRIBE to', topic);

          return this.client.unsubscribe(topic, handler);
        }
      },
      publish: data => {
        if (!this.client) {
          return this._addCache(topic, ACTION_PUBLISH, data);
        }

        return this.client.publish(topic, data);
      },
      forward: (pubsub, data) => {
        if (pubsub instanceof Pubsub) {
          this._channels[topic].publish(data);

          return pubsub.topic(topic).publish(data);
        }
        throw new Error('Invalid pubsub to forward to');
      }
    };
  }

  topic(name) {
    if (!(name in this._channels)) {
      this._channels[name] = this._createInterface(name);
    }

    return this._channels[name];
  }
}

module.exports = RabbitPubsub;
