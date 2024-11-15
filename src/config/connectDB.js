import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: 'database-2.c1yu4u8uoxrf.ap-southeast-2.rds.amazonaws.com',
  user: 'admin',
  password: '8600988002',
  database: 'real91',
});

export default connection;
