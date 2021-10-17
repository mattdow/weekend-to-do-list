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

// get request for resorted tasks
router.get('/:cat', (req, res) => {
    console.log(req.params);
    let cat = req.params.cat;
    console.log('Resorting tasks by', cat);
    // define the query text for the resort
    let queryText = `SELECT * FROM "tasks"
                    ORDER BY $1;`;
    console.log(queryText);
    values = [cat];
    pool.query(queryText, values).then(result => {
        res.send(result.rows);
    })
    .catch(error => {
        console.log('error getting tasks from server and db', error);
        res.sendStatus(500);
    }); // end of catch statement
}); // end router get

// post request for new tasks
router.post('/', (req, res) => {
    let newTask = req.body;
    console.log('Adding task', newTask);
    // define the query text to add the new task
    let queryText = `INSERT INTO "tasks" ("taskname", "priority", "dueDate", "contextTag", "completeStatus")
    VALUES ($1, $2, $3, $4, $5)
    ;`;
    // define a posting array
    let postArray = [newTask.taskname, newTask.priority, newTask.dueDate, newTask.contextTag, newTask.completeStatus];
    pool.query(queryText, postArray)
        .then(result => {
            res.sendStatus(201);
        })
        .catch(error => {
            console.log('Error adding new task', error);
            res.sendStatus(500);
        });
}); // end of post method

// define a delete method to remove tasks from the to-do list
router.delete('/:id', (req, res) => {
    // turn the id data into a variable
    let id = req.params.id;
    console.log('In delete method for ID', id);
    let queryText = `
        DELETE FROM "tasks"
        WHERE "id" = $1;
        `;
    // define an array variable to pass into pool.query
    let values = [id];
    pool.query(queryText, values)
    .then(result => {
        res.sendStatus(204);
    }).catch(err => {
        console.log('Error in song delete');
        res.sendStatus(500);        
    });
}); // end of router delete

// define a put method to mark tasks as complete
router.put('/:id', (req, res) => {
    let id = req.params.id;
    console.log('Put method activated for id', id);
    let queryText = `UPDATE "tasks"
                    SET "completeStatus" = TRUE
                    WHERE "id" = $1;
                    `;
    let values = [id];
    pool.query(queryText, values)
        .then((result) => {
            console.log('Put server result is', result);
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('Error making PUT request to DB', err);
            res.sendStatus(500);
        });
}) // end of server put





module.exports = router;