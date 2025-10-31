require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./db');

const email = 'email@example.com';
const password = 'Password123';
const name = 'John Doe';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    db.run(`INSERT OR IGNORE INTO users (email, password, name) VALUES (?, ?, ?)`,
        [email, hash, name], function (err) {
            if (err) return console.error(err);
            console.log('User created:', { email, password });
            process.exit(0);
        });
});
