/**
 * MAHESH MALI PLATFORM — Admin Panel Script
 * Full CRUD for projects, users, leads, knowledge, navigation, content
 */

'use strict';

/* ══════════════════════════════════════════════════
   DATA LAYER (mirrors script.js DB)
══════════════════════════════════════════════════ */
const ADB = {
  KEYS: {
    PROJECTS:   'mm_projects',
    KNOWLEDGE:  'mm_knowledge',
    USERS:      'mm_users',
    LEADS:      'mm_leads',
    NAVIGATION: 'mm_navigation',
    CONTENT:    'mm_content',
    SETTINGS:   'mm_settings',
    ADMIN:      'mm_admin'
  },
  get(key)       { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } },
  set(key, val)  { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; } }
};

/* ══════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════ */
const ADMIN_STATE = { loggedIn: false, currentPanel: 'overview' };

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in this session
  const session = sessionStorage.getItem('mm_admin_session');
  if (session === 'true') {
    showDashboard();
  }

  // Pre-fill login from URL params (dev convenience only)
  const url = new URL(window.location.href);
 });

/* ══════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════ */
function adminLogin() {
  const mobile   = document.getElementById('admin-mobile')?.value.trim();
  const password = document.getElementById('admin-password')?.value;

  if (!mobile || !password) {
    showAdminToast('Enter mobile and password.', 'error');
    return;
  }

  const admin = ADB.get(ADB.KEYS.ADMIN) || { mobile: '9039473519', password: 'M@hesh@2026' };

  if (mobile === admin.mobile && password === admin.password) {
    sessionStorage.setItem('mm_admin_session', 'true');
    showDashboard();
  } else {
    showAdminToast('Invalid credentials.', 'error');
    const pwField = document.getElementById('admin-password');
    if (pwField) { pwField.value = ''; pwField.focus(); }
  }
}

function adminLogout() {
  sessionStorage.removeItem('mm_admin_session');
  ADMIN_STATE.loggedIn = false;
  document.getElementById('admin-login').style.display = '';
  document.getElementById('admin-dashboard').classList.remove('active');
}

function showDashboard() {
  ADMIN_STATE.loggedIn = true;
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-dashboard').classList.add('active');
  showAdminPanel('overview');
}

/* ══════════════════════════════════════════════════
   PANEL NAVIGATION
══════════════════════════════════════════════════ */
const PANEL_TITLES = {
  overview:   'Dashboard',
  projects:   'Projects Manager',
  users:      'Users Manager',
  leads:      'Leads Manager',
  knowledge:  'Chatbot Knowledge Base',
  navigation: 'Navigation Manager',
  content:    'Content Editor',
  settings:   'Settings'
};

function showAdminPanel(panelId) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));

  const panel = document.getElementById(`panel-${panelId}`);
  const navBtn = document.querySelector(`.admin-nav-item[data-panel="${panelId}"]`);
  if (panel) panel.classList.add('active');
  if (navBtn) navBtn.classList.add('active');

  const titleEl = document.getElementById('admin-panel-title');
  if (titleEl) titleEl.textContent = PANEL_TITLES[panelId] || panelId;

  ADMIN_STATE.currentPanel = panelId;

  // Load panel data
  const loaders = {
    overview:   renderOverview,
    projects:   renderProjectsTable,
    users:      renderUsersTable,
    leads:      renderLeadsTable,
    knowledge:  renderKnowledgeTable,
    navigation: renderNavigationList,
    content:    loadContentEditor,
    settings:   loadSettings
  };
  if (loaders[panelId]) loaders[panelId]();
}

function toggleSidebar() {
  const sb = document.getElementById('admin-sidebar');
  if (sb) sb.classList.toggle('open');
}

