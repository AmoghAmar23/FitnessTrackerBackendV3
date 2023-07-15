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

//postgres://amogh:_2dmrWjVXmPAPzkXH98Dkxu7yhECXt6s0QD0H@dpg-cioo0fdph6elhbpdoltg-a.oregon-postgres.render.com/fitnessdev
//postgres://amogh:WjVXmPAPzkXH98Dkxu7yhECXt6s0QD0H@dpg-cioo0fdph6elhbpdoltg-a.oregon-postgres.render.com/fitnessdev_2dmr
const client = new Pool ({
  host: 'dpg-cioo0fdph6elhbpdoltg-a.oregon-postgres.render.com',
  port: 5432,
  database: 'fitnessdev_2dmr',
  user: 'amogh',
  password: 'WjVXmPAPzkXH98Dkxu7yhECXt6s0QD0H',
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,

})
// module.exports = {
// client,
// } 

module.exports = client;


// host: '3.141.45.14',
//   port: 5432,
//   database: 'fitness-dev',
//   user: 'postgres',
//   password: 'Albino778899',
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,

// })