const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// get request for all tasks

router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "tasks" ORDER BY "completeStatus", "priority", "dueDate";';
    pool.query(queryText).then(result => {

        res.send(result.rows);
    })
    .catch(error => {
        console.log('error getting tasks from server and db', error);
        res.sendStatus(500);
    }); // end of catch statement
}); // end of get method






module.exports = router;