// Variables
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");

const tasksTab = document.querySelector("#task-tab");
const completedTab = document.querySelector("#completed-tab");

const taskList = document.querySelector("#tasks");
const completedTasks = document.querySelector("#completed");

const editInput = document.querySelector(".edit-input");
const editBtn = document.querySelector(".edit-btn");

let tasksArr = localStorage.tasks
  ? localStorage.getItem("tasks").split(",")
  : [];
let completedTaskArr = localStorage.completed
  ? localStorage.getItem("completed").split(",")
  : [];

tasksArr.forEach((task) => addTask(task, taskList));
completedTaskArr.forEach((task) => addTask(task, completedTasks));

// Event Listeners

// Event listener for adding task
taskForm.addEventListener("submit", (e) => {
  const task = taskInput.value;
  e.preventDefault();
  tasksArr.push(task);
  localStorage.setItem("tasks", tasksArr);
  addTask(task, taskList);
  taskInput.value = "";
});

// Event listener for Task and Completed tabs, removes and adds necessary classes for styling/displaying
tasksTab.addEventListener("click", () => {
  if (tasksTab.classList.contains("selected")) return;
  completedTab.classList.remove("selected");
  tasksTab.classList.add("selected");
  taskList.classList.remove("hidden");
  completedTasks.classList.add("hidden");
});

completedTab.addEventListener("click", () => {
  if (completedTab.classList.contains("selected")) return;
  completedTab.classList.add("selected");
  tasksTab.classList.remove("selected");
  taskList.classList.add("hidden");
  completedTasks.classList.remove("hidden");
});
//

// Functions

// Creates elements and necessary attributes for when you add a task
function addTask(task, list) {
  if (!task) return;

  const listItem = document.createElement("li");
  const para = document.createElement("p");
  const icons = document.createElement("div");
  const crossIcon = document.createElement("i");
  const tickIcon = document.createElement("i");
  const editIcon = document.createElement("i");

  listItem.setAttribute("id", "task");

  icons.setAttribute("class", "icons");

  crossIcon.setAttribute("class", "x fa-solid fa-xmark");
  tickIcon.setAttribute("class", "tick fa-solid fa-check");
  tickIcon.setAttribute("onclick", "addToCompleted(this)");

  editIcon.setAttribute("class", "edit fa-regular fa-pen-to-square");
  editIcon.setAttribute("onClick", "addEditField(this)");

  para.innerText = task;

  icons.appendChild(crossIcon);
  if (list === taskList) {
    icons.appendChild(tickIcon);
    icons.appendChild(editIcon);
    crossIcon.addEventListener("click", function () {
      deleteTask(this, tasksArr);
    });
  } else {
    crossIcon.addEventListener("click", function () {
      deleteTask(this, completedTaskArr);
    });
  }

  listItem.appendChild(para);
  listItem.appendChild(icons);

  list.appendChild(listItem);
}

// removes task from either tasks/completed list
function deleteTask(btn, list) {
  const thisTask = btn.parentElement.previousElementSibling.innerText;
  if (list === tasksArr) {
    tasksArr = tasksArr.filter(function (task) {
      return task !== thisTask;
    });
    localStorage.setItem("tasks", tasksArr);
  } else {
    completedTaskArr = completedTaskArr.filter(function (task) {
      return task !== thisTask;
    });
    localStorage.setItem("completed", completedTaskArr);
  }

  console.log(list);
  
  
  btn.parentElement.parentElement.remove();
}

// moves task to completed list
function addToCompleted(btn) {
  const task = btn.parentElement.parentElement;
  const thisTask = btn.parentElement.previousElementSibling.innerText;
  const deleteBtn = btn.previousElementSibling;
  tasksArr = tasksArr.filter(function (task) {
    return task !== thisTask;
  });
  deleteBtn.setAttribute("onClick", "deleteTask(this, completedTaskArr)");
  completedTaskArr.push(thisTask);
  localStorage.setItem("tasks", tasksArr.join(","));
  localStorage.setItem("completed", completedTaskArr.join(","));

  task.classList.add("complete");

  btn.nextElementSibling.remove();
  btn.remove();
  completedTasks.appendChild(task);
}

function addEditField(btn) {
  const task = btn.parentElement.parentElement;
  const taskText = btn.parentElement.previousElementSibling;

  const div = document.createElement("div");
  const input = document.createElement("input");
  const button = document.createElement("button");

  

  input.type = "text";
  input.className = "edit-input";
  input.placeholder = "Edit task";
  input.autocomplete = "off";
  button.className = "edit-btn";
  button.innerText = "Edit";
  button.addEventListener("click", function () {
    editTask(this, taskText.innerText);
  });

  taskText.remove();
  div.append(input);
  div.append(button);
  task.prepend(div);
}

function editTask(btn, oldText) {
  const task = btn.parentElement.parentElement;
  const input = task.firstElementChild.firstElementChild;
  const inputDiv = input.parentElement;
  const editedText = input.value;
  const para = document.createElement("p");
  const index = tasksArr.indexOf(oldText);
  
  tasksArr.splice(index, 1, editedText);
  localStorage.setItem("tasks", tasksArr);
  if (!editedText) return;
  para.innerText = editedText;
  task.prepend(para);

  inputDiv.remove();
}
