/* ==========================================================================
   PRAGATI STUDIO COMMAND CENTER - JAVASCRIPT LOGIC & STATE
   ========================================================================== */

// Regional Currencies Map
const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  NPR: { code: 'NPR', symbol: 'रु ', name: 'Nepalese Rupee' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  AED: { code: 'AED', symbol: 'د.إ ', name: 'UAE Dirham' }
};

function getCurrencySymbol() {
  const code = appState.currency || 'INR';
  return (CURRENCIES[code] && CURRENCIES[code].symbol) ? CURRENCIES[code].symbol : '₹';
}

// Initial Clean State
const DEFAULT_STATE = {
  clients: [],
  crew: [],
  projects: [],
  notifications: [],
  revenue: 0,
  upcomingShoots: 0,
  currency: 'INR'
};

// Application State
let appState = loadState();

function loadState() {
  const saved = localStorage.getItem('pragati_studio_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        if (!parsed.currency) parsed.currency = 'INR';
        if (!parsed.notifications) parsed.notifications = [];
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
  renderProgressTracker();
  renderCharts();
  checkAuthState();
}

// Initialize App on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  const settingCurrency = document.getElementById('setting-currency');
  if (settingCurrency && appState.currency) {
    settingCurrency.value = appState.currency;
  }
  updateStats();
  renderDashboardProjects();
  renderClientsTable();
  renderCrewTable();
  renderProgressTracker();
  renderNotifications();
  checkAuthState();
  
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
  } else if (viewId === 'view-progress') {
    renderProgressTracker();
  }
}

// Update KPI Metrics in Dashboard Header
function updateStats() {
  const totalClientsEl = document.getElementById('stat-total-clients');
  const activeProjectsEl = document.getElementById('stat-active-projects');
  const upcomingShootsEl = document.getElementById('stat-upcoming-shoots');
  const revenueEl = document.getElementById('stat-revenue');
  const symbol = getCurrencySymbol();

  if (totalClientsEl) totalClientsEl.textContent = appState.clients.length;
  if (activeProjectsEl) activeProjectsEl.textContent = appState.projects.filter(p => p.status === 'Active').length;
  if (upcomingShootsEl) upcomingShootsEl.textContent = appState.projects.length;
  if (revenueEl) {
    const rev = appState.revenue || 0;
    revenueEl.textContent = rev > 0 
      ? symbol + (rev >= 1000 ? (rev / 1000).toFixed(1) + 'k' : rev.toLocaleString()) 
      : symbol + '0';
  }
}

// Helper: Calculate Completion Deadline Urgency
function getDeadlineStatus(endDateStr, progress) {
  if (progress >= 100) {
    return { isNear: false, label: '', daysLeft: null };
  }
  if (!endDateStr) {
    return { isNear: false, label: '', daysLeft: null };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = endDateStr.split('-');
  let compDate;
  if (parts.length === 3) {
    compDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  } else {
    compDate = new Date(endDateStr);
  }
  compDate.setHours(0, 0, 0, 0);

  const diffTime = compDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 3) {
    let label = '';
    if (diffDays < 0) {
      label = `Overdue ${Math.abs(diffDays)}d!`;
    } else if (diffDays === 0) {
      label = 'Due Today!';
    } else if (diffDays === 1) {
      label = 'Due Tomorrow!';
    } else {
      label = `Due in ${diffDays}d!`;
    }
    return { isNear: true, label, daysLeft: diffDays };
  }

  return { isNear: false, label: '', daysLeft: diffDays };
}

// Render Dashboard & Projects Directory Tables
function renderDashboardProjects(customList) {
  const tbodyDashboard = document.getElementById('table-dashboard-projects');
  const tbodyAll = document.getElementById('table-all-projects');
  const list = customList !== undefined ? customList : appState.projects;

  const htmlContent = list.length === 0
    ? `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No production shoots found.</td></tr>`
    : list.map(p => {
        const crewPills = (p.crew && p.crew.length > 0)
          ? p.crew.map(cr => `<span class="crew-tag-pill">${escapeHtml(cr)}</span>`).join('')
          : `<span style="font-size: 12px; color: var(--text-muted);">Unassigned</span>`;

        const startDate = p.startDate || p.date;
        const shootDate = p.date;
        const endDate = p.endDate || p.date;
        const deadline = getDeadlineStatus(endDate, p.progress || 0);

        const endLineHtml = deadline.isNear
          ? `<div><span style="color: var(--brand-red); font-weight: 800;">End: ${escapeHtml(endDate)}</span> <span class="urgent-badge"><iconify-icon icon="tabler:alert-triangle"></iconify-icon> ${escapeHtml(deadline.label)}</span></div>`
          : `<div><span style="color: var(--brand-lime); font-weight: 700;">End:</span> ${escapeHtml(endDate)}</div>`;

        const datesHtml = `
          <div style="font-size: 11px; line-height: 1.4;">
            <div><span style="color: var(--brand-cyan); font-weight: 700;">Start:</span> ${escapeHtml(startDate)}</div>
            <div><span style="color: var(--brand-navy); font-weight: 700;">Shoot:</span> ${escapeHtml(shootDate)}</div>
            ${endLineHtml}
          </div>
        `;

        const isAdmin = appState.user && appState.user.role === 'Admin';

        const actionCell = isAdmin ? `
          <td>
            <button class="icon-btn" style="width:30px; height:30px; font-size:14px; margin-right:4px;" onclick="openEditProjectModal('${p.id}')" title="Edit Project">
              <iconify-icon icon="tabler:pencil" style="color: var(--brand-cyan);"></iconify-icon>
            </button>
            <button class="icon-btn" style="width:30px; height:30px; font-size:14px;" onclick="deleteProject('${p.id}')" title="Delete Project">
              <iconify-icon icon="tabler:trash" style="color: var(--brand-red);"></iconify-icon>
            </button>
          </td>
        ` : ``;

        return `
          <tr>
            <td><strong>${escapeHtml(p.title)}</strong></td>
            <td>${escapeHtml(p.client)}</td>
            <td><span class="status-tag" style="background: var(--brand-cyan-light); color: var(--brand-cyan);">${escapeHtml(p.category)}</span></td>
            <td>${crewPills}</td>
            <td>${datesHtml}</td>
            <td><span class="status-tag ${p.status.toLowerCase()}">${escapeHtml(p.status)}</span></td>
            ${actionCell}
          </tr>
        `;
      }).join('');

  if (tbodyDashboard) tbodyDashboard.innerHTML = htmlContent;
  if (tbodyAll) tbodyAll.innerHTML = htmlContent;
}

