const { MongoClient } = require('mongodb');

let client;
let db;

async function connect(uri, dbName) {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

function getDb() {
  if (!db) throw new Error('DB not initialized. Call connect() first.');
  return db;
}

async function close() {
  if (client) await client.close();
  db = null;
  client = null;
}

module.exports = { connect, getDb, close };