const server = require('./src/server');
const pool = require('./pool');

const PORT = process.env.PORT || 3000;

pool
  .connect({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })
  .then(async () => {
    server().listen(PORT, () => {
      console.log(`User API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
