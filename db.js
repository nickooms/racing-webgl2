const mongoose = require('mongoose');
const config = require('config');

const option = { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } };

mongoose.Promise = Promise;
mongoose.connect(config.DBHost, { server: option, replset: option });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = db;
