const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

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

  taskList.appendChild(label);
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

function onClickTask(e) {
  if (e.target.parentElement.classList.contains('remove-task')) {
    removeTask(e.target.parentElement.parentElement);
  }
}

function removeTask(removeTask) {
  if (confirm('Are you sure?')) {
    removeTask.remove();
    removeTaskFromLocalStorage(removeTask.textContent);
  }
}

function removeTaskFromLocalStorage(removeTask) {
  let taskFromLocalStorage = getSaveFromLocalStorage();
  taskFromLocalStorage = taskFromLocalStorage.filter((i) => i !== removeTask);

  localStorage.setItem('tasks', JSON.stringify(taskFromLocalStorage));
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
taskList.addEventListener('click', onClickTask);
document.addEventListener('DOMContentLoaded', displayAllSavedTasks);
