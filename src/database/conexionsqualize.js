const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });
const { Sequelize,QueryTypes,Model,Op,DataTypes,Transaction,Deferrable } = require('sequelize');

const sequelize = new Sequelize( process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_SERVER,
    dialect: 'mssql',
    port: 10200,
    dialectOptions: {
        options: {
            encrypt: false,
            trustServerCertificate: true
        },
    },
});
module.exports = { sequelize };