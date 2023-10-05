const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskName = document.getElementById('task-name');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value;

  if (!value) return;

  const newTask = document.createElement('p');
  newTask.classList.add('task');
  newTask.setAttribute('draggable', 'true');
  newTask.innerHTML = value;

  newTask.addEventListener('dragstart', () => {
    newTask.classList.add('is-dragging');
  });

  newTask.addEventListener('dragend', () => {
    newTask.classList.remove('is-dragging');
  });

  taskName.appendChild(newTask);
  saveToLocalStorage(value);

  input.value = '';
});

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
