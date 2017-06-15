const MongoClient = require('mongodb').MongoClient;
// const mongoose = require('mongoose');
const assert = require('assert');

const { user, password } = require('./credentials');

const login = `${user}:${password}`;
const cluster = 'cluster0';
const host = 'u6c4i.mongodb.net';
const port = 27017;
const database = 'racing';
const query = {
  ssl: true,
  replicaSet: 'Cluster0-shard-0',
  authSource: 'admin',
};

const keyValue = ([key, value]) => [key, value].join('=');
const queryString = Object.entries(query).map(keyValue).join('&');
const shard = index => `${cluster}-shard-00-0${index}-${host}:${port}`;
const shards = [0, 1, 2].map(shard).join(',');
const dir = x => console.dir(x, { depth: null, colors: true });
const uri = `mongodb://${login}@${shards}/${database}?${queryString}`;

// mongoose.connect(uri/* 'mongodb://localhost/test'*/);

// const City = mongoose.model('city', { id: Number, name: String });

/* const city = new City({ id: 13, name: 'Kapellen' });
city.save((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('meow');
  }
});*/

const insertDocuments = (db, callback) => {
  const collection = db.collection('city');
  collection.findOneAndUpdate(
    { _id: 23 },
    { _id: 23, name: 'Stabroek' },
    { upsert: true, returnNewDocument: true },
    (err, result) => {
      assert.equal(err, null);
      dir(result, { depth: null, colors: true });
      callback(result);
    },
  );
};

MongoClient.connect(uri, (err, db) => {
  if (err) console.log(err);
  // console.log(db);
  // console.dir(db, { depth: null, colors: true });
  insertDocuments(db, (...args) => {
    dir(args, { depth: null, colors: true });
    db.close();
  });
  // db.close();
});
