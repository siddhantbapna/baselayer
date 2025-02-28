const sqlite3 = require('sqlite3').verbose();

// Open a database (it will be created if it doesn't exist)
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            cookie TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS userslogs (
            username TEXT NOT NULL,
            date DATE NOT NULL,
            start TIME NOT NULL,
            end TIME NOT NULL,
            action TEXT NOT NULL UNIQUE
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS study_groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `);
    
    db.run(`
        CREATE TABLE IF NOT EXISTS chats (
            sender TEXT NOT NULL,
            receiver TEXT NOT NULL,
            msg TEXT,
            datetime DATETIME NOT NULL
        )
    `);
    

    db.run(`
        CREATE TABLE IF NOT EXISTS schedule (
            username TEXT NOT NULL,
            task TEXT NOT NULL,
            date DATE NOT NULL,
            start TIME NOT NULL,
            end TIME NOT NULL
        )
    `);    


});

module.exports = { db };
