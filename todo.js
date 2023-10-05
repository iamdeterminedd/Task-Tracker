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

  input.value = '';
});