// Render Clients Directory Table
function renderClientsTable(customList) {
  const tbody = document.getElementById('table-clients');
  if (!tbody) return;
  const list = customList !== undefined ? customList : appState.clients;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No matching clients found.</td></tr>`;
    return;
  }

  const isAdmin = appState.user && appState.user.role === 'Admin';

  tbody.innerHTML = list.map(c => {
    const actionCell = isAdmin ? `
      <td>
        <button class="icon-btn" style="width:30px; height:30px; font-size:14px; margin-right:4px;" onclick="openEditClientModal('${c.id}')" title="Edit Client">
          <iconify-icon icon="tabler:pencil" style="color: var(--brand-cyan);"></iconify-icon>
        </button>
        <button class="icon-btn" style="width:30px; height:30px; font-size:14px;" onclick="deleteClient('${c.id}')" title="Delete Client">
          <iconify-icon icon="tabler:trash" style="color: var(--brand-red);"></iconify-icon>
        </button>
      </td>
    ` : ``;

    return `
      <tr>
        <td><strong>${escapeHtml(c.name)}</strong></td>
        <td>${escapeHtml(c.company)}</td>
        <td>${escapeHtml(c.email)}</td>
        <td>${escapeHtml(c.phone)}</td>
        <td>${c.projects || 1} active</td>
        <td><span class="status-tag active">${c.status || 'Active'}</span></td>
        ${actionCell}
      </tr>
    `;
  }).join('');
}

// Helper: Get active projects assigned to a specific crew member
function getCrewAssignedProjects(crewName) {
  if (!crewName || !appState.projects) return [];
  return appState.projects.filter(p => {
    const status = (p.status || '').toLowerCase();
    const stage = (p.stage || '').toLowerCase();
    const progress = p.progress !== undefined ? p.progress : 0;

    // Active project check
    const isActive = status !== 'completed' && status !== 'delivered' && stage !== 'delivered & completed' && progress < 100;
    if (!isActive) return false;

    return p.crew && Array.isArray(p.crew) && p.crew.some(cr => cr.trim().toLowerCase() === crewName.trim().toLowerCase());
  });
}

// Render Crew & Talent Table
function renderCrewTable(customList) {
  const tbody = document.getElementById('table-crew');
  const rateHeader = document.getElementById('crew-header-rate');
  const symbol = getCurrencySymbol();
  if (rateHeader) rateHeader.textContent = `Day Rate (${symbol.trim()})`;

  if (!tbody) return;
  const list = customList !== undefined ? customList : appState.crew;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No matching crew members found.</td></tr>`;
    return;
  }

  const isAdmin = appState.user && appState.user.role === 'Admin';
  const pendingCrew = list.filter(c => c.approvalStatus === 'Pending');

  const pendingBannerHtml = (isAdmin && pendingCrew.length > 0) ? `
    <div style="background: #fffbebf; border: 1px solid #fcd34d; border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 20px;">
      <div style="font-weight: 700; color: #b45309; font-size: 14px; margin-bottom: 8px;">
        <iconify-icon icon="tabler:user-check" style="vertical-align: -2px;"></iconify-icon> Pending Crew Access Approvals (${pendingCrew.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${pendingCrew.map(cr => `
          <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid #fde68a;">
            <div>
              <strong style="color: var(--brand-navy);">${escapeHtml(cr.name)}</strong> (${escapeHtml(cr.email)})
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-primary-amber" style="padding: 4px 12px; font-size: 12px; background: #10b981; color: white;" onclick="approveCrewMember('${cr.id}')">Approve Access</button>
              <button class="btn-secondary" style="padding: 4px 12px; font-size: 12px; color: var(--brand-red);" onclick="rejectCrewMember('${cr.id}')">Reject</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const tableRowsHtml = list.map(c => {
    const assignedProjects = getCrewAssignedProjects(c.name);
    const isBooked = assignedProjects.length > 0;
    c.status = isBooked ? 'Unavailable' : (c.approvalStatus === 'Pending' ? 'Pending Approval' : 'Available');

    const statusHtml = c.approvalStatus === 'Pending'
      ? `<span class="status-tag pending" style="background: #fef3c7; color: #b45309; font-weight: 800;">Pending Approval</span>`
      : (isBooked
        ? `<span class="status-tag pending" style="background: #fef2f2; color: var(--brand-red); font-weight: 800; border: 1px solid rgba(224,86,36,0.3);">Unavailable</span>`
        : `<span class="status-tag active">Available</span>`);

    const nameCellHtml = isBooked
      ? `<div>
           <strong>${escapeHtml(c.name)}</strong>
           <div style="font-size: 11px; color: var(--brand-red); margin-top: 2px; font-weight: 600;">
             <iconify-icon icon="tabler:movie" style="vertical-align: -1px;"></iconify-icon> Booked: ${escapeHtml(assignedProjects.map(p => p.title).join(', '))}
           </div>
         </div>`
      : `<strong>${escapeHtml(c.name)}</strong>`;

    const actionCell = isAdmin ? `
      <td>
        <button class="icon-btn" style="width:30px; height:30px; font-size:14px; margin-right:4px;" onclick="openEditCrewModal('${c.id}')" title="Edit Crew Member">
          <iconify-icon icon="tabler:pencil" style="color: var(--brand-cyan);"></iconify-icon>
        </button>
        <button class="icon-btn" style="width:30px; height:30px; font-size:14px;" onclick="deleteCrew('${c.id}')" title="Remove Crew Member">
          <iconify-icon icon="tabler:trash" style="color: var(--brand-red);"></iconify-icon>
        </button>
      </td>
    ` : ``;

    return `
      <tr>
        <td>${nameCellHtml}</td>
        <td><span class="status-tag" style="background: var(--brand-lime-light); color: var(--brand-lime);">${escapeHtml(c.role)}</span></td>
        <td>${escapeHtml(c.email)}</td>
        <td>${escapeHtml(c.phone || 'N/A')}</td>
        <td><strong>${symbol}${c.rate ? c.rate.toLocaleString() : '0'}</strong>/day</td>
        <td>${statusHtml}</td>
        ${actionCell}
      </tr>
    `;
  }).join('');

  tbody.parentElement.insertAdjacentHTML('beforebegin', pendingBannerHtml);
  tbody.innerHTML = tableRowsHtml;
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
  const phone = document.getElementById('input-crew-phone').value || '';
  const rate = parseInt(document.getElementById('input-crew-rate').value) || 500;

  appState.crew.push({
    id: 'crw_' + Date.now(),
    name,
    role,
    email,
    phone,
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
      container.innerHTML = appState.crew.map((cr, idx) => {
        const assigned = getCrewAssignedProjects(cr.name);
        const isBooked = assigned.length > 0;
        const bookedTag = isBooked ? `<span style="color: var(--brand-red); font-size: 11px; font-weight: 700; margin-left: 4px;">(Unavailable - ${escapeHtml(assigned[0].title)})</span>` : '';

        return `
          <label class="crew-checkbox-item" style="${isBooked ? 'opacity: 0.85;' : ''}">
            <input type="checkbox" value="${escapeHtml(cr.name)}" ${idx === 0 && !isBooked ? 'checked' : ''}>
            <span>${escapeHtml(cr.name)} (${escapeHtml(cr.role)}) ${bookedTag}</span>
          </label>
        `;
      }).join('');
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
  const startDate = document.getElementById('input-project-start-date').value || new Date().toISOString().split('T')[0];
  const date = document.getElementById('input-project-date').value || startDate;
  const endDate = document.getElementById('input-project-end-date').value || date;

  const checkedCrew = Array.from(document.querySelectorAll('#project-crew-checkboxes input:checked')).map(cb => cb.value);

  appState.projects.push({
    id: 'prj_' + Date.now(),
    title,
    client,
    category,
    startDate,
    date,
    endDate,
    crew: checkedCrew.length > 0 ? checkedCrew : ['Unassigned'],
    status: 'Active',
    stage: 'Pre-Production',
    progress: 25
  });

  saveState();
  closeModal('modal-add-project');
  e.target.reset();
}

/* ==========================================================================
   EDIT DETAILS HANDLERS FOR CLIENTS, CREW & PROJECTS
   ========================================================================== */

// 1. Edit Client Handlers
function openEditClientModal(id) {
  const client = appState.clients.find(c => c.id === id);
  if (!client) return;

  document.getElementById('edit-client-id').value = client.id;
  document.getElementById('edit-client-name').value = client.name;
  document.getElementById('edit-client-company').value = client.company;
  document.getElementById('edit-client-email').value = client.email;
  document.getElementById('edit-client-phone').value = client.phone || '';
  document.getElementById('edit-client-status').value = client.status || 'Active';

  openModal('modal-edit-client');
}

function handleSaveEditClient(e) {
  e.preventDefault();
  const id = document.getElementById('edit-client-id').value;
  const client = appState.clients.find(c => c.id === id);
  if (!client) return;

  client.name = document.getElementById('edit-client-name').value;
  client.company = document.getElementById('edit-client-company').value;
  client.email = document.getElementById('edit-client-email').value;
  client.phone = document.getElementById('edit-client-phone').value;
  client.status = document.getElementById('edit-client-status').value;

  saveState();
  closeModal('modal-edit-client');
}

// 2. Edit Crew Handlers
function openEditCrewModal(id) {
  const crew = appState.crew.find(c => c.id === id);
  if (!crew) return;

  document.getElementById('edit-crew-id').value = crew.id;
  document.getElementById('edit-crew-name').value = crew.name;
  document.getElementById('edit-crew-role').value = crew.role;
  document.getElementById('edit-crew-email').value = crew.email;
  document.getElementById('edit-crew-phone').value = crew.phone || '';
  document.getElementById('edit-crew-rate').value = crew.rate;
  document.getElementById('edit-crew-status').value = crew.status || 'Available';

  openModal('modal-edit-crew');
}

function handleSaveEditCrew(e) {
  e.preventDefault();
  const id = document.getElementById('edit-crew-id').value;
  const crew = appState.crew.find(c => c.id === id);
  if (!crew) return;

  crew.name = document.getElementById('edit-crew-name').value;
  crew.role = document.getElementById('edit-crew-role').value;
  crew.email = document.getElementById('edit-crew-email').value;
  crew.phone = document.getElementById('edit-crew-phone').value;
  crew.rate = parseInt(document.getElementById('edit-crew-rate').value) || 0;
  crew.status = document.getElementById('edit-crew-status').value;

  saveState();
  closeModal('modal-edit-crew');
}

// 3. Edit Project Handlers
function openEditProjectModal(id) {
  const project = appState.projects.find(p => p.id === id);
  if (!project) return;

  document.getElementById('edit-project-id').value = project.id;
  document.getElementById('edit-project-title').value = project.title;
  document.getElementById('edit-project-client').value = project.client;
  document.getElementById('edit-project-category').value = project.category;
  document.getElementById('edit-project-start-date').value = project.startDate || project.date;
  document.getElementById('edit-project-date').value = project.date;
  document.getElementById('edit-project-end-date').value = project.endDate || project.date;
  document.getElementById('edit-project-status').value = project.status || 'Active';

  const container = document.getElementById('edit-project-crew-checkboxes');
  if (container) {
    if (appState.crew.length === 0) {
      container.innerHTML = `<span style="font-size: 12px; color: var(--text-muted);">No crew members available. Add crew members first.</span>`;
    } else {
      const assignedSet = new Set(project.crew || []);
      container.innerHTML = appState.crew.map(cr => {
        const assignedProjects = getCrewAssignedProjects(cr.name);
        // Exclude current project from booked check
        const otherBooked = assignedProjects.filter(p => p.id !== project.id);
        const isBooked = otherBooked.length > 0;
        const bookedTag = isBooked ? `<span style="color: var(--brand-red); font-size: 11px; font-weight: 700; margin-left: 4px;">(Unavailable - ${escapeHtml(otherBooked[0].title)})</span>` : '';

        return `
          <label class="crew-checkbox-item" style="${isBooked ? 'opacity: 0.85;' : ''}">
            <input type="checkbox" value="${escapeHtml(cr.name)}" ${assignedSet.has(cr.name) ? 'checked' : ''}>
            <span>${escapeHtml(cr.name)} (${escapeHtml(cr.role)}) ${bookedTag}</span>
          </label>
        `;
      }).join('');
    }
  }

  openModal('modal-edit-project');
}

function handleSaveEditProject(e) {
  e.preventDefault();
  const id = document.getElementById('edit-project-id').value;
  const project = appState.projects.find(p => p.id === id);
  if (!project) return;

  project.title = document.getElementById('edit-project-title').value;
  project.client = document.getElementById('edit-project-client').value;
  project.category = document.getElementById('edit-project-category').value;
  project.startDate = document.getElementById('edit-project-start-date').value;
  project.date = document.getElementById('edit-project-date').value;
  project.endDate = document.getElementById('edit-project-end-date').value;
  project.status = document.getElementById('edit-project-status').value;

  const checkedCrew = Array.from(document.querySelectorAll('#edit-project-crew-checkboxes input:checked')).map(cb => cb.value);
  project.crew = checkedCrew.length > 0 ? checkedCrew : ['Unassigned'];

  saveState();
  closeModal('modal-edit-project');
}

/* ==========================================================================
   PROJECT PROGRESS TRACKER HANDLERS
   ========================================================================== */

function renderProgressTracker(customList) {
  const container = document.getElementById('progress-cards-container');
  if (!container) return;
  const list = customList !== undefined ? customList : appState.projects;

  if (list.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 36px; background: white; border: 1px solid var(--border-color); border-radius: var(--radius-lg);">No matching production projects found.</div>`;
    return;
  }

  container.innerHTML = list.map(p => {
    const percent = p.progress !== undefined ? p.progress : 25;
    const stage = p.stage || 'Pre-Production';
    const startDate = p.startDate || p.date;
    const endDate = p.endDate || p.date;
    const deadline = getDeadlineStatus(endDate, percent);

    const crewPills = (p.crew && p.crew.length > 0)
      ? p.crew.map(cr => `<span class="crew-tag-pill">${escapeHtml(cr)}</span>`).join('')
      : `<span style="font-size: 11px; color: var(--text-muted);">Unassigned</span>`;

    const cardClass = `progress-card ${deadline.isNear ? 'urgent' : ''}`;
    const timelineHtml = deadline.isNear
      ? `<div style="font-size: 11px; margin-top: 4px; display: flex; align-items: center; flex-wrap: wrap; gap: 4px;">
           <span style="color: var(--text-muted);">Timeline: ${escapeHtml(startDate)} &rarr;</span>
           <span style="color: var(--brand-red); font-weight: 800; text-decoration: underline;">${escapeHtml(endDate)}</span>
           <span class="urgent-badge"><iconify-icon icon="tabler:alert-triangle"></iconify-icon> ${escapeHtml(deadline.label)}</span>
         </div>`
      : `<div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Timeline: ${escapeHtml(startDate)} &rarr; ${escapeHtml(endDate)}</div>`;

    const userRole = appState.user ? appState.user.role : null;
    const canUpdateProgress = userRole === 'Admin' || userRole === 'Crew Member' || userRole === 'Crew';

    const updateBtnHtml = canUpdateProgress ? `
      <button class="btn-primary-amber" style="padding: 6px 12px; font-size: 12px;" onclick="openUpdateProgressModal('${p.id}')">
        <iconify-icon icon="tabler:adjustments"></iconify-icon> Update
      </button>
    ` : `<span style="font-size: 11px; color: var(--brand-cyan); font-weight: 700; background: var(--brand-cyan-light); padding: 4px 10px; border-radius: 12px;">View Only</span>`;

    return `
      <div class="${cardClass}">
        <div class="progress-card-header">
          <div>
            <div class="progress-card-title">${escapeHtml(p.title)}</div>
            <div class="progress-card-client">Client: ${escapeHtml(p.client)}</div>
            ${timelineHtml}
          </div>
          <span class="progress-stage-badge" style="${deadline.isNear ? 'background: #fef2f2; color: var(--brand-red);' : ''}">${escapeHtml(stage)}</span>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar-header">
            <span>Overall Progress</span>
            <span style="color: var(--brand-cyan); font-weight: 800;">${percent}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${percent}%;"></div>
          </div>
        </div>

        <div class="progress-crew-list">
          <div>
            <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">ASSIGNED CREW</span>
            ${crewPills}
          </div>
          ${updateBtnHtml}
        </div>
      </div>
    `;
  }).join('');
}

function updateProgressSlider(val) {
  const percent = parseInt(val) || 0;
  const slider = document.getElementById('progress-project-percent');
  const label = document.getElementById('progress-percentage-label');
  if (label) label.textContent = percent + '%';
  if (slider) {
    slider.style.background = `linear-gradient(to right, #0284c7 0%, #65a30d ${percent}%, #e2e8f0 ${percent}%, #e2e8f0 100%)`;
  }
}

function openUpdateProgressModal(id) {
  const project = appState.projects.find(p => p.id === id);
  if (!project) return;

  document.getElementById('progress-project-id').value = project.id;
  document.getElementById('progress-project-title').value = project.title;
  document.getElementById('progress-project-stage').value = project.stage || 'Pre-Production';

  const percent = project.progress !== undefined ? project.progress : 25;
  document.getElementById('progress-project-percent').value = percent;
  updateProgressSlider(percent);

  openModal('modal-update-progress');
}

function handleSaveProjectProgress(e) {
  e.preventDefault();
  const id = document.getElementById('progress-project-id').value;
  const project = appState.projects.find(p => p.id === id);
  if (!project) return;

  project.stage = document.getElementById('progress-project-stage').value;
  project.progress = parseInt(document.getElementById('progress-project-percent').value) || 0;

  saveState();
  closeModal('modal-update-progress');

  // Trigger Notification for Non-Admin Activity
  addNotification({
    title: 'Project Progress Update',
    message: `${appState.user ? appState.user.name : 'Crew'} updated ${project.title} progress to ${project.progress}% (${project.stage})`
  });
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
    if (appState.clients.length === 0) {
      select.innerHTML = `<option value="">No clients registered</option>`;
    } else {
      select.innerHTML = appState.clients.map(c => 
        `<option value="${c.id}" data-name="${escapeHtml(c.name)}" data-phone="${c.phone || ''}">${escapeHtml(c.name)} (${escapeHtml(c.company)}) - Phone: ${c.phone || 'N/A'}</option>`
      ).join('');
    }
  } else {
    if (appState.crew.length === 0) {
      select.innerHTML = `<option value="">No crew members in roster</option>`;
    } else {
      select.innerHTML = appState.crew.map(cr => 
        `<option value="${cr.id}" data-name="${escapeHtml(cr.name)}" data-phone="${cr.phone || ''}">${escapeHtml(cr.name)} (${escapeHtml(cr.role)}) - Phone: ${cr.phone || 'N/A'}</option>`
      ).join('');
    }
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
  const targetPhoneInput = document.getElementById('wa-target-phone');

  if (!recipientSelect || !messageTextarea) return;

  const selectedOpt = recipientSelect.options[recipientSelect.selectedIndex];
  const recipientName = selectedOpt ? selectedOpt.getAttribute('data-name') : 'there';
  const recipientPhone = selectedOpt ? (selectedOpt.getAttribute('data-phone') || '') : '';
  const projectTitle = projectSelect ? projectSelect.value : 'your project';

  if (targetPhoneInput) {
    targetPhoneInput.value = recipientPhone;
  }

  const phoneNote = recipientPhone ? ` (Contact: ${recipientPhone})` : '';

  if (category === 'client') {
    messageTextarea.value = `Hello ${recipientName}${phoneNote}, here is an official project update regarding '${projectTitle}': The shoot & production deliverables are progressing smoothly according to our Pragati workflow schedule! Please let us know if you have any questions.`;
  } else {
    messageTextarea.value = `Hi ${recipientName}${phoneNote}, please provide a quick status update regarding your assigned deliverables for project '${projectTitle}'. Let us know if you need any additional resources, equipment, or approvals!`;
  }
}

function handleSendWhatsApp(e) {
  e.preventDefault();
  const targetPhoneInput = document.getElementById('wa-target-phone');
  const messageTextarea = document.getElementById('wa-message-text');
  
  if (!messageTextarea) return;

  const rawPhone = targetPhoneInput ? targetPhoneInput.value : '';
  const cleanPhone = rawPhone.replace(/[^\d+]/g, '');
  const messageText = messageTextarea.value;

  if (!cleanPhone) {
    alert('Please enter a valid WhatsApp phone number for the recipient.');
    return;
  }

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

// Global Live Search Handler
function handleGlobalSearch(e) {
  const input = document.getElementById('global-search-input');
  const query = (input ? input.value : (e.target ? e.target.value : '')).toLowerCase().trim();
  const dropdown = document.getElementById('search-results-dropdown');

  if (!query) {
    if (dropdown) {
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
    }
    renderDashboardProjects();
    renderClientsTable();
    renderCrewTable();
    renderProgressTracker();
    return;
  }

  // Filter state objects
  const filteredProjects = appState.projects.filter(p => 
    (p.title && p.title.toLowerCase().includes(query)) ||
    (p.client && p.client.toLowerCase().includes(query)) ||
    (p.category && p.category.toLowerCase().includes(query)) ||
    (p.crew && p.crew.some(cr => cr.toLowerCase().includes(query)))
  );

  const filteredClients = appState.clients.filter(c => 
    (c.name && c.name.toLowerCase().includes(query)) ||
    (c.company && c.company.toLowerCase().includes(query)) ||
    (c.email && c.email.toLowerCase().includes(query)) ||
    (c.phone && c.phone.toLowerCase().includes(query))
  );

  const filteredCrew = appState.crew.filter(cr => 
    (cr.name && cr.name.toLowerCase().includes(query)) ||
    (cr.role && cr.role.toLowerCase().includes(query)) ||
    (cr.email && cr.email.toLowerCase().includes(query)) ||
    (cr.phone && cr.phone.toLowerCase().includes(query))
  );

  // Re-render views live
  renderDashboardProjects(filteredProjects);
  renderClientsTable(filteredClients);
  renderCrewTable(filteredCrew);
  renderProgressTracker(filteredProjects);

  // Render Search Dropdown Overlay
  if (dropdown) {
    let html = '';

    if (filteredProjects.length > 0) {
      html += `<div class="search-group-header">Projects (${filteredProjects.length})</div>`;
      html += filteredProjects.map(p => `
        <div class="search-result-item" onclick="selectSearchResult('view-projects')">
          <div>
            <div class="search-result-title">${escapeHtml(p.title)}</div>
            <div class="search-result-sub">${escapeHtml(p.client)} &bull; ${escapeHtml(p.category)}</div>
          </div>
          <span class="status-tag" style="background: var(--brand-cyan-light); color: var(--brand-cyan); font-size: 10px;">${escapeHtml(p.status)}</span>
        </div>
      `).join('');
    }

    if (filteredClients.length > 0) {
      html += `<div class="search-group-header">Clients (${filteredClients.length})</div>`;
      html += filteredClients.map(c => `
        <div class="search-result-item" onclick="selectSearchResult('view-clients')">
          <div>
            <div class="search-result-title">${escapeHtml(c.name)}</div>
            <div class="search-result-sub">${escapeHtml(c.company)} &bull; ${escapeHtml(c.email)}</div>
          </div>
          <span class="status-tag active" style="font-size: 10px;">Client</span>
        </div>
      `).join('');
    }

    if (filteredCrew.length > 0) {
      html += `<div class="search-group-header">Crew & Talent (${filteredCrew.length})</div>`;
      html += filteredCrew.map(cr => `
        <div class="search-result-item" onclick="selectSearchResult('view-crew')">
          <div>
            <div class="search-result-title">${escapeHtml(cr.name)}</div>
            <div class="search-result-sub">${escapeHtml(cr.role)} &bull; ${escapeHtml(cr.phone || cr.email)}</div>
          </div>
          <span class="status-tag" style="background: var(--brand-lime-light); color: var(--brand-lime); font-size: 10px;">Crew</span>
        </div>
      `).join('');
    }

    if (!html) {
      html = `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px;">No results found matching "${escapeHtml(query)}"</div>`;
    }

    dropdown.innerHTML = html;
    dropdown.classList.add('active');
  }
}

function selectSearchResult(viewId) {
  const dropdown = document.getElementById('search-results-dropdown');
  if (dropdown) dropdown.classList.remove('active');
  switchTab(viewId);
}

// Close search dropdown on click outside
document.addEventListener('click', (e) => {
  const searchBox = document.querySelector('.header-search');
  const dropdown = document.getElementById('search-results-dropdown');
  if (searchBox && !searchBox.contains(e.target) && dropdown) {
    dropdown.classList.remove('active');
  }
});

// Currency Select Change Handler
function handleCurrencySelectChange(e) {
  appState.currency = e.target.value;
  saveState();
}

// Save Settings
function saveSettings() {
  const studioName = document.getElementById('setting-studio-name');
  const currencySelect = document.getElementById('setting-currency');
  const emailInput = document.getElementById('setting-email');

  if (studioName) appState.studioName = studioName.value;
  if (currencySelect) appState.currency = currencySelect.value;
  if (emailInput) appState.email = emailInput.value;

  saveState();
  alert('Studio settings updated successfully!');
}

/* ==========================================================================
   AUTHENTICATION & USER SESSION MANAGEMENT
   ========================================================================== */

function checkAuthState() {
  const overlay = document.getElementById('auth-overlay');
  const user = appState.user;

  if (!user) {
    if (overlay) overlay.classList.add('active');
    return;
  }

  // User is authenticated
  if (overlay) overlay.classList.remove('active');

  // Update top header user profile
  const avatarEl = document.getElementById('user-avatar');
  const nameEl = document.getElementById('user-name');
  const roleEl = document.getElementById('user-role');

  if (avatarEl) {
    if (user.picture) {
      avatarEl.innerHTML = `<img src="${user.picture}" alt="${escapeHtml(user.name)}">`;
    } else {
      avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();
    }
  }

  if (nameEl) nameEl.textContent = user.name || 'User';
  if (roleEl) {
    roleEl.textContent = user.role || 'Member';
    roleEl.style.color = user.role === 'Admin' ? 'var(--brand-cyan)' : 'var(--brand-lime)';
  }

  updateRolePermissions();
}

function updateRolePermissions() {
  const user = appState.user;
  const role = user ? user.role : null;
  const isAdmin = role === 'Admin';

  // Toggle .admin-only elements (Add buttons, Quick Actions, Settings tab)
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
  });

  // Toggle table Actions TH headers if not admin
  document.querySelectorAll('.data-table').forEach(table => {
    const ths = table.querySelectorAll('th');
    if (ths.length > 0) {
      const lastTh = ths[ths.length - 1];
      if (lastTh && lastTh.textContent.trim().toLowerCase().includes('action')) {
        lastTh.style.display = isAdmin ? '' : 'none';
      }
    }
  });

  // Redirect to Dashboard if non-admin is currently viewing Settings
  const settingsTab = document.getElementById('view-settings');
  if (!isAdmin && settingsTab && settingsTab.classList.contains('active')) {
    switchTab('view-dashboard');
  }
}

