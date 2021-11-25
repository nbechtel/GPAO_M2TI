import * as fs from 'fs';
import * as path from 'path';
import * as Database from 'better-sqlite3';

const db = new Database('src/database/gpao.db', { verbose: console.log });

const migration = fs.readFileSync(
  'src/database/GPAO.SQLite_creation.sql',
  'utf8'
);
db.exec(migration);

db.close();
