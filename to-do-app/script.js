let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingTaskId = null;

function formatDate(date) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString("en-US", options);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const pendingContainer = document.getElementById("pendingTasks");
  const completedContainer = document.getElementById("completedTasks");

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  if (pendingTasks.length === 0) {
    pendingContainer.innerHTML =
      '<div class="empty-message">No pending tasks</div>';
  } else {
    pendingContainer.innerHTML = pendingTasks
      .map(
        (task) => `
                    <div class="task-item">
                        <div class="task-content">
                            <div class="task-title">${task.title}</div>
                            <div class="task-description">${
                              task.description
                            }</div>
                            <div class="task-timestamp">Added: ${formatDate(
                              task.addedAt
                            )}</div>
                        </div>
                        <div class="task-actions">
                            <button class="complete-btn" onclick="toggleComplete('${
                              task.id
                            }')">Complete</button>
                            <button class="edit-btn" onclick="openEditModal('${
                              task.id
                            }')">Edit</button>
                            <button class="delete-btn" onclick="deleteTask('${
                              task.id
                            }')">Delete</button>
                        </div>
                    </div>
                `
      )
      .join("");
  }

  if (completedTasks.length === 0) {
    completedContainer.innerHTML =
      '<div class="empty-message">No completed tasks</div>';
  } else {
    completedContainer.innerHTML = completedTasks
      .map(
        (task) => `
                    <div class="task-item completed">
                        <div class="task-content">
                            <div class="task-title">${task.title}</div>
                            <div class="task-description">${
                              task.description
                            }</div>
                            <div class="task-timestamp">
                                Added: ${formatDate(task.addedAt)}<br>
                                Completed: ${formatDate(task.completedAt)}
                            </div>
                        </div>
                        <div class="task-actions">
                            <button class="incomplete-btn" onclick="toggleComplete('${
                              task.id
                            }')">Undo</button>
                            <button class="edit-btn" onclick="openEditModal('${
                              task.id
                            }')">Edit</button>
                            <button class="delete-btn" onclick="deleteTask('${
                              task.id
                            }')">Delete</button>
                        </div>
                    </div>
                `
      )
      .join("");
  }
}

document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const validationMsg = document.getElementById("validationMsg");

  if (!title || !description) {
    validationMsg.classList.add("show");
    return;
  }

  validationMsg.classList.remove("show");

  const newTask = {
    id: Date.now().toString(),
    title: title,
    description: description,
    completed: false,
    addedAt: new Date().toISOString(),
    completedAt: null,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
});

function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  }
}

function openEditModal(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    editingTaskId = id;
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value = task.description;
    document.getElementById("editModal").classList.add("show");
  }
}

function closeEditModal() {
  document.getElementById("editModal").classList.remove("show");
  editingTaskId = null;
}

function updateTask() {
  const task = tasks.find((t) => t.id === editingTaskId);
  if (task) {
    const newTitle = document.getElementById("editTitle").value.trim();
    const newDescription = document
      .getElementById("editDescription")
      .value.trim();

    if (!newTitle || !newDescription) {
      alert("Please fill out all fields");
      return;
    }

    task.title = newTitle;
    task.description = newDescription;
    saveTasks();
    renderTasks();
    closeEditModal();
  }
}

renderTasks();