const GOOGLE_CLIENT_ID = "842949964836-v9650tbm470mbpt17kj8fkkneju956kg.apps.googleusercontent.com";

function initGoogleSignInButton() {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse
      });

      const container = document.getElementById('google-button-container');
      if (container) {
        container.innerHTML = '';
        window.google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'signin_with',
          shape: 'rectangular'
        });
      }
    } catch (e) {
      console.warn("Google GIS Init error", e);
    }
  }
}

function switchAuthTab(tabType) {
  const btnAdmin = document.getElementById('tab-btn-admin');
  const btnCrew = document.getElementById('tab-btn-crew');
  const btnClient = document.getElementById('tab-btn-client');

  const formAdmin = document.getElementById('auth-form-admin');
  const formCrew = document.getElementById('auth-form-crew');
  const formClient = document.getElementById('auth-form-client');
  const formPending = document.getElementById('auth-form-pending');

  [btnAdmin, btnCrew, btnClient].forEach(btn => btn && btn.classList.remove('active'));
  [formAdmin, formCrew, formClient, formPending].forEach(form => form && form.classList.remove('active'));

  if (tabType === 'admin') {
    if (btnAdmin) btnAdmin.classList.add('active');
    if (formAdmin) formAdmin.classList.add('active');
  } else if (tabType === 'crew') {
    if (btnCrew) btnCrew.classList.add('active');
    if (formCrew) formCrew.classList.add('active');
    setTimeout(initGoogleSignInButton, 100);
  } else if (tabType === 'client') {
    if (btnClient) btnClient.classList.add('active');
    if (formClient) formClient.classList.add('active');
  } else if (tabType === 'pending') {
    if (formPending) formPending.classList.add('active');
  }
}

