// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'index.html'));});
app.get('/dashboard', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));});
app.get('/contact', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'contact.html'));});


app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    db.run(
        'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
        [name, email, message],
        function (err) {
            if (err) {
                return console.error(err.message);
            }
            res.send(`
                <h1>Thank you, ${name}!</h1>
                <p>Your message has been received. We'll get back to you shortly.</p>
                <a href="/">Go back to the home page</a>
            `);
        }
    );
});


app.get('/api/data', (req, res) => {
    const data = {
        message: "Hello from the API!",
        date: new Date(),
    };
    res.json(data);
});




// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


