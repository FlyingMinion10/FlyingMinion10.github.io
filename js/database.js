// js/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('restaurantes.db');
console.log('Database Init');

// Crear tablas si no existen
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS rest_users (id INTEGER PRIMARY KEY, user TEXT, password TEXT, name TEXT, location TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, restaurant TEXT, clientName TEXT, orderDescription TEXT, destination TEXT, pickupTime TEXT, collector TEXT DEFAULT 'libre', delivered BOOLEAN DEFAULT 0)");
    db.run("CREATE TABLE IF NOT EXISTS collector_users (id INTEGER PRIMARY KEY, email TEXT, password TEXT, user TEXT, name TEXT, curp TEXT)");
});

module.exports = db;