function handleClientLogin() {
  appState.user = {
    name: 'Client Portal',
    email: 'client@company.com',
    role: 'Client',
    avatar: 'C'
  };

  saveState();
  checkAuthState();
}

function handleAdminLogin(e) {
  e.preventDefault();
  const userInput = document.getElementById('auth-admin-user').value.trim();
  const passInput = document.getElementById('auth-admin-pass').value.trim();
  const errorEl = document.getElementById('auth-admin-error');

  // Admin credentials verification
  const validUsers = ['admin@pragati.com', 'admin'];
  const validPasses = ['Pragati@2026', 'admin123'];

  if (validUsers.includes(userInput.toLowerCase()) && validPasses.includes(passInput)) {
    if (errorEl) errorEl.style.display = 'none';

    appState.user = {
      name: 'Admin User',
      email: userInput,
      role: 'Admin',
      avatar: 'A'
    };

    saveState();
    checkAuthState();
  } else {
    if (errorEl) {
      errorEl.textContent = 'Invalid Admin credentials. Default: admin@pragati.com / Pragati@2026';
      errorEl.style.display = 'block';
    }
  }
}

function handleGoogleSignIn() {
  // Check if Google GIS client is loaded
  if (window.google && window.google.accounts && window.google.accounts.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse
      });
      window.google.accounts.id.prompt();
      return;
    } catch (e) {
      console.warn("Google GIS Prompt Fallback", e);
    }
  }

  // Google OAuth Interactive Fallback Modal
  simulateGoogleOAuth();
}

