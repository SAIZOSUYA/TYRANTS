/* ==========================================================================
   FILMCRAFT STUDIO COMMAND CENTER - JAVASCRIPT LOGIC & STATE
   ========================================================================== */

// Initial Mock State
const DEFAULT_STATE = {
  clients: [
    { id: 'cli_1', name: 'Sarah Connor', company: 'Cyberdyne Media', email: 'sarah@cyberdyne.com', phone: '+1 555-0192', projects: 3, status: 'Active' },
    { id: 'cli_2', name: 'Marcus Wright', company: 'Resistance Films', email: 'marcus@resistance.org', phone: '+1 555-4821', projects: 2, status: 'Active' },
    { id: 'cli_3', name: 'Elena Rostova', company: 'Vanguard Creative', email: 'elena@vanguard.com', phone: '+1 555-7722', projects: 1, status: 'Active' }
  ],
  crew: [
    { id: 'crw_1', name: 'David Fincher', role: 'Director', email: 'fincher@filmcraft.com', rate: 1200, status: 'Available' },
    { id: 'crw_2', name: 'Roger Deakins', role: 'Director of Photography', email: 'deakins@filmcraft.com', rate: 1500, status: 'Available' },
    { id: 'crw_3', name: 'Hans Zimmer', role: 'Sound Engineer', email: 'hans@filmcraft.com', rate: 1100, status: 'On Shoot' },
    { id: 'crw_4', name: 'Rachel Morrison', role: 'Gaffer / Lighting', email: 'rachel@filmcraft.com', rate: 850, status: 'Available' }
  ],
  projects: [
    { id: 'prj_1', title: 'Cyberdyne Campaign', client: 'Cyberdyne Media', category: 'Commercial', date: '2026-08-10', status: 'Active' },
    { id: 'prj_2', title: 'Resistance Docu-Series', client: 'Resistance Films', category: 'Feature Film', date: '2026-08-14', status: 'Active' },
    { id: 'prj_3', title: 'Vanguard Music Launch', client: 'Vanguard Creative', category: 'Music Video', date: '2026-08-18', status: 'Pending' }
  ],
  revenue: 42500,
  upcomingShoots: 8
};

// Application State
let appState = loadState();

function loadState() {
  const saved = localStorage.getItem('filmcraft_studio_state');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { console.error('Failed to parse state', e); }
  }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function saveState() {
  localStorage.setItem('filmcraft_studio_state', JSON.stringify(appState));
  updateStats();
  renderDashboardProjects();
  renderClientsTable();
  renderCrewTable();
}

// Initialize App on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  renderDashboardProjects();
  renderClientsTable();
  renderCrewTable();
  
  // Render Canvas Charts
  setTimeout(() => {
    renderProjectVolumeChart();
    renderProjectDistributionChart();
  }, 100);
});

