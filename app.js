/* ==========================================================================
   PRAGATI STUDIO COMMAND CENTER - JAVASCRIPT LOGIC & STATE
   ========================================================================== */

// Initial Clean State
const DEFAULT_STATE = {
  clients: [],
  crew: [],
  projects: [],
  revenue: 0,
  upcomingShoots: 0
};

// Application State
let appState = loadState();

function loadState() {
  const saved = localStorage.getItem('pragati_studio_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (e) { console.error('Failed to parse state', e); }
  }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function saveState() {
  localStorage.setItem('pragati_studio_state', JSON.stringify(appState));
  updateStats();
  renderDashboardProjects();
  renderClientsTable();
  renderCrewTable();
  renderCharts();
}

// Initialize App on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  renderDashboardProjects();
  renderClientsTable();
  renderCrewTable();
  
  // Render Canvas Charts with resize listener
  renderCharts();
  window.addEventListener('resize', renderCharts);
});

function renderCharts() {
  setTimeout(() => {
    renderProjectVolumeChart();
    renderProjectDistributionChart();
  }, 50);
}

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
    renderCharts();
  }
}

// Update KPI Metrics in Dashboard Header
function updateStats() {
  const totalClientsEl = document.getElementById('stat-total-clients');
  const activeProjectsEl = document.getElementById('stat-active-projects');
  const upcomingShootsEl = document.getElementById('stat-upcoming-shoots');

  if (totalClientsEl) totalClientsEl.textContent = appState.clients.length;
  if (activeProjectsEl) activeProjectsEl.textContent = appState.projects.filter(p => p.status === 'Active').length;
  if (upcomingShootsEl) upcomingShootsEl.textContent = appState.projects.length;
}