function handleGoogleCredentialResponse(response) {
  if (response && response.credential) {
    try {
      // Decode JWT payload
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      completeGoogleAuth(payload.name, payload.email, payload.picture);
      return;
    } catch (e) { console.error('Failed to parse Google JWT', e); }
  }

  simulateGoogleOAuth();
}

function simulateGoogleOAuth() {
  const userEmail = prompt("Google Account Authentication:\nEnter your Google Email to sign in as Crew:", "crew.member@gmail.com");
  if (!userEmail) return;

  const userName = userEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  completeGoogleAuth(userName, userEmail, '');
}

function completeGoogleAuth(name, email, picture) {
  let crewMember = appState.crew.find(c => c.email.toLowerCase() === email.toLowerCase());

  if (!crewMember) {
    crewMember = {
      id: 'cr_' + Date.now(),
      name: name || 'Crew Member',
      role: 'Production Crew',
      email: email,
      phone: '',
      rate: 500,
      status: 'Available',
      approvalStatus: 'Pending' // New crew members require Admin approval
    };
    appState.crew.push(crewMember);

    // Trigger notification for Admin regarding new pending approval
    addNotification({
      title: 'New Crew Registration',
      message: `Crew member ${name} (${email}) requested registration. Pending Admin approval.`
    });
  }

  if (crewMember.approvalStatus === 'Pending') {
    // Show Pending Approval view
    switchAuthTab('pending');
    return;
  }

  appState.user = {
    name: crewMember.name,
    email: crewMember.email,
    role: 'Crew Member',
    avatar: (crewMember.name || 'C').charAt(0).toUpperCase(),
    picture: picture || ''
  };

  saveState();
  checkAuthState();
}

