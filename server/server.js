const express = require('express');
const bodyParser = require('body-parser');
const tasksRouter = require('./routes/tasks.router.js');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use('/tasks', tasksRouter);

// serve back static files
app.use(express.static('server/public'));

// Listen for requests
const PORT = 5000;
app.listen(PORT, () => {
    console.log('listening on port', PORT);
});