/* ══════════════════════════════════════════════════
   OVERVIEW / DASHBOARD
══════════════════════════════════════════════════ */
function renderOverview() {
  const projects  = ADB.get(ADB.KEYS.PROJECTS)  || [];
  const users     = ADB.get(ADB.KEYS.USERS)     || [];
  const leads     = ADB.get(ADB.KEYS.LEADS)     || [];
  const knowledge = ADB.get(ADB.KEYS.KNOWLEDGE) || [];

  const newLeads = leads.filter(l => !l.contacted).length;

  // Update leads badge
  const badge = document.getElementById('leads-badge');
  if (badge) {
    badge.textContent = newLeads;
    badge.classList.toggle('hidden', newLeads === 0);
  }

  const statsEl = document.getElementById('overview-stats');
  if (statsEl) {
    statsEl.innerHTML = [
      { icon:'🚀', value: projects.length,  label: 'Projects',       color: 'var(--cyan)' },
      { icon:'👥', value: users.length,     label: 'Users',          color: 'var(--green)' },
      { icon:'📋', value: leads.length,     label: 'Total Leads',    color: 'var(--amber)' },
      { icon:'🔔', value: newLeads,         label: 'Pending Leads',  color: 'var(--red)' },
      { icon:'🧠', value: knowledge.length, label: 'KB Entries',     color: 'var(--cyan)' }
    ].map(s => `
      <div class="admin-stat-card">
        <div class="admin-stat-icon">${s.icon}</div>
        <div class="admin-stat-value" style="color:${s.color}">${s.value}</div>
        <div class="admin-stat-label">${s.label}</div>
      </div>
    `).join('');
  }

  // Recent leads
  const recentEl = document.getElementById('overview-recent-leads');
  if (recentEl) {
    const recent = leads.slice(0, 5);
    if (!recent.length) {
      recentEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-text">No leads yet.</div></div>`;
    } else {
      recentEl.innerHTML = `
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Source</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            ${recent.map(l => `
              <tr>
                <td class="td-title">${esc(l.name)}</td>
                <td>${esc(l.phone)}</td>
                <td><span class="badge badge-cyan">${esc(l.source || 'chatbot')}</span></td>
                <td>${formatDate(l.date)}</td>
                <td><span class="badge ${l.contacted ? 'badge-green' : 'badge-amber'}">${l.contacted ? 'Contacted' : 'Pending'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;
    }
  }
}

/* ══════════════════════════════════════════════════
   PROJECTS CRUD
══════════════════════════════════════════════════ */
function renderProjectsTable() {
  const projects = ADB.get(ADB.KEYS.PROJECTS) || [];
  const el = document.getElementById('projects-table-body');
  if (!el) return;

  if (!projects.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🚀</div><div class="empty-state-text">No projects yet. Add your first one!</div></div>`;
    return;
  }

  el.innerHTML = `
    <table>
      <thead><tr><th>Title</th><th>Tags</th><th>Featured</th><th>Date</th><th>Actions</th></tr></thead>
      <tbody>
        ${projects.map(p => `
          <tr>
            <td class="td-title">${esc(p.title)}</td>
            <td>${(p.tags||[]).map(t => `<span class="badge badge-cyan">${esc(t)}</span>`).join(' ')}</td>
            <td><span class="badge ${p.featured ? 'badge-green':'badge-muted'}">${p.featured ? 'Yes':'No'}</span></td>
            <td>${p.date || '—'}</td>
            <td class="td-actions">
              <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="editProject('${esc(p.id)}')">✏️ Edit</button>
              <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteProject('${esc(p.id)}')">🗑️</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function openProjectModal(id = null) {
  const modal = document.getElementById('project-modal');
  const title = document.getElementById('project-modal-title');
  if (!modal) return;

  if (id) {
    const proj = (ADB.get(ADB.KEYS.PROJECTS) || []).find(p => p.id === id);
    if (!proj) return;
    setVal('project-edit-id', id);
    setVal('pm-title', proj.title);
    setVal('pm-description', proj.description);
    setVal('pm-image', proj.image || '');
    setVal('pm-tags', (proj.tags || []).join(', '));
    setVal('pm-link', proj.link || '');
    setVal('pm-date', proj.date || '');
    setVal('pm-featured', String(proj.featured));
    if (title) title.textContent = 'Edit Project';
  } else {
    setVal('project-edit-id', '');
    ['pm-title','pm-description','pm-image','pm-tags','pm-link'].forEach(id => setVal(id, ''));
    setVal('pm-date', '');
    setVal('pm-featured', 'false');
    if (title) title.textContent = 'Add Project';
  }
  modal.classList.add('open');
}

function editProject(id) { openProjectModal(id); }

function saveProject() {
  const id    = getVal('project-edit-id');
  const title = getVal('pm-title').trim();
  const desc  = getVal('pm-description').trim();

  if (!title || !desc) {
    showAdminToast('Title and description are required.', 'error');
    return;
  }

  const project = {
    id:          id || ('proj-' + Date.now()),
    title,
    description: desc,
    image:       getVal('pm-image').trim(),
    tags:        getVal('pm-tags').split(',').map(t => t.trim()).filter(Boolean),
    link:        getVal('pm-link').trim() || '#',
    date:        getVal('pm-date'),
    featured:    getVal('pm-featured') === 'true'
  };

  const projects = ADB.get(ADB.KEYS.PROJECTS) || [];

  if (id) {
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) projects[idx] = project;
    else projects.push(project);
  } else {
    projects.unshift(project);
  }

  ADB.set(ADB.KEYS.PROJECTS, projects);
  closeAdminModal('project-modal');
  renderProjectsTable();
  showAdminToast(`Project "${title}" ${id ? 'updated' : 'added'}!`, 'success');
}

function deleteProject(id) {
  if (!confirm('Delete this project? This cannot be undone.')) return;
  let projects = ADB.get(ADB.KEYS.PROJECTS) || [];
  projects = projects.filter(p => p.id !== id);
  ADB.set(ADB.KEYS.PROJECTS, projects);
  renderProjectsTable();
  showAdminToast('Project deleted.', 'info');
}

/* ══════════════════════════════════════════════════
   USERS MANAGER
══════════════════════════════════════════════════ */
function renderUsersTable() {
  const users = ADB.get(ADB.KEYS.USERS) || [];
  const el    = document.getElementById('users-table-body');
  const badge = document.getElementById('users-count-badge');
  if (badge) badge.textContent = `${users.length} user${users.length !== 1 ? 's':''}`;
  if (!el) return;

  if (!users.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-text">No registered users yet.</div></div>`;
    return;
  }

  el.innerHTML = `
    <table>
      <thead><tr><th>Name</th><th>Mobile</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
      <tbody>
        ${users.map(u => `
          <tr>
            <td class="td-title">${esc(u.name)}</td>
            <td>${esc(u.mobile)}</td>
            <td><span class="badge ${u.blocked ? 'badge-red':'badge-green'}">${u.blocked ? 'Blocked':'Active'}</span></td>
            <td>${formatDate(u.joinDate)}</td>
            <td class="td-actions">
              <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="openResetPwModal('${esc(u.id)}')">🔑 Reset PW</button>
              <button class="admin-btn admin-btn-warning admin-btn-sm" onclick="toggleBlockUser('${esc(u.id)}')">${u.blocked ? '✅ Unblock' : '🚫 Block'}</button>
              <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteUser('${esc(u.id)}')">🗑️</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function toggleBlockUser(id) {
  const users = ADB.get(ADB.KEYS.USERS) || [];
  const idx   = users.findIndex(u => u.id === id);
  if (idx === -1) return;
  users[idx].blocked = !users[idx].blocked;
  ADB.set(ADB.KEYS.USERS, users);
  renderUsersTable();
  showAdminToast(`User ${users[idx].blocked ? 'blocked' : 'unblocked'}.`, 'info');
}

function deleteUser(id) {
  if (!confirm('Delete this user account permanently?')) return;
  let users = ADB.get(ADB.KEYS.USERS) || [];
  users = users.filter(u => u.id !== id);
  ADB.set(ADB.KEYS.USERS, users);
  renderUsersTable();
  showAdminToast('User deleted.', 'info');
}

function openResetPwModal(userId) {
  setVal('reset-user-id', userId);
  setVal('reset-new-password', '');
  document.getElementById('reset-pw-modal')?.classList.add('open');
}

function confirmResetPassword() {
  const userId  = getVal('reset-user-id');
  const newPass = getVal('reset-new-password').trim();
  if (!newPass || newPass.length < 6) {
    showAdminToast('Password must be at least 6 characters.', 'error');
    return;
  }
  const users = ADB.get(ADB.KEYS.USERS) || [];
  const idx   = users.findIndex(u => u.id === userId);
  if (idx === -1) { showAdminToast('User not found.', 'error'); return; }
  users[idx].password = newPass;
  ADB.set(ADB.KEYS.USERS, users);
  closeAdminModal('reset-pw-modal');
  showAdminToast('Password reset successfully.', 'success');
}

/* ══════════════════════════════════════════════════
   LEADS MANAGER
══════════════════════════════════════════════════ */
function renderLeadsTable() {
  const leads = ADB.get(ADB.KEYS.LEADS) || [];
  const el    = document.getElementById('leads-table-body');
  const badge = document.getElementById('leads-count-badge');
  if (badge) badge.textContent = `${leads.length} lead${leads.length !== 1 ? 's':''}`;
  if (!el) return;

  if (!leads.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-text">No leads collected yet. They appear here after chatbot interactions.</div></div>`;
    return;
  }

  el.innerHTML = `
    <table>
      <thead><tr><th>Name</th><th>Phone</th><th>Message</th><th>Source</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${leads.map(l => `
          <tr>
            <td class="td-title">${esc(l.name)}</td>
            <td>${esc(l.phone)}</td>
            <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(l.message)}">${esc(l.message || '—')}</td>
            <td><span class="badge badge-cyan">${esc(l.source || 'chatbot')}</span></td>
            <td>${formatDate(l.date)}</td>
            <td><span class="badge ${l.contacted ? 'badge-green':'badge-amber'}">${l.contacted ? 'Contacted' : 'Pending'}</span></td>
            <td class="td-actions">
              <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="toggleLeadContacted('${esc(l.id)}')">${l.contacted ? '↩️ Reopen':'✅ Mark Done'}</button>
              <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteLead('${esc(l.id)}')">🗑️</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function toggleLeadContacted(id) {
  const leads = ADB.get(ADB.KEYS.LEADS) || [];
  const idx   = leads.findIndex(l => l.id === id);
  if (idx === -1) return;
  leads[idx].contacted = !leads[idx].contacted;
  ADB.set(ADB.KEYS.LEADS, leads);
  renderLeadsTable();
  renderOverview();
}

function deleteLead(id) {
  if (!confirm('Delete this lead?')) return;
  let leads = ADB.get(ADB.KEYS.LEADS) || [];
  leads = leads.filter(l => l.id !== id);
  ADB.set(ADB.KEYS.LEADS, leads);
  renderLeadsTable();
  renderOverview();
  showAdminToast('Lead deleted.', 'info');
}

function exportLeads() {
  const leads = ADB.get(ADB.KEYS.LEADS) || [];
  if (!leads.length) { showAdminToast('No leads to export.', 'info'); return; }

  const headers = ['Name','Phone','Message','Source','Date','Contacted'];
  const rows    = leads.map(l => [
    `"${(l.name||'').replace(/"/g,'""')}"`,
    `"${(l.phone||'').replace(/"/g,'""')}"`,
    `"${(l.message||'').replace(/"/g,'""')}"`,
    `"${(l.source||'chatbot').replace(/"/g,'""')}"`,
    `"${formatDate(l.date)}"`,
    l.contacted ? 'Yes' : 'No'
  ]);

  const csv  = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'leads.csv' });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showAdminToast('Leads exported!', 'success');
}

