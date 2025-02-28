const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const { db } = require('./database')
const app = express();
const port = 3000;

const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/dashboard', checkAuth, (req, res) => { res.sendFile(path.join(__dirname, 'views', 'dashboard.html')); });
app.get('/solosession', checkAuth, (req, res) => { res.sendFile(path.join(__dirname, 'views', 'solosession.html')); });

app.get('/groupstudy', checkAuth, (req, res) => { res.sendFile(path.join(__dirname, 'views', 'groupstudy.html')); });
app.get('/groupstudy/:roomname', checkAuth, (req, res) => {

    const roomname = req.params.roomname;
    console.log(roomname);
    res.sendFile(path.join(__dirname, 'views', 'studyroom.html'));

});

app.get('/analysis', checkAuth, (req, res) => { res.sendFile(path.join(__dirname, 'views', 'analysis.html')); });
app.get('/planner', checkAuth, (req, res) => { res.sendFile(path.join(__dirname, 'views', 'planner.html')); });


app.get('/ping', async (req, res) => {

    console.log("AAA : ", req.headers.cookie)

    var cooks = {}

    req.headers.cookie?.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        cooks[name] = decodeURIComponent(value);
    });



    let msg = await checkLogin(cooks['user_cookie'])
    console.log(msg)
    res.status(msg.code).json({ message: msg.message });


});


app.post('/login', (req, res) => {
    const { type } = req.body;

    if (type === "login") {
        const { username, password } = req.body;

        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (row) {

                if (row.password === password) {
                    const newCookie = randomNess(8);

                    res.cookie('user_cookie', newCookie, {
                        httpOnly: true,
                        maxAge: 100 * 24 * 60 * 60 * 1000
                    });

                    db.run('UPDATE users SET cookie = ? WHERE username = ?', [newCookie, username], (updateErr) => {
                        if (updateErr) {
                            console.error('Error updating cookie in the database:', updateErr);
                            return res.status(500).json({ message: 'Internal server error' });
                        }

                        console.log('Login successful for:', row.username);
                        return res.json({ message: 'Login successful' });
                    })

                } else {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        });

    } else if (type === "signup") {
        const { name, username, password } = req.body;

        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (row) {
                return res.status(409).json({ message: 'Username already taken' });
            } else {

                const newCookie = randomNess(8);

                console.log("Creating User")
                db.run('INSERT INTO users (name, username, password, cookie) VALUES (?, ?, ?, ?)', [name, username, password, newCookie], (err) => {
                    if (err) {
                        console.error('Error inserting new user:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    res.cookie('user_cookie', newCookie, {
                        httpOnly: true,
                        maxAge: 100 * 24 * 60 * 60 * 1000
                    });

                    console.log('New user created:', username);
                    return res.json({ message: 'Signup successful' });
                })

            }
        });
    } else {
        return res.status(400).json({ message: 'Invalid request type' });
    }
});




let usersInRooms = {};

// Handle WebRTC signaling
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // When a user joins a room
    socket.on('join-room', (roomName) => {
        socket.join(roomName);
        usersInRooms[roomName] = usersInRooms[roomName] || [];
        usersInRooms[roomName].push(socket.id);
        console.log(`${socket.id} joined room ${roomName}`);

        // Notify other users in the room
        socket.to(roomName).emit('new-user', socket.id);
    });

    // Handle WebRTC offer
    socket.on('offer', (roomName, offer, socketId) => {
        socket.to(socketId).emit('offer', offer, socket.id);
    });

    // Handle WebRTC answer
    socket.on('answer', (roomName, answer, socketId) => {
        socket.to(socketId).emit('answer', answer, socket.id);
    });

    // Handle ICE candidate
    socket.on('ice-candidate', (roomName, candidate, socketId) => {
        socket.to(socketId).emit('ice-candidate', candidate, socket.id);
    });

    // When a user disconnects, remove them from the room
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        for (let room in usersInRooms) {
            socket.to(room).emit('disconnected', socket.id);
            usersInRooms[room] = usersInRooms[room].filter(user => user !== socket.id);
            if (usersInRooms[room].length === 0) {
                delete usersInRooms[room];
            }
        }
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});







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


app.post('/ai', checkAuth, async (req, res) => {
    const { prompt } = req.body;
    try {
        console.log(prompt); // This should log the prompt from the request body
        const result = await ai(prompt);
        res.json({ response: result.candidates[0].content.parts[0].text });
    } catch (error) {
        res.status(500).send('Something went wrong');
    }
});









async function ai(prompt) {

    const AIKEY = "AIzaSyDKQoRbIx09CVYL8hwHT1tJVVzzIS122Y4"

    return new Promise((f, r) => {

        fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + AIKEY + '', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "contents": [{
                    "parts": [{ "text": prompt }]
                }]
            })
        })
            .then(a => a.json())
            .then(a => {
                f(a)
            })
            .catch(error => {
                f(false)
                console.error('Error:', error);  // handle errors
            });


    })



}

function randomNess(l) {
    let scope = 'abcdefghijklmnopqrstuvwxyz';
    return [...Array(l)].map(() => scope[Math.floor(Math.random() * scope.length)]).join('');
}

function checkLogin(cook) {
    return new Promise((resolve, reject) => {
        db.get('select name, username from users where cookie = ?', [cook], (err, row) => {
            if (err) {
                console.error('Error executing query:', err);
                return reject({ success: false, code: 500, message: 'Internal server error' });
            }
            if (row) {
                resolve({ success: true, code: 200, message: { name: row.name, username: row.username } });
            } else {
                resolve({ success: false, code: 404, message: 'User not found' });
            }
        });
    });
}

function checkAuth(req, res, next) {
    const cooks = {};

    if (req.headers.cookie) {
        req.headers.cookie.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name && value) {
                cooks[name] = decodeURIComponent(value);
            }
        });
    }

    const cookie = cooks['user_cookie'];

    if (!cookie) {
        return res.redirect('/?login');
    }

    checkLogin(cookie).then((result) => {
        if (result.success) {
            req.user = result.message;
            next();
        } else {
            res.redirect('/?login');
        }
    }).catch((err) => {
        console.error('Error during login check:', err);
        res.redirect('/?login');
    });
}