// Navigation Tab Switching
function switchTab(viewId) {
  document.querySelectorAll('.view-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  const targetView = document.getElementById(viewId);
  if (targetView) targetView.classList.add('active');

  const navKey = viewId.replace('view-', 'nav-');
  const targetNav = document.getElementById(navKey);
  if (targetNav) targetNav.classList.add('active');

  if (viewId === 'view-dashboard') {
    setTimeout(() => {
      renderProjectVolumeChart();
      renderProjectDistributionChart();
    }, 50);
  }
}

// Update KPI Metrics in Dashboard Header
function updateStats() {
  const totalClientsEl = document.getElementById('stat-total-clients');
  const activeProjectsEl = document.getElementById('stat-active-projects');
  const upcomingShootsEl = document.getElementById('stat-upcoming-shoots');

  if (totalClientsEl) totalClientsEl.textContent = appState.clients.length;
  if (activeProjectsEl) activeProjectsEl.textContent = appState.projects.filter(p => p.status === 'Active').length;
  if (upcomingShootsEl) upcomingShootsEl.textContent = appState.upcomingShoots;
}

// Render Dashboard Production Shoots Table
function renderDashboardProjects() {
  const tbody = document.getElementById('table-dashboard-projects');
  if (!tbody) return;

  if (appState.projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No production shoots scheduled. Click "Add New Project" to get started.</td></tr>`;
    return;
  }

  tbody.innerHTML = appState.projects.map(p => `
    <tr>
      <td><strong>${escapeHtml(p.title)}</strong></td>
      <td>${escapeHtml(p.client)}</td>
      <td><span class="status-tag" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">${escapeHtml(p.category)}</span></td>
      <td>${escapeHtml(p.date)}</td>
      <td><span class="status-tag ${p.status.toLowerCase()}">${escapeHtml(p.status)}</span></td>
      <td>
        <button class="icon-btn" style="width:30px; height:30px; font-size:14px;" onclick="deleteProject('${p.id}')" title="Delete Project">
          <iconify-icon icon="tabler:trash" style="color: var(--brand-red);"></iconify-icon>
        </button>
      </td>
    </tr>
  `).join('');
}

// Render Clients Directory Table
function renderClientsTable() {
  const tbody = document.getElementById('table-clients');
  if (!tbody) return;

  if (appState.clients.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No clients added yet. Click "Add Client" to register your first client.</td></tr>`;
    return;
  }

  tbody.innerHTML = appState.clients.map(c => `
    <tr>
      <td><strong>${escapeHtml(c.name)}</strong></td>
      <td>${escapeHtml(c.company)}</td>
      <td>${escapeHtml(c.email)}</td>
      <td>${escapeHtml(c.phone)}</td>
      <td>${c.projects} active</td>
      <td><span class="status-tag active">${c.status}</span></td>
      <td>
        <button class="icon-btn" style="width:30px; height:30px; font-size:14px;" onclick="deleteClient('${c.id}')" title="Delete Client">
          <iconify-icon icon="tabler:trash" style="color: var(--brand-red);"></iconify-icon>
        </button>
      </td>
    </tr>
  `).join('');
}

// Render Crew & Talent Table
function renderCrewTable() {
  const tbody = document.getElementById('table-crew');
  if (!tbody) return;

  if (appState.crew.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No crew members in roster. Click "Add Crew Member" to expand your crew.</td></tr>`;
    return;
  }

  tbody.innerHTML = appState.crew.map(c => `
    <tr>
      <td><strong>${escapeHtml(c.name)}</strong></td>
      <td><span class="status-tag" style="background: rgba(245, 158, 11, 0.1); color: var(--brand-amber);">${escapeHtml(c.role)}</span></td>
      <td>${escapeHtml(c.email)}</td>
      <td><strong>$${c.rate}</strong>/day</td>
      <td><span class="status-tag ${c.status === 'Available' ? 'active' : 'pending'}">${c.status}</span></td>
      <td>
        <button class="icon-btn" style="width:30px; height:30px; font-size:14px;" onclick="deleteCrew('${c.id}')" title="Remove Crew Member">
          <iconify-icon icon="tabler:trash" style="color: var(--brand-red);"></iconify-icon>
        </button>
      </td>
    </tr>
  `).join('');
}

/* ==========================================================================
   HTML5 CANVAS CHART RENDERERS (MATCHING REFERENCE SCREENSHOT)
   ========================================================================== */

// 1. Project Volume Bar Chart (Monthly Shoots Overview)
function renderProjectVolumeChart() {
  const canvas = document.getElementById('project-volume-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);

  // Y-axis gridlines & labels (0, 9, 18, 27, 36 matching screenshot)
  const yLabels = [0, 9, 18, 27, 36];
  const chartBottom = height - 30;
  const chartTop = 20;
  const chartHeight = chartBottom - chartTop;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#64748b';
  ctx.font = '11px Plus Jakarta Sans';

  yLabels.forEach(val => {
    const y = chartBottom - (val / 36) * chartHeight;
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(35, y);
    ctx.lineTo(width, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText(val.toString(), 10, y + 4);
  });

  // Monthly Bar Heights (matching screenshot profile: low early, rising to 18, 27, 36 at end)
  const data = [4, 6, 8, 12, 10, 14, 11, 16, 18, 27, 36, 32];
  const barWidth = (width - 50) / data.length - 12;

  data.forEach((val, i) => {
    const x = 50 + i * (barWidth + 12);
    const barH = (val / 36) * chartHeight;
    const y = chartBottom - barH;

    // Draw Bar with Amber Fill
    ctx.fillStyle = i >= 8 ? '#f59e0b' : 'rgba(245, 158, 11, 0.6)';
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();
  });
}

// 2. Project Distribution Donut Chart
function renderProjectDistributionChart() {
  const canvas = document.getElementById('project-distribution-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const centerX = width / 2;
  const centerY = height / 2 - 10;
  const outerRadius = 85;
  const innerRadius = 55;

  ctx.clearRect(0, 0, width, height);

  const segments = [
    { label: 'Commercial', value: 45, color: '#f59e0b' },
    { label: 'Feature Film', value: 25, color: '#3b82f6' },
    { label: 'Music Video', value: 18, color: '#8b5cf6' },
    { label: 'Corporate', value: 12, color: '#1e2637' }
  ];

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let startAngle = -Math.PI / 2;

  segments.forEach(seg => {
    const sliceAngle = (seg.value / total) * (Math.PI * 2);
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();

    ctx.fillStyle = seg.color;
    ctx.fill();

    startAngle = endAngle;
  });

  // Legend at bottom
  const legendY = height - 20;
  let legendX = 20;

  ctx.font = '11px Plus Jakarta Sans';
  segments.slice(0, 3).forEach(seg => {
    ctx.fillStyle = seg.color;
    ctx.beginPath();
    ctx.arc(legendX, legendY - 3, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.fillText(seg.label, legendX + 10, legendY);
    legendX += 105;
  });
}

/* ==========================================================================
   MODAL DIALOG CONTROLS & FORMS
   ========================================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Add Client Handler
function handleAddClient(e) {
  e.preventDefault();
  const name = document.getElementById('input-client-name').value;
  const company = document.getElementById('input-client-company').value;
  const email = document.getElementById('input-client-email').value;
  const phone = document.getElementById('input-client-phone').value || '+1 555-0000';

  appState.clients.push({
    id: 'cli_' + Date.now(),
    name,
    company,
    email,
    phone,
    projects: 1,
    status: 'Active'
  });

  saveState();
  closeModal('modal-add-client');
  e.target.reset();
}

// Add Crew Handler
function handleAddCrew(e) {
  e.preventDefault();
  const name = document.getElementById('input-crew-name').value;
  const role = document.getElementById('input-crew-role').value;
  const email = document.getElementById('input-crew-email').value;
  const rate = parseInt(document.getElementById('input-crew-rate').value) || 500;

  appState.crew.push({
    id: 'crw_' + Date.now(),
    name,
    role,
    email,
    rate,
    status: 'Available'
  });

  saveState();
  closeModal('modal-add-crew');
  e.target.reset();
}

// Add Project Handler
function handleAddProject(e) {
  e.preventDefault();
  const title = document.getElementById('input-project-title').value;
  const client = document.getElementById('input-project-client').value;
  const category = document.getElementById('input-project-category').value;
  const date = document.getElementById('input-project-date').value || new Date().toISOString().split('T')[0];

  appState.projects.push({
    id: 'prj_' + Date.now(),
    title,
    client,
    category,
    date,
    status: 'Active'
  });

  saveState();
  closeModal('modal-add-project');
  e.target.reset();
}

// Broadcast Email / WhatsApp Handler
function handleSendBroadcast(e, type) {
  e.preventDefault();
  alert(`${type.toUpperCase()} broadcast successfully dispatched to all active clients and crew members!`);
  closeModal(type === 'email' ? 'modal-email-all' : 'modal-whatsapp-all');
  e.target.reset();
}

// Clear All Data Handler
function confirmClearAllData() {
  appState = {
    clients: [],
    crew: [],
    projects: [],
    revenue: 0,
    upcomingShoots: 0
  };
  saveState();
  closeModal('modal-clear-data');
}

// Delete Client
function deleteClient(id) {
  appState.clients = appState.clients.filter(c => c.id !== id);
  saveState();
}

// Delete Crew
function deleteCrew(id) {
  appState.crew = appState.crew.filter(c => c.id !== id);
  saveState();
}

// Delete Project
function deleteProject(id) {
  appState.projects = appState.projects.filter(p => p.id !== id);
  saveState();
}

// Global Search
function handleGlobalSearch(e) {
  const query = e.target.value.toLowerCase();
  if (!query) {
    renderDashboardProjects();
    renderClientsTable();
    renderCrewTable();
    return;
  }
}

// Save Settings
function saveSettings() {
  alert('Studio settings updated successfully!');
}

// Helper: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
