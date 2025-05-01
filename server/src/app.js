const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const expressValidator = require('express-validator');
const electionName = require('./models/electionName');
const admin = require('./models/admin');
const md5 = require('md5');
require('./db/mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Routes
app.get('/', function(req, res) {
    res.json('Works!');
});

app.get('/api/electionName', function(req, res) {
    var electionNames = []
    var electionOrganizers = []
    var electionIds = []
    var final = []
    electionName.find({}).then(eachOne => {
        for (i = 0; i < eachOne.length; i++){
            electionNames[i] = eachOne[i].election_name ;
            electionOrganizers[i] = eachOne[i].election_organizer;
            electionIds[i] = eachOne[i].election_id;
            final.push({
                'election_id': eachOne[i].election_id,
                'election_organizer': eachOne[i].election_organizer,
                'election_name': eachOne[i].election_name
            })
        }
        res.send(final);
    })
})

app.post('/api/electionName', async function(req, res) {
    electionName.create({
        election_id: Math.floor(Math.random() * 100),
        election_name: req.body.election_name,
        election_organizer: req.body.election_organizer,
        election_password: md5(req.body.election_password),
    }).then(election => {
        res.json(election);
    });
});

app.post('/api/adminLogin', async function(req, res) {
    admin.findOne({
        username: req.body.username,
        password: md5(req.body.password),
    }).then(election => {
        if(election === null){
            res.send(false);
        }else{
            res.send(true);
        }
    });
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log("Server is up on port " + port);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});