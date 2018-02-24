const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;


router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
        if (err) return console.log(err);
        closure(db);
    })
};

let response = {
    status: 200,
    data: [],
    message: null
};

const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err === 'object' ? err.message : err;
    res.status(501).json(response);
};

// get all users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            }).catch((err) => {
                sendError(err, res);
        });
    });
});

module.exports = router;