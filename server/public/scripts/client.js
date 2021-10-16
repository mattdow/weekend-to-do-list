console.log('JS active');

$(document).ready(function () {
console.log('jQuery sourced.');
// initial calling of task list
refreshTasks();


});

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
}

// renderBooks will display the current array of tasks to the DOM
function renderTasks(tasks) {
  // empty the active task table
    $('#taskTable').empty();
    // loop through the tasks
    for(let i=0; i < tasks.length; i++) {
        let task = tasks[i];
        // set a temp variable equating to the completed status
        let completed = 'No';
        if (task.completeStatus) {
            completed = 'Yes';
        }
        // For each book, append a new row to the table
        let taskRow = $(`
        <tr data-id="${task.id}">
            <td>${task.taskname}</td>
            <td>${task.priority}</td>
            <td>${task.dueDate}</td>
            <td>${task.contextTag}</td>
            <td>
                <button class="completeBtn">Mark Complete</button>
            </td>
            <td>
                <button class="deleteBtn">Delete Task</button>
            </td>
            `) // end of row rendering code
            $('#taskTable').append(taskRow);
    } // end of for loop
} // end of renderTasks