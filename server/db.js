const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "cams",
    password: "Hima@321",
    port: 5432
});

module.exports = pool;