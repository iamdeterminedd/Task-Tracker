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
  const button = createRemoveButton('remove-task btn-remove txt-red');
  label.classList.add('task');
  label.setAttribute('draggable', 'true');
  label.innerHTML = newTask;
  label.appendChild(button);

  label.addEventListener('dragstart', () => {
    label.classList.add('is-dragging');
  });

  label.addEventListener('dragend', () => {
    label.classList.remove('is-dragging');
  });

  taskName.appendChild(label);
}

function createRemoveButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

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