/* ══════════════════════════════════════════════════
   KNOWLEDGE BASE CRUD
══════════════════════════════════════════════════ */
function renderKnowledgeTable() {
  const knowledge = ADB.get(ADB.KEYS.KNOWLEDGE) || [];
  const el = document.getElementById('knowledge-table-body');
  if (!el) return;

  if (!knowledge.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🧠</div><div class="empty-state-text">No knowledge entries. Add some!</div></div>`;
    return;
  }

  el.innerHTML = `
    <table>
      <thead><tr><th>#</th><th>Keywords</th><th>Response</th><th>Actions</th></tr></thead>
      <tbody>
        ${knowledge.map((k, i) => `
          <tr>
            <td style="color:var(--text-muted)">${i+1}</td>
            <td style="max-width:220px;">
              ${(k.keywords||[]).slice(0,4).map(kw => `<span class="badge badge-muted">${esc(kw)}</span> `).join('')}
              ${(k.keywords||[]).length > 4 ? `<span class="badge badge-muted">+${(k.keywords||[]).length-4}</span>` : ''}
            </td>
            <td class="td-title" style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(k.response)}">${esc(k.response)}</td>
            <td class="td-actions">
              <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="editKbEntry('${esc(k.id)}')">✏️ Edit</button>
              <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteKbEntry('${esc(k.id)}')">🗑️</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function openKbModal(id = null) {
  const modal = document.getElementById('kb-modal');
  const title = document.getElementById('kb-modal-title');
  if (!modal) return;

  if (id) {
    const entry = (ADB.get(ADB.KEYS.KNOWLEDGE) || []).find(k => k.id === id);
    if (!entry) return;
    setVal('kb-edit-id', id);
    setVal('kb-keywords', (entry.keywords || []).join(', '));
    setVal('kb-response', entry.response || '');
    if (title) title.textContent = 'Edit Knowledge Entry';
  } else {
    setVal('kb-edit-id', '');
    setVal('kb-keywords', '');
    setVal('kb-response', '');
    if (title) title.textContent = 'Add Knowledge Entry';
  }
  modal.classList.add('open');
}

function editKbEntry(id) { openKbModal(id); }

function saveKbEntry() {
  const id       = getVal('kb-edit-id');
  const kwString = getVal('kb-keywords').trim();
  const response = getVal('kb-response').trim();

  if (!kwString || !response) {
    showAdminToast('Keywords and response are required.', 'error');
    return;
  }

  const entry = {
    id:       id || ('kb-' + Date.now()),
    keywords: kwString.split(',').map(k => k.trim()).filter(Boolean),
    response
  };

  const knowledge = ADB.get(ADB.KEYS.KNOWLEDGE) || [];
  if (id) {
    const idx = knowledge.findIndex(k => k.id === id);
    if (idx !== -1) knowledge[idx] = entry;
    else knowledge.push(entry);
  } else {
    knowledge.push(entry);
  }

  ADB.set(ADB.KEYS.KNOWLEDGE, knowledge);
  closeAdminModal('kb-modal');
  renderKnowledgeTable();
  showAdminToast(`Knowledge entry ${id ? 'updated' : 'added'}!`, 'success');
}

function deleteKbEntry(id) {
  if (!confirm('Delete this knowledge entry?')) return;
  let knowledge = ADB.get(ADB.KEYS.KNOWLEDGE) || [];
  knowledge = knowledge.filter(k => k.id !== id);
  ADB.set(ADB.KEYS.KNOWLEDGE, knowledge);
  renderKnowledgeTable();
  showAdminToast('Entry deleted.', 'info');
}

/* ══════════════════════════════════════════════════
   NAVIGATION MANAGER
══════════════════════════════════════════════════ */
function renderNavigationList() {
  const navItems = (ADB.get(ADB.KEYS.NAVIGATION) || []).sort((a, b) => a.order - b.order);
  const list = document.getElementById('navigation-list');
  if (!list) return;

  if (!navItems.length) {
    list.innerHTML = `<div class="empty-state"><div>No navigation items.</div></div>`;
    return;
  }

  list.innerHTML = navItems.map(n => `
    <div class="nav-item-row">
      <span class="nav-drag-handle">⠿</span>
      <span class="nav-item-label">${esc(n.label)}</span>
      <span class="nav-item-target">${esc(n.target)}</span>
      <span class="badge ${n.visible ? 'badge-green':'badge-muted'}">${n.visible ? 'Visible':'Hidden'}</span>
      <div style="display:flex;gap:6px;">
        <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="editNavItem('${esc(n.id)}')">✏️</button>
        <button class="admin-btn admin-btn-warning admin-btn-sm" onclick="toggleNavVisible('${esc(n.id)}')">${n.visible ? '👁️':'🙈'}</button>
        <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteNavItem('${esc(n.id)}')">🗑️</button>
      </div>
    </div>
  `).join('');
}

function openNavModal(id = null) {
  const modal = document.getElementById('nav-modal');
  const title = document.getElementById('nav-modal-title');
  if (!modal) return;

  if (id) {
    const item = (ADB.get(ADB.KEYS.NAVIGATION) || []).find(n => n.id === id);
    if (!item) return;
    setVal('nav-edit-id', id);
    setVal('nm-label', item.label);
    setVal('nm-target', item.target);
    setVal('nm-order', item.order);
    setVal('nm-visible', String(item.visible));
    if (title) title.textContent = 'Edit Navigation Tab';
  } else {
    setVal('nav-edit-id', '');
    setVal('nm-label', '');
    setVal('nm-target', '');
    const nav = ADB.get(ADB.KEYS.NAVIGATION) || [];
    setVal('nm-order', nav.length + 1);
    setVal('nm-visible', 'true');
    if (title) title.textContent = 'Add Navigation Tab';
  }
  modal.classList.add('open');
}

function editNavItem(id) { openNavModal(id); }

function saveNavItem() {
  const id     = getVal('nav-edit-id');
  const label  = getVal('nm-label').trim();
  const target = getVal('nm-target').trim();
  const order  = parseInt(getVal('nm-order')) || 10;
  const visible = getVal('nm-visible') === 'true';

  if (!label || !target) {
    showAdminToast('Label and target are required.', 'error');
    return;
  }

  const item = { id: id || ('nav-' + Date.now()), label, target, order, visible };
  const nav  = ADB.get(ADB.KEYS.NAVIGATION) || [];

  if (id) {
    const idx = nav.findIndex(n => n.id === id);
    if (idx !== -1) nav[idx] = item;
    else nav.push(item);
  } else {
    nav.push(item);
  }

  ADB.set(ADB.KEYS.NAVIGATION, nav);
  closeAdminModal('nav-modal');
  renderNavigationList();
  showAdminToast(`Navigation ${id ? 'updated' : 'added'}!`, 'success');
}

function toggleNavVisible(id) {
  const nav = ADB.get(ADB.KEYS.NAVIGATION) || [];
  const idx = nav.findIndex(n => n.id === id);
  if (idx === -1) return;
  nav[idx].visible = !nav[idx].visible;
  ADB.set(ADB.KEYS.NAVIGATION, nav);
  renderNavigationList();
}

function deleteNavItem(id) {
  if (!confirm('Remove this navigation item?')) return;
  let nav = ADB.get(ADB.KEYS.NAVIGATION) || [];
  nav = nav.filter(n => n.id !== id);
  ADB.set(ADB.KEYS.NAVIGATION, nav);
  renderNavigationList();
  showAdminToast('Navigation item removed.', 'info');
}

/* ══════════════════════════════════════════════════
   CONTENT EDITOR
══════════════════════════════════════════════════ */
function loadContentEditor() {
  const content = ADB.get(ADB.KEYS.CONTENT);
  if (!content) return;

  if (content.hero) {
    setVal('ce-hero-title', content.hero.title || '');
    setVal('ce-hero-subtitle', content.hero.subtitle || '');
    setVal('ce-hero-desc', content.hero.description || '');
  }
  if (content.about) {
    setVal('ce-about-intro', content.about.intro || '');
    setVal('ce-about-body', content.about.body || '');
    setVal('ce-about-skills', (content.about.skills || []).join(', '));
  }
  if (content.contact) {
    setVal('ce-contact-email',    content.contact.email || '');
    setVal('ce-contact-phone',    content.contact.phone || '');
    setVal('ce-contact-location', content.contact.location || '');
    setVal('ce-contact-github',   content.contact.github || '');
    setVal('ce-contact-linkedin', content.contact.linkedin || '');
  }

  const admin = ADB.get(ADB.KEYS.ADMIN) || {};
  setVal('ce-admin-mobile', admin.mobile || '');
}

function saveHeroContent() {
  const content = ADB.get(ADB.KEYS.CONTENT) || {};
  content.hero  = {
    title:       getVal('ce-hero-title'),
    subtitle:    getVal('ce-hero-subtitle'),
    description: getVal('ce-hero-desc')
  };
  ADB.set(ADB.KEYS.CONTENT, content);
  showAdminToast('Hero content saved!', 'success');
}

function saveAboutContent() {
  const content   = ADB.get(ADB.KEYS.CONTENT) || {};
  content.about   = content.about || {};
  content.about.intro  = getVal('ce-about-intro');
  content.about.body   = getVal('ce-about-body');
  content.about.skills = getVal('ce-about-skills').split(',').map(s => s.trim()).filter(Boolean);
  ADB.set(ADB.KEYS.CONTENT, content);
  showAdminToast('About content saved!', 'success');
}

function saveContactContent() {
  const content     = ADB.get(ADB.KEYS.CONTENT) || {};
  content.contact   = {
    email:    getVal('ce-contact-email'),
    phone:    getVal('ce-contact-phone'),
    location: getVal('ce-contact-location'),
    github:   getVal('ce-contact-github'),
    linkedin: getVal('ce-contact-linkedin')
  };
  ADB.set(ADB.KEYS.CONTENT, content);
  showAdminToast('Contact details saved!', 'success');
}

function saveAdminCredentials() {
  const mobile  = getVal('ce-admin-mobile').trim();
  const newPass = getVal('ce-admin-newpass').trim();
  const curPass = getVal('ce-admin-curpass').trim();

  const admin = ADB.get(ADB.KEYS.ADMIN) || {};

  if (curPass !== admin.password) {
    showAdminToast('Current password is incorrect.', 'error');
    return;
  }
  if (!mobile) {
    showAdminToast('Mobile number is required.', 'error');
    return;
  }

  admin.mobile = mobile;
  if (newPass) {
    if (newPass.length < 6) { showAdminToast('New password must be at least 6 characters.', 'error'); return; }
    admin.password = newPass;
  }

  ADB.set(ADB.KEYS.ADMIN, admin);
  setVal('ce-admin-newpass', '');
  setVal('ce-admin-curpass', '');
  showAdminToast('Admin credentials updated!', 'success');
}

/* ══════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════ */
function loadSettings() {
  const settings = ADB.get(ADB.KEYS.SETTINGS) || {};
  const url = settings.sheets_webhook_url || '';
  setVal('settings-sheets-url', url);

  // Status indicator update
  setTimeout(() => {
    const statusEl = document.getElementById('sheets-status');
    if (statusEl) {
      statusEl.innerHTML = url
        ? '<span style="color:var(--green)">🟢 Connected</span>'
        : '<span style="color:var(--amber)">🟡 Not Connected</span>';
    }
  }, 100);
}

function saveSettings() {
  const settings = ADB.get(ADB.KEYS.SETTINGS) || {};
  const url = getVal('settings-sheets-url').trim();
  settings.sheets_webhook_url = url;
  ADB.set(ADB.KEYS.SETTINGS, settings);
  if (url) {
    showAdminToast('Google Sheets URL save ho gayi! Users data ab permanently save hoga.', 'success');
    const s = document.getElementById('sheets-status');
    if (s) s.innerHTML = '<span style="color:var(--green)">🟢 Connected</span>';
  } else {
    showAdminToast('Sheets URL hata di. Users sirf locally save honge.', 'info');
    const s = document.getElementById('sheets-status');
    if (s) s.innerHTML = '<span style="color:var(--amber)">🟡 Not Connected</span>';
  }
}

async function testSheetsConnection() {
  const url = getVal('settings-sheets-url').trim();
  if (!url) { showAdminToast('Pehle URL daalo.', 'error'); return; }
  const btn = document.getElementById('test-sheets-btn');
  if (btn) { btn.textContent = 'Testing...'; btn.disabled = true; }
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'lead', id: 'test', name: 'Test', phone: '0000000000', message: 'Connection test', source: 'admin-test' }),
      signal: AbortSignal.timeout(8000)
    });
    showAdminToast('Google Sheets connection successful!', 'success');
  } catch(err) {
    showAdminToast('Connection failed: ' + err.message, 'error');
  } finally {
    if (btn) { btn.textContent = 'Test Connection'; btn.disabled = false; }
  }
}

function exportAllData() {
  const data = {
    projects:   ADB.get(ADB.KEYS.PROJECTS),
    knowledge:  ADB.get(ADB.KEYS.KNOWLEDGE),
    users:      ADB.get(ADB.KEYS.USERS),
    leads:      ADB.get(ADB.KEYS.LEADS),
    navigation: ADB.get(ADB.KEYS.NAVIGATION),
    content:    ADB.get(ADB.KEYS.CONTENT),
    exportDate: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'mahesh-platform-backup.json' });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showAdminToast('Data exported!', 'success');
}

function resetToDefaults() {
  if (!confirm('⚠️ This will delete ALL custom data and reset to defaults. Are you sure?')) return;
  if (!confirm('FINAL WARNING: This cannot be undone. Reset now?')) return;

  Object.values(ADB.KEYS).forEach(key => localStorage.removeItem(key));
  sessionStorage.removeItem('mm_admin_session');
  showAdminToast('Data reset. Refreshing...', 'info');
  setTimeout(() => window.location.reload(), 1200);
}

function clearLeads() {
  if (!confirm('Delete all leads? This cannot be undone.')) return;
  ADB.set(ADB.KEYS.LEADS, []);
  renderLeadsTable();
  renderOverview();
  showAdminToast('All leads cleared.', 'info');
}

/* ══════════════════════════════════════════════════
   MODAL HELPERS
══════════════════════════════════════════════════ */
function closeAdminModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// Close on overlay click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
});

/* ══════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════ */
function showAdminToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span> ${esc(message)}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* ══════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════ */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  } catch { return iso; }
}
