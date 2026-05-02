// ---- Signup Handler ----
function initSignup() {
  if (!requireGuest()) return;
  const form = document.getElementById('signup-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // Validate
    let valid = true;
    if (!name || name.length < 2) { showFieldError('name', 'Name must be at least 2 characters'); valid = false; }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { showFieldError('email', 'Please enter a valid email'); valid = false; }
    if (!password || password.length < 6) { showFieldError('password', 'Password must be at least 6 characters'); valid = false; }
    if (password !== confirmPassword) { showFieldError('confirmPassword', 'Passwords do not match'); valid = false; }
    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    setLoading(btn, true);

    try {
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showToast('Account created successfully!');
      setTimeout(() => window.location.href = 'dashboard.html', 500);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(btn, false);
    }
  });
}

// ---- Login Handler ----
function initLogin() {
  if (!requireGuest()) return;
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const email = form.email.value.trim();
    const password = form.password.value;

    let valid = true;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { showFieldError('email', 'Please enter a valid email'); valid = false; }
    if (!password) { showFieldError('password', 'Password is required'); valid = false; }
    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    setLoading(btn, true);

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showToast('Welcome back!');
      setTimeout(() => window.location.href = 'dashboard.html', 500);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(btn, false);
    }
  });
}

// ---- Helpers ----
function showFieldError(fieldName, message) {
  const input = document.querySelector(`[name="${fieldName}"]`);
  const errorEl = document.getElementById(`${fieldName}-error`);
  if (input) input.classList.add('error');
  if (errorEl) { errorEl.textContent = message; errorEl.classList.add('show'); }
}

function clearErrors() {
  document.querySelectorAll('.form-group input').forEach(i => i.classList.remove('error'));
  document.querySelectorAll('.form-error').forEach(e => { e.textContent = ''; e.classList.remove('show'); });
}

function setLoading(btn, loading) {
  if (loading) {
    btn.disabled = true;
    btn.dataset.text = btn.textContent;
    btn.innerHTML = '<span class="spinner"></span>';
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.text || 'Submit';
  }
}
