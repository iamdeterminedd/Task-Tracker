const draggables = document.querySelectorAll('.task');
const droppables = document.querySelectorAll('.task-column');
const todoHeading = document.querySelector('.todo .heading').textContent;
const doingHeading = document.querySelector('.doing .heading').textContent;
const doneHeading = document.querySelector('.done .heading').textContent;
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
let tasks = [];
let savedFromLocalStorage = [];

function displayAllSavedTasks() {
  const savedFromLocalStorage = getSaveFromLocalStorage();
  savedFromLocalStorage.forEach((task) => addNewTaskToDisplay(task));
}

draggables.forEach((task) => {
  task.addEventListener('dragstart', () => {
    task.classList.add('is-dragging');
  });
  task.addEventListener('dragend', () => {
    task.classList.remove('is-dragging');
  });
});

droppables.forEach((zone) => {
  zone.addEventListener('drop', (e) => {
    e.preventDefault();

    const newStatus = getStatusFromZOne(zone);
    const taskID = e.dataTransfer.getData('text/plain');
    moveTask(taskID, newStatus, getPositionInList(zone, e.clientY));
  });

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();

    const bottomTask = insertAboveTask(zone, e.clientY);
    const curTask = document.querySelector('.is-dragging');

    if (!bottomTask) {
      zone.appendChild(curTask);
    } else {
      zone.insertBefore(curTask, bottomTask);
    }
  });
});

const insertAboveTask = (zone, mouseY) => {
  const els = zone.querySelectorAll('.task:not(.is-dragging)');

  let closestTask = null;
  let closesOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();

    const offset = mouseY - top;

    if (offset < 0 && offset > closesOffset) {
      closesOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
};

function getPositionInList(zone, mouseY) {
  const taskInZone = Array.from(
    zone.querySelectorAll('.task:not(.is-dragging)')
  );

  return taskInZone.findIndex((task) => {
    const { top, bottom } = task.getBoundingClientRect();
    const middle = (top + bottom) / 2;
    return mouseY < middle;
  });
}

function getStatusFromZOne(zone) {
  switch (true) {
    case zone.id.includes(todoHeading):
      console.log('hello, todo!');
      return 'ToDo';
    case zone.id.includes(doingHeading):
      console.log('hello, doing!');
      return 'Doing';
    case zone.id.includes(doneHeading):
      console.log('hello, done!');
      return 'Done';
  }
}

function addNewTaskSubmit(e) {
  e.preventDefault();
  const value = input.value;

  if (!value) return;

  // const newTask ={
  //   id:
  // }

  addNewTaskToDisplay(value);
  saveToLocalStorage(value);

  input.value = '';
}

function addNewTaskToDisplay(newTask) {
  const columns = {
    ToDo: document.getElementById('todo-column'),
    Doing: document.getElementById('doing-column'),
    Done: document.getElementById('done-column'),
  };

  Object.keys(columns).forEach((status) => {
    const column = columns[status];
    column.innerHTML = `<h2>${status}</h2>`;
  });

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

function moveTask(taskId, newStatus, newPosition) {
  const taskIndex = tasks.findIndex((task) => task.id == taskId);

  if (taskIndex !== -1) {
    const movedTask = tasks.splice(taskIndex, 1)[0];
    tasks.splice(newPosition, 0, movedTask);
    movedTask.status = newStatus;
  }
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
  savedFromLocalStorage = getSaveFromLocalStorage();

  savedFromLocalStorage.push(saveData);

  localStorage.setItem('tasks', JSON.stringify(savedFromLocalStorage));
}

function getSaveFromLocalStorage() {
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
