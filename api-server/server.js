require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET;


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ message: 'DB error' });
        if (!row) return res.status(401).json({ message: 'Invalid credentials' });

        bcrypt.compare(password, row.password, (err, ok) => {
            if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
            const token = jwt.sign({ id: row.id, email: row.email }, JWT_SECRET, { expiresIn: '7d' });
            res.json({ token, user: { id: row.id, name: row.name, email: row.email } });
        });
    });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
