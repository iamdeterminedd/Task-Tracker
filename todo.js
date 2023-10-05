const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskName = document.getElementById('task-name');

function displayAllSavedTasks() {
  const savedFromLocalStorage = getSaveFromLocalStorage();
  savedFromLocalStorage.forEach((task) => addNewTaskToDisplay(task));
}

function addNewTaskSubmit(e) {
  e.preventDefault();
  const value = input.value;

  if (!value) return;

  addNewTaskToDisplay(value);

  saveToLocalStorage(value);

  input.value = '';
}

function addNewTaskToDisplay(newTask) {
  const label = document.createElement('p');
  label.classList.add('task');
  label.setAttribute('draggable', 'true');
  label.innerHTML = newTask;

  label.addEventListener('dragstart', () => {
    label.classList.add('is-dragging');
  });

  label.addEventListener('dragend', () => {
    label.classList.remove('is-dragging');
  });

  taskName.appendChild(label);
}

// form.addEventListener('submit', (e) => {

// });

function saveToLocalStorage(saveData) {
  let savedFromLocalStorage = getSaveFromLocalStorage();

  savedFromLocalStorage.push(saveData);

  localStorage.setItem('tasks', JSON.stringify(savedFromLocalStorage));
}

function getSaveFromLocalStorage() {
  let savedFromLocalStorage;

  if (localStorage.getItem('tasks') === null) {
    savedFromLocalStorage = [];
  } else {
    savedFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
  }

  return savedFromLocalStorage;
}

form.addEventListener('submit', addNewTaskSubmit);
document.addEventListener('DOMContentLoaded', displayAllSavedTasks);
