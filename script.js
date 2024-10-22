// Select DOM elements
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const quantityInput = document.getElementById('quantity-input');
const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');

// Load tasks from localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let completedTodos = JSON.parse(localStorage.getItem('completedTodos')) || [];

// Render tasks on page load
window.onload = function() {
    renderTasks(todos, todoList);
    renderTasks(completedTodos, completedList, true);
}

// Add a new task
todoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskDescription = taskInput.value.trim();
    const taskQuantity = quantityInput.value.trim() || 1;

    if (taskDescription !== "") {
        const newTask = {
            id: Date.now(),
            description: taskDescription,
            quantity: taskQuantity,
            completed: false
        };

        todos.push(newTask);
        saveToLocalStorage();
        renderTasks(todos, todoList);

        taskInput.value = "";
        quantityInput.value = "";
    }
});

// Render tasks
function renderTasks(taskArray, listElement, isCompleted = false) {
    listElement.innerHTML = "";
    taskArray.forEach(task => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${task.description} (x${task.quantity})`;

        const completeButton = document.createElement('button');
        completeButton.textContent = isCompleted ? "Fortryd" : "Færdig";
        completeButton.classList.add(isCompleted ? 'undo' : 'complete');
        completeButton.addEventListener('click', () => toggleTaskCompletion(task.id, isCompleted));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Slet";
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteTask(task.id, isCompleted));

        listItem.appendChild(completeButton);
        listItem.appendChild(deleteButton);
        listElement.appendChild(listItem);
    });
}

// Toggle task completion
function toggleTaskCompletion(taskId, isCompleted) {
    if (isCompleted) {
        const task = completedTodos.find(task => task.id === taskId);
        todos.push(task);
        completedTodos = completedTodos.filter(task => task.id !== taskId);
    } else {
        const task = todos.find(task => task.id === taskId);
        completedTodos.push(task);
        todos = todos.filter(task => task.id !== taskId);
    }
    saveToLocalStorage();
    renderTasks(todos, todoList);
    renderTasks(completedTodos, completedList, true);
}

// Delete task
function deleteTask(taskId, isCompleted) {
    if (isCompleted) {
        completedTodos = completedTodos.filter(task => task.id !== taskId);
    } else {
        todos = todos.filter(task => task.id !== taskId);
    }
    saveToLocalStorage();
    renderTasks(todos, todoList);
    renderTasks(completedTodos, completedList, true);
}

// Save tasks to localStorage
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
}