function approveCrewMember(id) {
  const crewMember = appState.crew.find(c => c.id === id);
  if (!crewMember) return;

  crewMember.approvalStatus = 'Approved';
  crewMember.status = 'Available';

  saveState();
  alert(`Approved crew member ${crewMember.name}!`);
}

function rejectCrewMember(id) {
  const idx = appState.crew.findIndex(c => c.id === id);
  if (idx !== -1) {
    appState.crew.splice(idx, 1);
    saveState();
  }
}

/* ==========================================================================
   IN-APP REAL-TIME ACTIVITY NOTIFICATIONS SYSTEM
   ========================================================================== */

function addNotification(data) {
  // "notify every action except for admin's"
  const currentUserRole = appState.user ? appState.user.role : null;
  if (currentUserRole === 'Admin') {
    return; // Admin actions do not create self-notifications!
  }

  if (!appState.notifications) appState.notifications = [];
  const notif = {
    id: 'notif_' + Date.now(),
    title: data.title || 'System Activity',
    message: data.message,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false
  };

  appState.notifications.unshift(notif);
  saveState();
  renderNotifications();
}

function renderNotifications() {
  const badge = document.getElementById('notification-badge');
  const list = document.getElementById('notifications-list');

  const notifs = appState.notifications || [];
  const unreadCount = notifs.filter(n => !n.read).length;

  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }

  if (list) {
    if (notifs.length === 0) {
      list.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px;">No activity notifications yet</div>`;
    } else {
      list.innerHTML = notifs.map(n => `
        <div style="padding: 10px 14px; border-bottom: 1px solid var(--border-color); ${!n.read ? 'background: rgba(2, 132, 199, 0.04);' : ''}">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <strong style="font-size: 12px; color: var(--brand-navy);">${escapeHtml(n.title)}</strong>
            <span style="font-size: 10px; color: var(--text-muted);">${escapeHtml(n.time)}</span>
          </div>
          <p style="font-size: 12px; color: var(--text-main); margin: 0; line-height: 1.3;">${escapeHtml(n.message)}</p>
        </div>
      `).join('');
    }
  }
}

