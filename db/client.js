const { Pool } = require('pg');

// const connectionString = process.env.DATABASE_URL || 'https://localhost:5432/fitness-dev';

// const client = new Pool({
//   host: '3.141.45.14',
//   port: 5432,
//   database: 'fitness-dev',
//   user: 'postgres',
//   password: 'Albino778899',
//   connectionString,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
// });

const client = new Pool ({
  host: '3.141.45.14',
  port: 5432,
  database: 'fitness-dev',
  user: 'postgres',
  password: 'Albino778899',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,

})
// module.exports = {
// client,
// } 

module.exports = client;
