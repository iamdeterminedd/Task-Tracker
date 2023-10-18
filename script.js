const draggables = document.querySelectorAll('.task');
const droppables = document.querySelectorAll('.task-column');
const todoHeading = document.querySelector('.todo .heading').textContent;
const doingHeading = document.querySelector('.doing .heading').textContent;
const doneHeading = document.querySelector('.done .heading').textContent;
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
// const taskList = document.getElementById('task-list');
const taskList = document.querySelectorAll('#task-list');
let savedFromLocalStorage = [];

let try1 = { id: 3, value: 'shopping', status: 'ToDo' };

taskList.forEach((list) => {
  list.addEventListener('click', onClickTask);
});

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
    addNewTaskToDisplay();
    saveToLocalStorage();
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

  savedFromLocalStorage.push(newTask);

  addNewTaskToDisplay();
  saveToLocalStorage();

  input.value = '';
}

function addNewTaskToDisplay() {
  const columns = {
    ToDo: document.querySelector('.task-column.todo'),
    Doing: document.querySelector('.task-column.doing'),
    Done: document.querySelector('.task-column.done'),
  };

  Object.keys(columns).forEach((status) => {
    const column = columns[status];
    column.innerHTML = `<h2>${status}</h2>`;
  });

  savedFromLocalStorage.forEach((task) => {
    const label = document.createElement('p');
    const button = createRemoveButton('remove-task btn-remove txt-red');

    label.classList.add('task');
    label.setAttribute('draggable', 'true');
    label.textContent = `${task.value}`;
    label.appendChild(button);

    label.addEventListener('dragstart', (e) => {
      drag(e, task.id);
      label.classList.add('is-dragging');
    });

    label.addEventListener('dragend', () => {
      label.classList.remove('is-dragging');
    });

    const column = columns[task.status];

    if (column) {
      column.appendChild(label);
    } else {
      console.log('Column not found', task.status);
    }
  });
}

function addNewTaskToLocalStorage(task) {
  savedFromLocalStorage.push(task);
  localStorage.setItem('tasks', JSON.stringify(savedFromLocalStorage));
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

function drag(e, taskId) {
  e.dataTransfer.setData('text/plain', taskId);
}

function moveTask(taskId, newStatus, newPosition) {
  const taskIndex = savedFromLocalStorage.findIndex(
    (task) => task.id == taskId
  );

  if (taskIndex !== -1) {
    const movedTask = savedFromLocalStorage.splice(taskIndex, 1)[0];
    savedFromLocalStorage.splice(newPosition, 0, movedTask);
    movedTask.status = newStatus;

    saveToLocalStorage(movedTask);
    console.log(movedTask);
  }

  console.log('Move Task Called');

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
    const content = removeTask.innerText.trim();

    removeTask.remove();
    removeTaskFromLocalStorage(content);
  }
}

function removeTaskFromLocalStorage(taskId) {
  // const taskText = taskId.textContent.trim();
  // let taskFromLocalStorage = getSaveFromLocalStorage();
  // console.log(taskText);
  console.log(taskId);
  console.log(savedFromLocalStorage);
  //savedFromLocalStorage = savedFromLocalStorage.filter((i) => i !== taskId);
  savedFromLocalStorage = savedFromLocalStorage.filter(
    (i) => i.value !== taskId
  ); //* excluding taskId value and creating new array named index(before some excluded)
  // let index = savedFromLocalStorage.findIndex((i) => i == taskId);
  // console.log(index);
  console.log(savedFromLocalStorage);

  if (savedFromLocalStorage !== -1) {
    // savedFromLocalStorage.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(savedFromLocalStorage));
    console.log('hello');
  }

  // const taskIndex = savedFromLocalStorage.findIndex(
  //   (task) => task === parseInt(taskText)
  // );
  // let index = savedFromLocalStorage.findIndex((i) => i === taskText);

  // console.log(index);

  // if (index !== -1) {
  //   savedFromLocalStorage.splice(index, 1);
  //   localStorage.setItem('tasks', JSON.stringify(savedFromLocalStorage));
  // }

  // console.log(taskId);
  // savedFromLocalStorage = savedFromLocalStorage.filter(
  //   (task) => task.id !== parseInt(taskId)
  // );

  // console.log(savedFromLocalStorage);
}

function saveToLocalStorage() {
  // savedFromLocalStorage = getSaveFromLocalStorage();
  // console.log(savedFromLocalStorage);

  // savedFromLocalStorage.push(saveData);

  localStorage.setItem('tasks', JSON.stringify(savedFromLocalStorage));
}

function getSaveFromLocalStorage() {
  const storedData = localStorage.getItem('tasks');

  if (storedData) {
    savedFromLocalStorage = JSON.parse(storedData);
    addNewTaskToDisplay();
  }
  // if (localStorage.getItem('tasks') === null) {
  //   savedFromLocalStorage = [];
  // } else {
  //   savedFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
  // }

  // return savedFromLocalStorage;
}

getSaveFromLocalStorage();

form.addEventListener('submit', addNewTaskSubmit);
// taskList.addEventListener('click', onClickTask);
// document.addEventListener('DOMContentLoaded', displayAllSavedTasks);
