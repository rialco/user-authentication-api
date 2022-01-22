const app = require('./src/app');
const pool = require('./pool');

pool
  .connect({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })
  .then(() => {
    app().listen(3000, () => {
      console.log('User API running on port 3000');
    });
  })
  .catch((err) => {
    console.log(err);
  });
