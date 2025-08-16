require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const { parse } = require('csv-parse');

const MONGODB_URI = process.env.MONGODB_URI; // put this in server/.env
const DB_NAME = process.env.DB_NAME || 'happyhour';
const FILE = process.argv[2];

if (!FILE) {
  console.error('Usage: node src/scripts/import.js .data/venues.csv');
  process.exit(1);
}

function normalizeCity(c) {
  if (!c) return '';
  const v = c.trim().toLowerCase();
  if (['boston'].includes(v)) return v;
    if (v === 'boston') return 'boston';
  return v;
}

function tidyPhone(p) {
  return (p || '').trim();
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const venues = db.collection('venues');

  // ensure index (idempotent)
  await venues.createIndex({ city: 1, name: 1 });

  const filePath = path.resolve(FILE);
  const rows = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on('data', (r) => rows.push(r))
      .on('end', resolve)
      .on('error', reject);
  });

  let upserts = 0;
  for (const row of rows) {
    const doc = {
      city: normalizeCity(row.city),
      name: (row.name || '').trim(),
      website: (row.website || '').trim(),
      phone: tidyPhone(row.phone),
      address: (row.address || '').trim(),
      happyHour: (row.happyHour || '').trim(),
      updatedAt: new Date(),
    };

    if (!doc.city || !doc.name || !doc.address) {
      console.warn('Skipping row with missing key fields:', row);
      continue;
    }

    await venues.updateOne(
      { city: doc.city, name: doc.name, address: doc.address },
      { $set: doc, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    upserts++;
  }

  console.log(`Upserted ${upserts} venue(s).`);
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});