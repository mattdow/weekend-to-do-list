console.log('JS active');

$(document).ready(function () {
console.log('jQuery sourced.');
// initial calling of task list
refreshTasks();
addClickHandlers();


});

// define click handling function
function addClickHandlers() {
    $('#submitBtn').on('click', handleSubmit);

    // in order for the Bootstrap confirm delete modal to work, I need to pass the id of the task to the final confirmation button.
    $('#taskOutput').on('click', '.deleteBtn', function() {
        let idToDelete = $(this).closest('tr').data('id')
        $('#confirm-button').data('id', idToDelete);
    });
    // now I can call the delete request with the confirm button
    $('#confirm-button').on('click', handleDelete);
    $('#taskOutput').on('click', '.completeBtn', handleComplete);
}

// refreshTasks will get all tasks currently in server/DB and render to page
function refreshTasks() {
    $.ajax({
        type: 'GET',
        url: '/tasks'
    }).then(function(response) {
        console.log('Tasklist refreshing', response);
        renderTasks(response);        
    }).catch(function(error){
        console.log('error in GET', error);        
    });
    // after refreshing tasks, clear inputs
    $('.textInput').val('');
}

// renderBooks will display the current array of tasks to the DOM
function renderTasks(tasks) {
  // empty the active task table
    $('#taskTable').empty();
    // initialize two variables for completed class and content
    let completed = '';
    let completeClass = '';
    // initialize priority class at the lowest task urgency level
    let priorityClass = 'priority-3';
    // loop through the tasks
    for(let i=0; i < tasks.length; i++) {
        let task = tasks[i];
        // call a function to determine classes and content
        console.log("Task priority is",task.priority);
        if (task.completeStatus) {
            // redefine the initialized variables if completeStatus is true
            completed = 'Task Complete';
            completeClass = 'hidden';
            priorityClass = 'table-success';
        } else if (task.priority === 1) {
            priorityClass = 'table-danger';
        } else if (task.priority === 2) {
            priorityClass = 'table-warning';
        } else if (task.priority === 3) {
            priorityClass = 'table-primary';
        } // end of conditionals
        // use a parse date function to get a palatable date 
        let convertedDueDate = parseDate(task.dueDate);
        // For each book, append a new row to the table with appropriate content and classes
        let taskRow = $(`
        <tr class="${priorityClass}" data-id="${task.id}">
            <td class="task-name">${task.taskname}</td>
            <td class="task-priority">${task.priority}</td>
            <td class="task-date">${convertedDueDate}</td>
            <td>${task.contextTag}</td>
            <td>
                <button ${completeClass} class="completeBtn btn btn-success">Mark Complete</button>
                ${completed}
            </td>
            <td>
                <button class="deleteBtn btn btn-danger" data-toggle="modal" data-target="#deleteModal">Delete Task</button>
            </td>
            `) // end of row rendering code
            $('#taskTable').append(taskRow);
    } // end of for loop
} // end of renderTasks


// define handleSubmit function to handle a newly posted task
function handleSubmit() {
    console.log('Submit button clicked.');
    // initialize a task to enter inputs
    let taskToAdd = {};
    taskToAdd.taskname = $('#taskInput').val();
    taskToAdd.priority = $('#priorityInput').val();
    taskToAdd.dueDate = $('#dueDateInput').val();
    taskToAdd.contextTag = $('#contextInput').val();
    taskToAdd.completeStatus = false;
    // make Ajax call to add the book to the database
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: taskToAdd,
    }).then(function(response) {
        console.log('POST response from server', response);
        // call refreshTasks function to re-render
        refreshTasks();
    }).catch(function(error) {
        console.log('Error in POST', error);
        alert('Unable to add task at this time.');        
    });    
} // end handleSubmit

// define handleDelete function to remove tasks from DB and DOM
function handleDelete(){
    let idToDelete = $(this).data('id');
    console.log('Deleting item', idToDelete);
    $.ajax({
        type: 'DELETE',
        url: `/tasks/${idToDelete}`
    }).then(function (response) {
        console.log('Response from server upon delete', response);
        // DB updated, need to refresh DOM
        refreshTasks();
    }).catch(function(error) {
        console.log('Error from server on delete', error);
    });    
} // end handleDelete function

// define handleComplete function to adjust the DB and DOM
function handleComplete(){
    console.log('Complete button clicked');
    let id = $(this).closest('tr').data('id');
    console.log('Marking completed task ID', id);
    $.ajax({
        type: 'PUT',
        url: `tasks/${id}`
    }).then(function (response) {
        console.log('Response from mark complete', response);
        // refresh the DOM
        refreshTasks();
    }).catch(function (error) {
        console.log('Error from read status', error);        
    });    
} // end of handleComplete

// define a function to convert the SQL date to something more palatable. I Googled for ideas, and my function is a 
// modification of the code found here: https://itnext.io/create-date-from-mysql-datetime-format-in-javascript-912111d57599

function parseDate(sqlDate) {
    // console.log(sqlDate);
    // chop off the year month and day string
    let ydmDate = sqlDate.split('T')[0];
    // console.log(ydmDate);
    // split up the year month and day
    let [dateYear, dateMonth, dateDay] = [...ydmDate.split("-")];
    // define an object of month abbreviations
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // redefine the month as abbreviated text, converting the numerical month to an index
    dateMonth = months[dateMonth-1];
    // redefine the date as a string to return
    let monthDayString = `${dateMonth} ${dateDay}`
    return monthDayString;
} // end parseDate