function toggleNotifications(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('notifications-dropdown-menu');
  if (menu) {
    menu.classList.toggle('active');
    if (menu.classList.contains('active')) {
      if (appState.notifications) {
        appState.notifications.forEach(n => n.read = true);
        saveState();
      }
    }
  }
}

function clearNotifications() {
  appState.notifications = [];
  saveState();
  renderNotifications();
}

// Close notifications dropdown on click outside
document.addEventListener('click', (e) => {
  const notifMenu = document.getElementById('notifications-dropdown-menu');
  const notifBtn = document.querySelector('button[title="Notifications"]');
  if (notifMenu && notifMenu.classList.contains('active')) {
    if (!notifMenu.contains(e.target) && notifBtn && !notifBtn.contains(e.target)) {
      notifMenu.classList.remove('active');
    }
  }
});

function toggleUserDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('user-dropdown-menu');
  if (dropdown) dropdown.classList.toggle('active');
}

function closeUserDropdown() {
  const dropdown = document.getElementById('user-dropdown-menu');
  if (dropdown) dropdown.classList.remove('active');
}

function handleLogout() {
  closeUserDropdown();
  appState.user = null;
  saveState();
  checkAuthState();
}

// Close user dropdown on click outside
document.addEventListener('click', (e) => {
  const widget = document.querySelector('.user-profile-widget');
  if (widget && !widget.contains(e.target)) {
    closeUserDropdown();
  }
});

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
