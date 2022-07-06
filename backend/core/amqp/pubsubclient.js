const logger = require('../../core/logger');
const { PUBSUB_EXCHANGE, SUBSCRIBER } = require('./constants');
const AmqpClient = require('./client');

class AmqpPubsubClient extends AmqpClient {
  publish(topic, data) {
    logger.debug('AMQP: publishing message to:', topic);

    return this.assertExchange(topic, PUBSUB_EXCHANGE.type)
      .then(() => this.send(topic, data, PUBSUB_EXCHANGE.routingKey));
  }

  subscribe(topic, callback) {
    return this.assertExchange(topic, PUBSUB_EXCHANGE.type)
      .then(() => this.assertQueue(SUBSCRIBER.queueName, SUBSCRIBER.queueOptions))
      .then(res => this.assertBinding(res.queue, topic).then(() => res))
      .then(res => this.consume(res.queue, SUBSCRIBER.consumeOptions, callback));
  }

  /**
   * Creates a new consumer which asserts that it will listen to messages in a durable queue.
   * The durable queue goal is to be able to receive events 'from the past' ie events which has been push to the queue while subscribers were not bound.
   * This is quite useful in case of ESN restart to not miss anything between stop and start.
   * Important: If multiple consumers are connected to the same durable queue, AMQP will deliver message to one and only one consumer with a Round-robin behavior by default.
   *
   * @param {String} exchangeName - The exchange name
   * @param {String} queueName - The queue name
   * @param {Function} callback - The callback to call once there is a message in the queue
   */
  subscribeToDurableQueue(exchangeName, queueName, callback) {
    return this.assertExchange(exchangeName, PUBSUB_EXCHANGE.type)
      .then(() => this.assertQueue(queueName, SUBSCRIBER.durableQueueOptions))
      .then(() => this.assertBinding(queueName, exchangeName))
      .then(() => this.consume(queueName, SUBSCRIBER.consumeOptions, callback));
  }

  unsubscribe(topic, callback) {
    const consumerTags = this._subscribeCallbackToConsumerTags.get(callback);

    if (Array.isArray(consumerTags)) {
      logger.info('AMQP: About removing the consumer(s): ' + consumerTags);

      return Promise.all(consumerTags.map(c => this.channel.cancel(c)));
    }

    logger.warn('AMQP: No consumerTag found to unsubscribe a consumer from: ' + topic);

    return Promise.resolve();
  }
}

module.exports = AmqpPubsubClient;
