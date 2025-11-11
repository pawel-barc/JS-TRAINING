let tasks = [];

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const czesio = document.getElementById("czesio");

function addTask() {
  const taskText = input.value.trim();
  if (taskText === "") return;

  tasks.push(taskText);

  renderTasks();

  input.value = "";
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task;

    li.addEventListener("click", () => {
      li.classList.toggle("done");
    });
    taskList.appendChild(li);
  });
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addTask();
});

console.log(czesio.getAttribute("src"));
console.log(czesio.src);
