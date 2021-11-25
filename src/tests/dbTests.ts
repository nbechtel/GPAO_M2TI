import * as fs from 'fs';
import * as Database from 'better-sqlite3';

const db = new Database('src/database/gpao.db', { verbose: console.log });

// Cmon, do something..
const test = 'SELECT * FROM Article;';
db.exec(test);

db.close();
