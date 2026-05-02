let allTasks = [];
let currentFilter = 'all';

// ---- Init Dashboard ----
function initDashboard() {
  if (!requireAuth()) return;

  // Set user name
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const greetEl = document.getElementById('user-name');
  if (greetEl) greetEl.textContent = user.name || 'User';

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });

  // Add task toggle
  const toggleBtn = document.getElementById('add-task-toggle');
  const addForm = document.getElementById('add-task-form');
  const cancelBtn = document.getElementById('cancel-add');

  toggleBtn?.addEventListener('click', () => {
    toggleBtn.style.display = 'none';
    addForm.classList.add('show');
    document.getElementById('task-title')?.focus();
  });

  cancelBtn?.addEventListener('click', () => {
    addForm.classList.remove('show');
    toggleBtn.style.display = 'flex';
    addForm.querySelector('form')?.reset();
  });

  // Add task submit
  document.getElementById('new-task-form')?.addEventListener('submit', handleAddTask);

  // Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Load tasks
  loadTasks();
}

// ---- Load Tasks ----
async function loadTasks() {
  const listEl = document.getElementById('task-list');
  listEl.innerHTML = '<div class="page-loader"><div class="spinner"></div></div>';

  try {
    allTasks = await apiFetch('/tasks');
    renderTasks();
    updateStats();
  } catch (err) {
    listEl.innerHTML = `<div class="empty-state"><p>Failed to load tasks. Please try again.</p></div>`;
    showToast(err.message, 'error');
  }
}

// ---- Render Tasks ----
function renderTasks() {
  const listEl = document.getElementById('task-list');
  let filtered = allTasks;
  if (currentFilter === 'pending') filtered = allTasks.filter(t => t.status === 'pending');
  if (currentFilter === 'completed') filtered = allTasks.filter(t => t.status === 'completed');

  if (filtered.length === 0) {
    const msg = currentFilter === 'all' ? 'No tasks yet. Add your first task!' :
                currentFilter === 'pending' ? 'No pending tasks. Great job!' : 'No completed tasks yet.';
    listEl.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><h3>${msg}</h3><p>Stay productive and organized</p></div>`;
    return;
  }

  listEl.innerHTML = filtered.map((task, i) => `
    <div class="task-card ${task.status === 'completed' ? 'completed' : ''}" style="animation-delay: ${i * 0.05}s" data-id="${task._id}">
      <button class="task-checkbox" onclick="toggleTask('${task._id}')" title="Toggle status">
        ${task.status === 'completed' ? '✓' : ''}
      </button>
      <div class="task-body">
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">
          <span class="task-status-badge ${task.status}">${task.status}</span>
          <span>${formatDate(task.createdAt)}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn btn-icon btn-danger" onclick="deleteTask('${task._id}')" title="Delete">🗑</button>
      </div>
    </div>
  `).join('');
}

// ---- Add Task ----
async function handleAddTask(e) {
  e.preventDefault();
  const titleInput = document.getElementById('task-title');
  const descInput = document.getElementById('task-desc');
  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!title) { showToast('Please enter a task title', 'error'); return; }

  const btn = e.target.querySelector('button[type="submit"]');
  setLoading(btn, true);

  try {
    const task = await apiFetch('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
    allTasks.unshift(task);
    renderTasks();
    updateStats();
    e.target.reset();
    showToast('Task added!');

    // Collapse form
    document.getElementById('add-task-form').classList.remove('show');
    document.getElementById('add-task-toggle').style.display = 'flex';
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(btn, false);
  }
}

// ---- Toggle Task Status ----
async function toggleTask(id) {
  const task = allTasks.find(t => t._id === id);
  if (!task) return;

  const newStatus = task.status === 'pending' ? 'completed' : 'pending';
  try {
    const updated = await apiFetch(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });
    const idx = allTasks.findIndex(t => t._id === id);
    if (idx !== -1) allTasks[idx] = updated;
    renderTasks();
    updateStats();
    showToast(newStatus === 'completed' ? 'Task completed! 🎉' : 'Task reopened');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ---- Delete Task ----
async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  try {
    await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
    allTasks = allTasks.filter(t => t._id !== id);
    renderTasks();
    updateStats();
    showToast('Task deleted');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ---- Update Stats ----
function updateStats() {
  const total = allTasks.length;
  const completed = allTasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;
  document.getElementById('stat-total') && (document.getElementById('stat-total').textContent = total);
  document.getElementById('stat-pending') && (document.getElementById('stat-pending').textContent = pending);
  document.getElementById('stat-completed') && (document.getElementById('stat-completed').textContent = completed);
}

// ---- Helpers ----
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

function setLoading(btn, loading) {
  if (loading) { btn.disabled = true; btn.dataset.text = btn.textContent; btn.innerHTML = '<span class="spinner"></span>'; }
  else { btn.disabled = false; btn.textContent = btn.dataset.text || 'Submit'; }
}