// Render Dashboard & Projects Directory Tables
function renderDashboardProjects() {
  const tbodyDashboard = document.getElementById('table-dashboard-projects');
  const tbodyAll = document.getElementById('table-all-projects');

  const htmlContent = appState.projects.length === 0
    ? `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No production shoots scheduled. Click "Add Project" to get started.</td></tr>`
    : appState.projects.map(p => {
        const crewPills = (p.crew && p.crew.length > 0)
          ? p.crew.map(cr => `<span class="crew-tag-pill">${escapeHtml(cr)}</span>`).join('')
          : `<span style="font-size: 12px; color: var(--text-muted);">Unassigned</span>`;

        return `
          <tr>
            <td><strong>${escapeHtml(p.title)}</strong></td>
            <td>${escapeHtml(p.client)}</td>
            <td><span class="status-tag" style="background: var(--brand-cyan-light); color: var(--brand-cyan);">${escapeHtml(p.category)}</span></td>
            <td>${crewPills}</td>
            <td>${escapeHtml(p.date)}</td>
            <td><span class="status-tag ${p.status.toLowerCase()}">${escapeHtml(p.status)}</span></td>
            <td>
              <button class="icon-btn" style="width:30px; height:30px; font-size:14px;" onclick="deleteProject('${p.id}')" title="Delete Project">
                <iconify-icon icon="tabler:trash" style="color: var(--brand-red);"></iconify-icon>
              </button>
            </td>
          </tr>
        `;
      }).join('');

  if (tbodyDashboard) tbodyDashboard.innerHTML = htmlContent;
  if (tbodyAll) tbodyAll.innerHTML = htmlContent;
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
      <td><span class="status-tag" style="background: var(--brand-lime-light); color: var(--brand-lime);">${escapeHtml(c.role)}</span></td>
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
   DYNAMIC CANVAS CHART RENDERERS (POWERED BY LIVE USER DATA)
   ========================================================================== */

// 1. Dynamic Project Volume Bar Chart (Aggregated purely from user projects)
function renderProjectVolumeChart() {
  const canvas = document.getElementById('project-volume-chart');
  if (!canvas || !canvas.parentElement) return;

  const container = canvas.parentElement;
  const width = container.clientWidth || 500;
  const height = 260;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  // Compute live monthly shoot volume from user projects
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const userMonthlyCounts = new Array(12).fill(0);

  appState.projects.forEach(p => {
    if (p.date) {
      const dateObj = new Date(p.date);
      if (!isNaN(dateObj.getTime())) {
        userMonthlyCounts[dateObj.getMonth()] += 1;
      }
    }
  });

  const data = userMonthlyCounts;
  const maxVal = Math.max(8, ...data);

  // Y-axis gridlines & labels
  const yStep = Math.ceil(maxVal / 4);
  const yLabels = [0, yStep, yStep * 2, yStep * 3, yStep * 4];
  const chartBottom = height - 38;
  const chartTop = 30;
  const chartHeight = chartBottom - chartTop;
  const paddingLeft = 38;
  const paddingRight = 16;
  const chartWidth = width - paddingLeft - paddingRight;

  ctx.strokeStyle = 'rgba(15, 23, 42, 0.06)';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#64748b';
  ctx.font = '500 11px Plus Jakarta Sans';

  yLabels.forEach(val => {
    const y = chartBottom - (val / (yStep * 4)) * chartHeight;
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText(val.toString(), 10, y + 4);
  });

  // Monthly Bar Data & Full-Width Bar Calculations
  const totalBars = data.length;
  const gap = 10;
  const barWidth = (chartWidth - (totalBars - 1) * gap) / totalBars;

  data.forEach((val, i) => {
    const x = paddingLeft + i * (barWidth + gap);
    const barH = val > 0 ? (val / (yStep * 4)) * chartHeight : 4; // minimum 4px height for empty months
    const y = chartBottom - barH;

    // Gradient matching PRA-गति Cyan-Lime palette
    const barGradient = ctx.createLinearGradient(x, y + barH, x, y);
    if (val > 0) {
      barGradient.addColorStop(0, '#0284c7');
      barGradient.addColorStop(1, '#65a30d');
    } else {
      barGradient.addColorStop(0, 'rgba(226, 232, 240, 0.6)');
      barGradient.addColorStop(1, 'rgba(203, 213, 225, 0.6)');
    }

    ctx.save();
    if (val > 0) {
      ctx.shadowColor = 'rgba(101, 163, 13, 0.25)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
    }

    ctx.fillStyle = barGradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();
    ctx.restore();

    // Value Badge above bars
    if (val > 0) {
      ctx.fillStyle = '#0f2744';
      ctx.font = '700 10px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(val.toString(), x + barWidth / 2, y - 6);
    }

    // Month Label
    ctx.fillStyle = val > 0 ? '#0f2744' : '#94a3b8';
    ctx.font = val > 0 ? '700 11px Plus Jakarta Sans' : '500 11px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText(months[i], x + barWidth / 2, chartBottom + 18);
  });
}

// 2. Dynamic Project Distribution Donut Chart (Driven by Live User Categories)
function renderProjectDistributionChart() {
  const canvas = document.getElementById('project-distribution-chart');
  if (!canvas || !canvas.parentElement) return;

  const container = canvas.parentElement;
  const width = container.clientWidth || 350;
  const height = 260;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  // Compute live category breakdown from appState.projects
  const categoryCounts = {
    'Commercial': 0,
    'Feature Film': 0,
    'Music Video': 0,
    'Corporate': 0
  };

  appState.projects.forEach(p => {
    const cat = p.category || 'Commercial';
    if (categoryCounts[cat] !== undefined) {
      categoryCounts[cat]++;
    } else {
      categoryCounts[cat] = 1;
    }
  });

  const totalUserProjects = appState.projects.length;

  const segments = [
    { label: 'Commercial', value: categoryCounts['Commercial'], color: '#0284c7' },
    { label: 'Feature Film', value: categoryCounts['Feature Film'], color: '#65a30d' },
    { label: 'Music Video', value: categoryCounts['Music Video'], color: '#0f2744' },
    { label: 'Corporate', value: categoryCounts['Corporate'], color: '#14b8a6' }
  ];

  const centerX = width / 2;
  const centerY = (height - 35) / 2;
  const outerRadius = Math.min(centerX, centerY) - 12;
  const innerRadius = outerRadius * 0.65;

  const totalSegmentVal = segments.reduce((sum, s) => sum + s.value, 0);

  if (totalSegmentVal === 0) {
    // Draw empty ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.arc(centerX, centerY, innerRadius, Math.PI * 2, 0, true);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
  } else {
    let startAngle = -Math.PI / 2;
    segments.forEach(seg => {
      if (seg.value === 0) return;
      const sliceAngle = (seg.value / totalSegmentVal) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      ctx.save();
      ctx.shadowColor = seg.color;
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.restore();

      startAngle = endAngle;
    });
  }

  // Center Donut Typography (Displays Live Total User Projects Count)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f2744';
  ctx.font = '800 22px Outfit';
  ctx.fillText(totalUserProjects.toString(), centerX, centerY + 2);

  ctx.fillStyle = '#64748b';
  ctx.font = '600 10px Plus Jakarta Sans';
  ctx.fillText('TOTAL PROJECTS', centerX, centerY + 16);

  // Bottom Legend
  const legendY = height - 12;
  const itemWidth = width / 4;

  ctx.font = '600 11px Plus Jakarta Sans';
  segments.forEach((seg, i) => {
    const lx = i * itemWidth + itemWidth / 2 - 20;

    ctx.fillStyle = seg.value > 0 ? seg.color : '#cbd5e1';
    ctx.beginPath();
    ctx.arc(lx, legendY - 4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = seg.value > 0 ? '#0f2744' : '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText(seg.label, lx + 8, legendY);
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

// Open Add Project Modal & Populate Multi-Select Crew Checkboxes
function openAddProjectModal() {
  const container = document.getElementById('project-crew-checkboxes');
  if (container) {
    if (appState.crew.length === 0) {
      container.innerHTML = `<span style="font-size: 12px; color: var(--text-muted);">No crew members available in roster. Add crew members first.</span>`;
    } else {
      container.innerHTML = appState.crew.map((cr, idx) => `
        <label class="crew-checkbox-item">
          <input type="checkbox" value="${escapeHtml(cr.name)}" ${idx === 0 ? 'checked' : ''}>
          <span>${escapeHtml(cr.name)} (${escapeHtml(cr.role)})</span>
        </label>
      `).join('');
    }
  }
  openModal('modal-add-project');
}

// Add Project Handler
function handleAddProject(e) {
  e.preventDefault();
  const title = document.getElementById('input-project-title').value;
  const client = document.getElementById('input-project-client').value;
  const category = document.getElementById('input-project-category').value;
  const date = document.getElementById('input-project-date').value || new Date().toISOString().split('T')[0];

  const checkedCrew = Array.from(document.querySelectorAll('#project-crew-checkboxes input:checked')).map(cb => cb.value);

  appState.projects.push({
    id: 'prj_' + Date.now(),
    title,
    client,
    category,
    date,
    crew: checkedCrew.length > 0 ? checkedCrew : ['Unassigned'],
    status: 'Active'
  });

  saveState();
  closeModal('modal-add-project');
  e.target.reset();
}

/* ==========================================================================
   INTERACTIVE WHATSAPP & EMAIL DISPATCHERS
   ========================================================================== */

// 1. WhatsApp Dispatch Handlers
function openWhatsAppModal() {
  handleWARecipientTypeChange();
  populateWAProjectSelect();
  openModal('modal-whatsapp');
}

function handleWARecipientTypeChange() {
  const category = document.getElementById('wa-recipient-category').value;
  const select = document.getElementById('wa-recipient-select');
  if (!select) return;

  if (category === 'client') {
    select.innerHTML = appState.clients.map(c => 
      `<option value="${c.id}" data-name="${escapeHtml(c.name)}" data-phone="${c.phone}">${escapeHtml(c.name)} (${escapeHtml(c.company)}) - ${c.phone}</option>`
    ).join('');
  } else {
    select.innerHTML = appState.crew.map(cr => 
      `<option value="${cr.id}" data-name="${escapeHtml(cr.name)}" data-phone="${cr.phone || '+15554821000'}">${escapeHtml(cr.name)} (${escapeHtml(cr.role)}) - ${cr.phone || '+15554821000'}</option>`
    ).join('');
  }

  updateWAMessageTemplate();
}

function populateWAProjectSelect() {
  const select = document.getElementById('wa-project-select');
  if (!select) return;
  if (appState.projects.length === 0) {
    select.innerHTML = `<option value="General Production">General Production</option>`;
  } else {
    select.innerHTML = appState.projects.map(p => 
      `<option value="${escapeHtml(p.title)}">${escapeHtml(p.title)} (${escapeHtml(p.category)})</option>`
    ).join('');
  }
}

function updateWAMessageTemplate() {
  const category = document.getElementById('wa-recipient-category').value;
  const recipientSelect = document.getElementById('wa-recipient-select');
  const projectSelect = document.getElementById('wa-project-select');
  const messageTextarea = document.getElementById('wa-message-text');

  if (!recipientSelect || !messageTextarea) return;

  const selectedOpt = recipientSelect.options[recipientSelect.selectedIndex];
  const recipientName = selectedOpt ? selectedOpt.getAttribute('data-name') : 'there';
  const projectTitle = projectSelect ? projectSelect.value : 'your project';

  if (category === 'client') {
    messageTextarea.value = `Hello ${recipientName}, here is an official project update regarding '${projectTitle}': The shoot & production deliverables are progressing smoothly according to our Pragati workflow schedule! Please let us know if you have any questions.`;
  } else {
    messageTextarea.value = `Hi ${recipientName}, please provide a quick status update regarding your assigned deliverables for project '${projectTitle}'. Let us know if you need any additional resources, equipment, or approvals!`;
  }
}

function handleSendWhatsApp(e) {
  e.preventDefault();
  const recipientSelect = document.getElementById('wa-recipient-select');
  const messageTextarea = document.getElementById('wa-message-text');
  
  if (!recipientSelect || !messageTextarea) return;

  const selectedOpt = recipientSelect.options[recipientSelect.selectedIndex];
  const rawPhone = selectedOpt ? selectedOpt.getAttribute('data-phone') : '';
  const cleanPhone = rawPhone.replace(/[^\d+]/g, '');
  const messageText = messageTextarea.value;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
  window.open(waUrl, '_blank');

  closeModal('modal-whatsapp');
}

// 2. Email Dispatch Handlers
function openEmailModal() {
  handleEmailRecipientTypeChange();
  populateEmailProjectSelect();
  openModal('modal-email');
}

function handleEmailRecipientTypeChange() {
  const category = document.getElementById('email-recipient-category').value;
  const select = document.getElementById('email-recipient-select');
  if (!select) return;

  if (category === 'client') {
    select.innerHTML = appState.clients.map(c => 
      `<option value="${c.id}" data-name="${escapeHtml(c.name)}" data-email="${c.email}">${escapeHtml(c.name)} (${escapeHtml(c.company)}) - ${c.email}</option>`
    ).join('');
  } else {
    select.innerHTML = appState.crew.map(cr => 
      `<option value="${cr.id}" data-name="${escapeHtml(cr.name)}" data-email="${cr.email}">${escapeHtml(cr.name)} (${escapeHtml(cr.role)}) - ${cr.email}</option>`
    ).join('');
  }

  updateEmailMessageTemplate();
}

function populateEmailProjectSelect() {
  const select = document.getElementById('email-project-select');
  if (!select) return;
  if (appState.projects.length === 0) {
    select.innerHTML = `<option value="General Production">General Production</option>`;
  } else {
    select.innerHTML = appState.projects.map(p => 
      `<option value="${escapeHtml(p.title)}">${escapeHtml(p.title)} (${escapeHtml(p.category)})</option>`
    ).join('');
  }
}

function updateEmailMessageTemplate() {
  const category = document.getElementById('email-recipient-category').value;
  const recipientSelect = document.getElementById('email-recipient-select');
  const projectSelect = document.getElementById('email-project-select');
  const subjectInput = document.getElementById('email-subject-text');
  const messageTextarea = document.getElementById('email-message-text');

  if (!recipientSelect || !messageTextarea) return;

  const selectedOpt = recipientSelect.options[recipientSelect.selectedIndex];
  const recipientName = selectedOpt ? selectedOpt.getAttribute('data-name') : 'there';
  const projectTitle = projectSelect ? projectSelect.value : 'your project';

  if (category === 'client') {
    if (subjectInput) subjectInput.value = `Project Progress Update: ${projectTitle}`;
    messageTextarea.value = `Dear ${recipientName},\n\nWe are pleased to share an official progress update for your project '${projectTitle}'.\n\nAll shoot milestones and production deliverables are currently on track per our Pragati workflow agreement.\n\nBest regards,\nPragati Studio Operations`;
  } else {
    if (subjectInput) subjectInput.value = `Action Required - Status Update for ${projectTitle}`;
    messageTextarea.value = `Hello ${recipientName},\n\nCould you please provide a brief status update on your assigned deliverables for '${projectTitle}'?\n\nPlease confirm if your timeline is on schedule or if you require additional resources.\n\nThank you,\nPragati Studio Operations`;
  }
}

function handleSendEmail(e) {
  e.preventDefault();
  const recipientSelect = document.getElementById('email-recipient-select');
  const subjectInput = document.getElementById('email-subject-text');
  const messageTextarea = document.getElementById('email-message-text');

  if (!recipientSelect || !messageTextarea) return;

  const selectedOpt = recipientSelect.options[recipientSelect.selectedIndex];
  const recipientEmail = selectedOpt ? selectedOpt.getAttribute('data-email') : '';
  const subject = subjectInput ? subjectInput.value : 'Project Update';
  const body = messageTextarea.value;

  const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoUrl, '_blank');

  closeModal('modal-email');
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
