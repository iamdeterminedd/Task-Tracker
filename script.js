const draggables = document.querySelectorAll('.task');
const droppables = document.querySelectorAll('.task-column');
const todoHeading = document.querySelector('.todo .heading').textContent;
const doingHeading = document.querySelector('.doing .heading').textContent;
const doneHeading = document.querySelector('.done .heading').textContent;
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
let savedFromLocalStorage = [];

function displayAllSavedTasks() {
  savedFromLocalStorage = getSaveFromLocalStorage();
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
  // switch (true) {
  //   case zone.id.includes(todoHeading):
  //     console.log('hello, todo!');
  //     return 'ToDo';
  //   case zone.id.includes(doingHeading):
  //     console.log('hello, doing!');
  //     return 'Doing';
  //   case zone.id.includes(doneHeading):
  //     console.log('hello, done!');
  //     return 'Done';
  // }
  console.log(zone.className);

  switch (true) {
    case zone.className === 'task-column todo':
      console.log('Detected zone: ToDo');
      return 'ToDo';
    case zone.className === 'task-column doing':
      console.log('Detected zone: Doing');
      return 'Doing';
    case zone.className === 'task-column done':
      console.log('Detected zone: Done');
      return 'Done';
    default:
      console.error('Unknown zone:', zone);
      return ''; // or throw an error if this is unexpected
  }
}

function addNewTaskSubmit(e) {
  e.preventDefault();
  const value = input.value;

  if (!value) return;

  const newTask = {
    id: savedFromLocalStorage.length + 1,
    value,
    status: 'ToDo',
  };

  addNewTaskToDisplay(newTask);
  saveToLocalStorage(newTask);

  input.value = '';
}

function addNewTaskToDisplay(task) {
  // const columns = {
  //   ToDo: document.getElementsByClassName('task-column todo'),
  //   Doing: document.getElementsByClassName('task-column doing'),
  //   Done: document.getElementsByClassName('task-column done'),
  // };

  // Object.keys(columns).forEach((status) => {
  //   const column = columns[status];
  //   column.innerHTML = `<h2>${status}</h2>`;
  // });

  // savedFromLocalStorage.forEach((task) => {
  const label = document.createElement('p');
  const button = createRemoveButton('remove-task btn-remove txt-red');

  label.classList.add('task');
  label.setAttribute('draggable', 'true');
  // label.innerHTML = newTask;
  label.textContent = `${task.value}`;
  label.appendChild(button);

  label.addEventListener('dragstart', () => {
    label.classList.add('is-dragging');
  });

  label.addEventListener('dragend', () => {
    label.classList.remove('is-dragging');
  });

  // taskList.appendChild(label);
  // columns[task.status][0].appendChild(label);

  const columnId = getColumnId(task.status);
  const column = document.querySelector(`.task-column.${columnId}`);
  column.innerHTML = `<h2>${task.status}</h2>`;
  column.appendChild(label);
  console.log(columnId);

  // });
}

function getColumnId(status) {
  switch (status) {
    case 'ToDo':
      return 'todo';
    case 'Doing':
      return 'doing';
    case 'Done':
      return 'done';
    default:
      return '';
  }
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
  const taskIndex = savedFromLocalStorage.findIndex(
    (task) => task.id == taskId
  );

  if (taskIndex !== -1) {
    const movedTask = savedFromLocalStorage.splice(taskIndex, 1)[0];
    savedFromLocalStorage.splice(newPosition, 0, movedTask);
    movedTask.status = newStatus;

    // addNewTaskToDisplay(movedTask);
    saveToLocalStorage(savedFromLocalStorage);
  }

  console.log('Move Task Called');
  // ... rest of the code

  // Log relevant information
  console.log('Task ID:', taskId);
  console.log('New Status:', newStatus);
  console.log('New Position:', newPosition);
}

function onClickTask(e) {
  if (e.target.parentElement.classList.contains('remove-task')) {
    removeTask(e.target.parentElement.parentElement);
  }
}

function removeTask(removeTask) {
  if (confirm('Are you sure?')) {
    // removeTask.remove();
    // removeTaskFromLocalStorage(removeTask.textContent);

    const taskId = removeTask.dataset.TaskId;
    removeTask.remove();
    removeTaskFromLocalStorage(taskId);
  }
}

function removeTaskFromLocalStorage(taskId) {
  // let taskFromLocalStorage = getSaveFromLocalStorage();
  // taskFromLocalStorage = taskFromLocalStorage.filter((i) => i !== removeTask);

  savedFromLocalStorage = savedFromLocalStorage.filter(
    (task) => task.id !== parseInt(taskId)
  );

  localStorage.setItem('tasks', JSON.stringify(savedFromLocalStorage));
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

// getSaveFromLocalStorage();

form.addEventListener('submit', addNewTaskSubmit);
taskList.addEventListener('click', onClickTask);
document.addEventListener('DOMContentLoaded', displayAllSavedTasks);
