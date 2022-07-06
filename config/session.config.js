
 


module.exports = {
    store: process.env.SESSION_STORAGE === "redis" ? new (require('express-sessions'))({
        storage: 'redis',
        instance: require('../helpers/init_redis.js'), // optional
        collection: 'sessions', // optional
       // expire: 86400 // optional
    }) :
    new (require('express-sessions'))({
        storage: 'mongodb',
        instance: require('mongoose'), // optional
        collection: 'sessions', // optional
      //  expire: 86400 // optional
    })
}