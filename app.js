/* ==========================================================================
   PRAGATI WORKFLOW SYSTEM (PWS) - APPLICATION CORE LOGIC
   ========================================================================== */

// 1. DATA CONFIGURATION FOR 4 COMPANY TYPES & SPECIFIC HR ROLES
const COMPANY_CONFIG = {
  marketing: {
    id: 'marketing',
    name: 'Digital Marketing',
    icon: 'tabler:speakerphone',
    color: '#0ea5e9',
    desc: 'Ad campaigns, social media copy, design assets & client sign-offs.',
    hrRoles: [
      { id: 'hr-1', name: 'Campaign Director', dept: 'Strategy & Leads', access: 'Final Approver', avatar: 'CD', email: 'director@agency.com' },
      { id: 'hr-2', name: 'Creative Manager', dept: 'Design & Visuals', access: 'Reviewer', avatar: 'CM', email: 'creative@agency.com' },
      { id: 'hr-3', name: 'Copywriter Lead', dept: 'Content Team', access: 'Creator', avatar: 'CL', email: 'copy@agency.com' },
      { id: 'hr-4', name: 'Client Relations Specialist', dept: 'Account Mgmt', access: 'Client Liaison', avatar: 'CR', email: 'client.rel@agency.com' }
    ],
    sampleWorkflows: [
      { id: 'WF-101', title: 'Q3 Brand Rebrand Campaign', client: 'Apex Global', stage: 'Client Approval', status: 'pending', date: 'Today, 2:30 PM', hr: 'Campaign Director', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { id: 'WF-102', title: 'Social Media Banner Sets', client: 'Horizon Tech', stage: 'Legally Approved', status: 'approved', date: 'Yesterday', hr: 'Creative Manager', hash: 'f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2' },
      { id: 'WF-103', title: 'SEO Content Pitch Deck', client: 'Luminary Inc', stage: 'Internal Review', status: 'review', date: 'Aug 2, 2026', hr: 'Copywriter Lead', hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a' }
    ],
    certificates: [
      { certId: 'CERT-8841', project: 'Social Media Banner Sets', client: 'Horizon Tech', date: '2026-08-03 16:42 UTC', hash: 'f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2', signee: 'VP of Marketing (Horizon Tech)' }
    ]
  },
  it: {
    id: 'it',
    name: 'IT Company',
    icon: 'tabler:code-asterisk',
    color: '#10b981',
    desc: 'Software sprints, release builds, QA testing & client UAT verification.',
    hrRoles: [
      { id: 'hr-5', name: 'Project Manager (PM)', dept: 'Scrum & Agile', access: 'Sprint Admin', avatar: 'PM', email: 'pm@itcorp.com' },
      { id: 'hr-6', name: 'Lead Software Architect', dept: 'Engineering', access: 'Code Approver', avatar: 'LA', email: 'architect@itcorp.com' },
      { id: 'hr-7', name: 'QA & Compliance Lead', dept: 'Quality Assurance', access: 'UAT Checker', avatar: 'QA', email: 'qa@itcorp.com' },
      { id: 'hr-8', name: 'Technical Support Lead', dept: 'Operations', access: 'Deploy Sign-off', avatar: 'TS', email: 'support@itcorp.com' }
    ],
    sampleWorkflows: [
      { id: 'WF-201', title: 'Enterprise Portal v2.4 Release', client: 'FinCorp Bank', stage: 'Client UAT', status: 'pending', date: 'Today, 11:15 AM', hr: 'Lead Architect', hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' },
      { id: 'WF-202', title: 'Payment Gateway Integration', client: 'ShopSwift', stage: 'Legally Approved', status: 'approved', date: 'Aug 3, 2026', hr: 'QA Lead', hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' },
      { id: 'WF-203', title: 'Security Audit & Compliance', client: 'HealthCore', stage: 'Internal Review', status: 'review', date: 'Aug 1, 2026', hr: 'Project Manager', hash: '3a7bd3e2360a3421685ce8ee93dd14697a3ec074d0f779e51e70c53d0e9140c4' }
    ],
    certificates: [
      { certId: 'CERT-9102', project: 'Payment Gateway Integration', client: 'ShopSwift', date: '2026-08-03 10:15 UTC', hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', signee: 'Chief Technology Officer (ShopSwift)' }
    ]
  },
  production: {
    id: 'production',
    name: 'Production Company',
    icon: 'tabler:movie',
    color: '#8b5cf6',
    desc: 'Storyboards, film rough cuts, color grading & distributor delivery.',
    hrRoles: [
      { id: 'hr-9', name: 'Executive Producer', dept: 'Production Mgmt', access: 'Budget & Final', avatar: 'EP', email: 'producer@studios.com' },
      { id: 'hr-10', name: 'Creative Director', dept: 'Directing Team', access: 'Artistic Sign-off', avatar: 'CD', email: 'director@studios.com' },
      { id: 'hr-11', name: 'Lead Editor', dept: 'Post-Production', access: 'Cut Reviewer', avatar: 'LE', email: 'editor@studios.com' },
      { id: 'hr-12', name: 'Sound & Audio Supervisor', dept: 'Audio Dept', access: 'Audio Check', avatar: 'SA', email: 'audio@studios.com' }
    ],
    sampleWorkflows: [
      { id: 'WF-301', title: 'Commercial TV Cut (30s)', client: 'RedBull Energy', stage: 'Final Cut Review', status: 'pending', date: 'Today, 4:00 PM', hr: 'Executive Producer', hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b' },
      { id: 'WF-302', title: 'Documentary Storyboard v2', client: 'National Geo', stage: 'Legally Approved', status: 'approved', date: 'Aug 2, 2026', hr: 'Creative Director', hash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' },
      { id: 'WF-303', title: 'Color Grading & Audio Sync', client: 'Sony Music', stage: 'Internal Review', status: 'review', date: 'Jul 30, 2026', hr: 'Lead Editor', hash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de06c6d273c2592fc6ed3' }
    ],
    certificates: [
      { certId: 'CERT-7043', project: 'Documentary Storyboard v2', client: 'National Geo', date: '2026-08-02 18:20 UTC', hash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35', signee: 'Head of Programming (NatGeo)' }
    ]
  },
  decoration: {
    id: 'decoration',
    name: 'Decoration Company',
    icon: 'tabler:palette',
    color: '#f59e0b',
    desc: 'Venue floorplans, decor mockups, vendor sourcing & client sign-offs.',
    hrRoles: [
      { id: 'hr-13', name: 'Senior Event Architect', dept: 'Design & Planning', access: 'Master Approver', avatar: 'EA', email: 'architect@decor.com' },
      { id: 'hr-14', name: 'Floral & Decor Specialist', dept: 'Aesthetics', access: 'Theme Reviewer', avatar: 'FD', email: 'floral@decor.com' },
      { id: 'hr-15', name: 'Vendor Procurement Head', dept: 'Logistics', access: 'Vendor Sign-off', avatar: 'VP', email: 'vendor@decor.com' },
      { id: 'hr-16', name: 'On-site Operations Manager', dept: 'Execution', access: 'Safety Check', avatar: 'OM', email: 'ops@decor.com' }
    ],
    sampleWorkflows: [
      { id: 'WF-401', title: 'Grand Hyatt Gala Floorplan', client: 'Standard Chartered', stage: 'Client Sign-off', status: 'pending', date: 'Today, 10:00 AM', hr: 'Senior Event Architect', hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d' },
      { id: 'WF-402', title: 'Wedding Theme Visualizations', client: 'Sharma Family', stage: 'Legally Approved', status: 'approved', date: 'Aug 1, 2026', hr: 'Floral Specialist', hash: 'e7f6c011776e8db7cd330b54174fd76f7d0216b61238a6a92ae8dd0e6f949256' },
      { id: 'WF-403', title: 'Stage Lighting & Backdrop', client: 'Tech Summit 2026', stage: 'Internal Review', status: 'review', date: 'Jul 29, 2026', hr: 'Procurement Head', hash: '7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451' }
    ],
    certificates: [
      { certId: 'CERT-6501', project: 'Wedding Theme Visualizations', client: 'Sharma Family', date: '2026-08-01 14:00 UTC', hash: 'e7f6c011776e8db7cd330b54174fd76f7d0216b61238a6a92ae8dd0e6f949256', signee: 'Client Representative (Sharma Family)' }
    ]
  }
};

// 2. STATE MANAGEMENT
let currentState = {
  activeTab: 'tab-dashboard',
  selectedUserType: 'company',
  selectedCompanyType: 'marketing',
  user: null,
  workflows: [...COMPANY_CONFIG.marketing.sampleWorkflows],
  certificates: [...COMPANY_CONFIG.marketing.certificates],
  hrList: [...COMPANY_CONFIG.marketing.hrRoles],
  adminId: 'admin',
  adminPass: 'admin123'
};

// 3. INITIALIZATION ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
  initUrlTokenCheck();
  renderCompanyCategories();
  renderHrRoles();
  setupEventListeners();
});

function initUrlTokenCheck() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('admin_token') || urlParams.get('role') === 'admin') {
    selectUserType('admin');
    showToast('🔑 Admin Security Link Token Verified!');
  }
}

// 4. AUTH & SELECTION FUNCTIONS
function selectUserType(type) {
  currentState.selectedUserType = type;

  const btnCompany = document.getElementById('btn-type-company');
  const btnClient = document.getElementById('btn-type-client');
  const btnAdmin = document.getElementById('btn-type-admin');
  const googleBtn = document.getElementById('google-auth-container');
  const adminNotice = document.getElementById('admin-security-notice');
  const googleLabel = document.getElementById('google-btn-label');

  const companySectorLabel = document.querySelector('.company-categories-label');
  const companyGrid = document.getElementById('company-grid-container');
  const hrRolesBox = document.querySelector('.hr-roles-box');
  const adminDivider = document.querySelector('.divider');
  const adminBtnLink = document.querySelector('.btn-admin-link');

  if (type === 'client') {
    if (btnCompany) btnCompany.classList.remove('active');
    if (btnAdmin) btnAdmin.classList.remove('active');
    if (btnClient) btnClient.classList.add('active');

    // Hide internal agency sector & internal HR roles for client login
    if (companySectorLabel) companySectorLabel.style.display = 'none';
    if (companyGrid) companyGrid.style.display = 'none';
    if (hrRolesBox) hrRolesBox.style.display = 'none';

    // Hide Admin access elements completely in Client Login
    if (adminDivider) adminDivider.style.display = 'none';
    if (adminBtnLink) adminBtnLink.style.display = 'none';

    googleBtn.style.display = 'block';
    adminNotice.style.display = 'none';
    if (googleLabel) googleLabel.innerText = 'Sign in with Google as Client';
    showToast('🏢 Client Login Selected. Sign in with Google to enter Client Portal.');
  } else if (type === 'admin') {
    if (btnCompany) btnCompany.classList.remove('active');
    if (btnClient) btnClient.classList.remove('active');
    if (btnAdmin) btnAdmin.classList.add('active');

    if (companySectorLabel) companySectorLabel.style.display = 'block';
    if (companyGrid) companyGrid.style.display = 'grid';
    if (hrRolesBox) hrRolesBox.style.display = 'block';

    if (adminDivider) adminDivider.style.display = 'flex';
    if (adminBtnLink) adminBtnLink.style.display = 'flex';

    googleBtn.style.display = 'none';
    adminNotice.style.display = 'block';
    showToast('🔒 Google Login disabled for Admin. Security Link required.');
  } else {
    if (btnAdmin) btnAdmin.classList.remove('active');
    if (btnClient) btnClient.classList.remove('active');
    if (btnCompany) btnCompany.classList.add('active');

    if (companySectorLabel) companySectorLabel.style.display = 'block';
    if (companyGrid) companyGrid.style.display = 'grid';
    if (hrRolesBox) hrRolesBox.style.display = 'block';

    if (adminDivider) adminDivider.style.display = 'flex';
    if (adminBtnLink) adminBtnLink.style.display = 'flex';

    googleBtn.style.display = 'block';
    adminNotice.style.display = 'none';
    const roleName = currentState.selectedRole || 'Company User';
    if (googleLabel) googleLabel.innerText = `Sign in with Google as ${roleName}`;
  }
}

function selectCompanyCategory(catKey) {
  currentState.selectedCompanyType = catKey;
  currentState.workflows = [...COMPANY_CONFIG[catKey].sampleWorkflows];
  currentState.certificates = [...COMPANY_CONFIG[catKey].certificates];
  currentState.hrList = [...COMPANY_CONFIG[catKey].hrRoles];
  currentState.selectedRole = 'Company Admin';

  document.querySelectorAll('.company-card').forEach(card => card.classList.remove('selected'));
  const selectedCard = document.getElementById(`company-card-${catKey}`);
  if (selectedCard) selectedCard.classList.add('selected');

  renderHrRoles();
}

function renderCompanyCategories() {
  const container = document.getElementById('company-grid-container');
  if (!container) return;

  container.innerHTML = Object.keys(COMPANY_CONFIG).map(key => {
    const item = COMPANY_CONFIG[key];
    const isSelected = key === currentState.selectedCompanyType ? 'selected' : '';
    return `
      <div class="company-card ${isSelected}" id="company-card-${key}" onclick="selectCompanyCategory('${key}')">
        <div class="company-icon-box">
          <iconify-icon icon="${item.icon}" style="color: ${item.color};"></iconify-icon>
        </div>
        <div>
          <div class="company-title">${item.name}</div>
          <div class="company-desc">${item.desc}</div>
        </div>
      </div>
    `;
  }).join('');
}

function selectHrRole(roleName, isAdmin = false) {
  currentState.selectedRole = roleName;

  const googleLabel = document.getElementById('google-btn-label');
  const adminLabel = document.getElementById('admin-btn-label');

  if (isAdmin || roleName === 'Company Admin') {
    selectUserType('admin');
    if (adminLabel) adminLabel.innerText = `Log In as Company Admin via Security Link`;
  } else {
    selectUserType('company');
    if (googleLabel) googleLabel.innerText = `Sign in with Google as ${roleName}`;
    if (adminLabel) adminLabel.innerText = `Log In via Unique Admin Token Link`;
  }

  renderHrRoles();
  showToast(`👤 Active Personnel Role set to: ${roleName}`);
}

function promptAddCustomRole() {
  const roleName = prompt("Enter new HR / Personnel Role for your company:");
  if (roleName && roleName.trim() !== "") {
    const trimmed = roleName.trim();
    const initials = trimmed.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2) || 'HR';
    const newRole = {
      id: 'hr-custom-' + Date.now(),
      name: trimmed,
      dept: 'Custom Department',
      access: 'Workflow Approver',
      avatar: initials,
      email: `${trimmed.toLowerCase().replace(/\s+/g, '')}@company.com`
    };

    currentState.hrList.push(newRole);
    currentState.selectedRole = trimmed;
    renderHrRoles();
    showToast(`✨ Added & Selected custom role: "${trimmed}"`);
  }
}

function renderHrRoles() {
  const container = document.getElementById('hr-roles-container');
  const company = COMPANY_CONFIG[currentState.selectedCompanyType];
  if (!container || !company) return;

  if (!currentState.selectedRole) {
    currentState.selectedRole = 'Company Admin';
  }

  const isAdminSelected = currentState.selectedRole === 'Company Admin' ? 'selected' : '';

  const hrHtml = currentState.hrList.map(role => {
    const isSelected = currentState.selectedRole === role.name ? 'selected' : '';
    return `
      <div class="hr-tag ${isSelected}" onclick="selectHrRole('${role.name}', false)" title="Click to choose ${role.name}">
        <iconify-icon icon="${isSelected ? 'tabler:circle-check-filled' : 'tabler:user-check'}" style="color: ${isSelected ? 'white' : 'var(--brand-teal)'};"></iconify-icon>
        <span>${role.name}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="hr-tag admin-badge ${isAdminSelected}" onclick="selectHrRole('Company Admin', true)" title="Click to choose Company Admin">
      <iconify-icon icon="${isAdminSelected ? 'tabler:shield-check-filled' : 'tabler:shield-check'}"></iconify-icon>
      <span>Company Admin</span>
    </div>
    ${hrHtml}
    <div class="hr-tag-add" onclick="promptAddCustomRole()" title="Add your own custom HR role">
      <iconify-icon icon="tabler:plus"></iconify-icon>
      <span>Add Custom Role</span>
    </div>
  `;
}

// 5. LOGIN HANDLERS
function applyUserRolePermissions() {
  const isAdmin = currentState.user && currentState.user.isAdmin;

  // Sidebar navigation elements
  const navWorkflows = document.getElementById('nav-tab-workflows');
  const navHr = document.getElementById('nav-tab-hr');
  const navLegal = document.getElementById('nav-tab-legal');
  
  // Header action button (+ New Workflow)
  const headerNewBtn = document.getElementById('btn-header-new-wf');

  if (navWorkflows) navWorkflows.style.display = isAdmin ? 'block' : 'none';
  if (navHr) navHr.style.display = isAdmin ? 'block' : 'none';
  if (navLegal) navLegal.style.display = isAdmin ? 'block' : 'none';
  if (headerNewBtn) headerNewBtn.style.display = isAdmin ? 'inline-flex' : 'none';
}

function handleGoogleLogin() {
  const company = COMPANY_CONFIG[currentState.selectedCompanyType];
  
  if (currentState.selectedUserType === 'client') {
    // Open Client Info Verification Modal for Name & Phone Number
    document.getElementById('client-info-modal').classList.add('active');
    showToast(`🔑 Google Auth Verified! Please enter your Client contact details.`);
    return;
  }

  const roleName = currentState.selectedRole || 'Company User';
  const roleObj = currentState.hrList.find(r => r.name === roleName);

  currentState.user = {
    name: roleObj ? roleObj.name : 'Kritan Pradhan',
    email: roleObj ? roleObj.email : `user@${currentState.selectedCompanyType}agency.com`,
    role: `${roleName} (${company.name})`,
    isAdmin: false,
    avatar: roleObj ? roleObj.avatar : 'KP'
  };

  applyUserRolePermissions();
  showToast(`Welcome back, ${currentState.user.name}! Signed in via Google as ${roleName}.`);
  switchScreen('dashboard-screen');
  renderDashboard();
}

function submitClientInfo(e) {
  e.preventDefault();
  const fullName = document.getElementById('input-client-fullname').value;
  const phone = document.getElementById('input-client-phone').value;
  const org = document.getElementById('input-client-org').value || 'Client Enterprise';
  const company = COMPANY_CONFIG[currentState.selectedCompanyType];

  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2) || 'CL';

  currentState.user = {
    name: fullName,
    email: `client@${org.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: phone,
    role: `Client Approver (${org})`,
    isAdmin: false,
    avatar: initials
  };

  closeModal('client-info-modal');
  applyUserRolePermissions();
  showToast(`✅ Profile Verified! Welcome ${fullName} (${phone}).`);
  switchScreen('dashboard-screen');
  renderDashboard();
  switchTab('tab-approvals');
}

function sendFeedbackMessage(e) {
  e.preventDefault();
  const input = document.getElementById('chat-input-field');
  const container = document.getElementById('chat-messages-container');
  if (!input || !container || !input.value.trim()) return;

  const text = input.value.trim();

  const msgDiv = document.createElement('div');
  msgDiv.className = 'message-bubble client';
  msgDiv.innerHTML = `
    <div>${text}</div>
    <div class="message-meta">Just now • ${currentState.user ? currentState.user.name : 'Client'}</div>
  `;

  container.appendChild(msgDiv);
  input.value = '';
  container.scrollTop = container.scrollHeight;

  showToast('💬 Feedback sent to Agency Team!');

  setTimeout(() => {
    const replyDiv = document.createElement('div');
    replyDiv.className = 'message-bubble agency';
    replyDiv.innerHTML = `
      <div>Received your feedback: <em>"${text}"</em>. Our team is updating the asset accordingly!</div>
      <div class="message-meta">Just now • Agency Team Lead</div>
    `;
    container.appendChild(replyDiv);
    container.scrollTop = container.scrollHeight;
  }, 1500);
}

function handleAdminLinkLogin() {
  const company = COMPANY_CONFIG[currentState.selectedCompanyType];
  const useridInput = document.getElementById('input-admin-userid');
  const passkeyInput = document.getElementById('input-admin-passkey');

  const inputId = useridInput ? useridInput.value.trim() : '';
  const inputPass = passkeyInput ? passkeyInput.value.trim() : '';

  if (inputId !== currentState.adminId || inputPass !== currentState.adminPass) {
    showToast(`❌ Invalid Admin Credentials! Use ID: "${currentState.adminId}" & Password.`);
    return;
  }

  currentState.user = {
    name: `System Admin (${inputId})`,
    email: `admin@${currentState.selectedCompanyType}.pragati.io`,
    role: `🔒 System Master Admin (${company.name})`,
    isAdmin: true,
    avatar: 'SA'
  };

  applyUserRolePermissions();
  showToast(`🔓 System Master Control Unlocked for Admin ID: "${inputId}"!`);
  switchScreen('dashboard-screen');
  renderDashboard();
}

function saveAdminCredentials(e) {
  e.preventDefault();
  const newId = document.getElementById('setting-admin-id').value.trim();
  const newPass = document.getElementById('setting-admin-pass').value.trim();

  if (newId && newPass) {
    currentState.adminId = newId;
    currentState.adminPass = newPass;
    showToast(`✅ Saved! System Admin User ID set to "${newId}".`);
  }
}

function handleLogout() {
  currentState.user = null;
  history.replaceState(null, '', window.location.pathname);
  switchScreen('auth-screen');
  showToast('🔒 Logged out successfully. Returned to login page.');
}

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
}

// 6. DASHBOARD & TAB VIEW SWITCHING SYSTEM
function switchTab(tabId) {
  const adminOnlyTabs = ['tab-workflows', 'tab-hr', 'tab-legal'];
  
  if (adminOnlyTabs.includes(tabId) && (!currentState.user || !currentState.user.isAdmin)) {
    showToast('🔒 Admin Security Pass Required: Access to Workflows, HR & Legal is restricted exclusively to Admin accounts.');
    return;
  }

  currentState.activeTab = tabId;

  // Update active sidebar link styling
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const activeNavItem = document.getElementById(`nav-${tabId}`);
  if (activeNavItem) activeNavItem.classList.add('active');

  // Show active tab container
  document.querySelectorAll('.dashboard-tab').forEach(tab => tab.classList.remove('active'));
  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add('active');

  // Render tab content
  if (tabId === 'tab-dashboard') renderDashboard();
  if (tabId === 'tab-workflows') renderWorkflowsTab();
  if (tabId === 'tab-approvals') renderApprovalQueueTab();
  if (tabId === 'tab-hr') renderHrTab();
  if (tabId === 'tab-legal') renderLegalTab();
  if (tabId === 'tab-settings') renderSettingsTab();
}

// 7. TAB RENDERERS

function renderDashboard() {
  const company = COMPANY_CONFIG[currentState.selectedCompanyType];

  document.getElementById('display-user-name').innerText = currentState.user ? currentState.user.name : 'User';
  document.getElementById('display-user-role').innerText = currentState.user ? currentState.user.role : 'Member';
  document.getElementById('display-user-avatar').innerText = currentState.user ? currentState.user.avatar : 'U';
  document.getElementById('display-company-pill').innerHTML = `
    <iconify-icon icon="${company.icon}" style="color: ${company.color}; font-size: 18px;"></iconify-icon>
    <span>${company.name} Workflow</span>
  `;

  renderWorkflowTable();
  renderDashboardHrList();
}

function renderWorkflowTable() {
  const tbody = document.getElementById('workflow-table-body');
  if (!tbody) return;

  tbody.innerHTML = currentState.workflows.map(wf => `
    <tr>
      <td>
        <div class="project-cell">
          <div class="project-icon">
            <iconify-icon icon="tabler:briefcase"></iconify-icon>
          </div>
          <div>
            <div class="project-name">${wf.title}</div>
            <div class="project-client">Client: ${wf.client}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="status-badge ${wf.status}">
          <iconify-icon icon="tabler:circle-dot"></iconify-icon>
          ${wf.stage}
        </span>
      </td>
      <td>
        <div style="font-weight: 600; font-size: 13px; color: var(--brand-navy);">${wf.hr}</div>
        <div style="font-size: 11px; color: var(--text-muted);">Assigned HR</div>
      </td>
      <td>${wf.date}</td>
      <td>
        <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="openApprovalModal('${wf.id}')">
          View & Approve
        </button>
      </td>
    </tr>
  `).join('');
}

function renderDashboardHrList() {
  const container = document.getElementById('dashboard-hr-list');
  if (!container) return;

  container.innerHTML = currentState.hrList.map(hr => `
    <div class="hr-item">
      <div class="hr-user-box">
        <div class="hr-avatar">${hr.avatar}</div>
        <div>
          <div class="hr-role-title">${hr.name}</div>
          <div class="hr-role-dept">${hr.dept}</div>
        </div>
      </div>
      <span class="permission-pill">${hr.access}</span>
    </div>
  `).join('');
}

// 8. DEDICATED WORKFLOWS TAB
function renderWorkflowsTab(filter = 'all') {
  const container = document.getElementById('full-workflows-container');
  if (!container) return;

  let filtered = currentState.workflows;
  if (filter !== 'all') {
    filtered = currentState.workflows.filter(w => w.status === filter);
  }

  container.innerHTML = filtered.map(wf => `
    <div class="card-section" style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div class="project-cell">
          <div class="project-icon">
            <iconify-icon icon="tabler:file-check"></iconify-icon>
          </div>
          <div>
            <div class="project-name" style="font-size: 16px;">${wf.title}</div>
            <div class="project-client">Client: ${wf.client} • ID: ${wf.id} • Lead: ${wf.hr}</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="status-badge ${wf.status}">${wf.stage}</span>
          <button class="btn-secondary" style="font-size: 12px; padding: 6px 12px;" onclick="copyApprovalLink('${wf.id}')">
            <iconify-icon icon="tabler:link"></iconify-icon>
            Copy Link
          </button>
          <button class="btn-secondary" style="font-size: 12px; padding: 6px 12px; color: var(--brand-teal); border-color: var(--brand-teal);" onclick="editWorkflow('${wf.id}')" title="Admin permissions required">
            <iconify-icon icon="tabler:pencil"></iconify-icon>
            Edit Workflow
          </button>
          <button class="btn-primary" style="font-size: 12px; padding: 6px 14px;" onclick="openApprovalModal('${wf.id}')">
            Manage Approval
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function editWorkflow(wfId) {
  if (!currentState.user || !currentState.user.isAdmin) {
    showToast('🔒 Access Denied: Only System & Company Admins have permissions to edit workflows.');
    return;
  }
  const wf = currentState.workflows.find(w => w.id === wfId);
  if (!wf) return;
  const newTitle = prompt("Edit Workflow Title (Admin Only):", wf.title);
  if (newTitle && newTitle.trim() !== "") {
    wf.title = newTitle.trim();
    renderWorkflowTable();
    if (currentState.activeTab === 'tab-workflows') renderWorkflowsTab();
    showToast(`✏️ Admin Edit: Updated Workflow "${wf.id}" title to "${newTitle.trim()}".`);
  }
}

function filterWorkflows(status) {
  renderWorkflowsTab(status);
  showToast(`Filtered workflows by status: ${status.toUpperCase()}`);
}

// 9. DEDICATED APPROVAL QUEUE TAB
function renderApprovalQueueTab() {
  const container = document.getElementById('approval-queue-container');
  if (!container) return;

  const pendingList = currentState.workflows.filter(w => w.status === 'pending');

  if (pendingList.length === 0) {
    container.innerHTML = `
      <div class="card-section" style="text-align: center; padding: 48px;">
        <iconify-icon icon="tabler:circle-check-filled" style="font-size: 48px; color: var(--brand-green); margin-bottom: 12px;"></iconify-icon>
        <h3 style="margin-bottom: 6px;">All Approvals Clear!</h3>
        <p style="color: var(--text-muted); font-size: 14px;">No pending client sign-offs remaining in queue.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = pendingList.map(wf => `
    <div class="card-section" style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
        <div>
          <span class="status-badge pending" style="margin-bottom: 8px;">Stage 3: Pending Client Approval</span>
          <h3 style="font-size: 18px; color: var(--brand-navy);">${wf.title}</h3>
          <p style="font-size: 13px; color: var(--text-muted);">Client: <strong>${wf.client}</strong> | Assigned HR: <strong>${wf.hr}</strong></p>
        </div>
        <span style="font-size: 12px; color: var(--text-light); font-weight: 600;">Submitted ${wf.date}</span>
      </div>

      <div style="background: #f8fafc; border: 1px solid var(--border-color); padding: 14px; border-radius: var(--radius-md); margin-bottom: 16px; font-size: 13px;">
        <div style="display: flex; items-center; gap: 8px; font-weight: 700; color: var(--brand-navy); margin-bottom: 4px;">
          <iconify-icon icon="tabler:paperclip" style="color: var(--brand-teal);"></iconify-icon>
          Attached Deliverable Asset:
        </div>
        <div style="color: var(--text-muted);">pragati_deliverable_${wf.id.toLowerCase()}_v2.pdf (Timestamped Hash Verification)</div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button class="btn-secondary" style="color: var(--status-rejected);" onclick="rejectWorkflow('${wf.id}')">
          <iconify-icon icon="tabler:x"></iconify-icon>
          Request Revisions
        </button>
        <button class="btn-primary" onclick="approveWorkflow('${wf.id}')">
          <iconify-icon icon="tabler:check"></iconify-icon>
          Approve & Seal Deliverable
        </button>
      </div>
    </div>
  `).join('');
}

// 10. HR & PERSONNEL MANAGEMENT TAB
function renderHrTab() {
  const container = document.getElementById('full-hr-container');
  if (!container) return;

  container.innerHTML = currentState.hrList.map(hr => `
    <div class="card-section" style="margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
      <div class="hr-user-box">
        <div class="hr-avatar" style="width: 48px; height: 48px; font-size: 18px;">${hr.avatar}</div>
        <div>
          <div class="hr-role-title" style="font-size: 16px;">${hr.name}</div>
          <div class="hr-role-dept" style="font-size: 13px;">${hr.dept} • ${hr.email}</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 16px;">
        <span class="permission-pill" style="font-size: 12px; padding: 6px 14px;">${hr.access}</span>
        <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="showToast('Updated permissions for ${hr.name}')">
          Edit Role
        </button>
      </div>
    </div>
  `).join('');
}

function openAddHrModal() {
  document.getElementById('hr-modal').classList.add('active');
}

function submitNewHr(e) {
  e.preventDefault();
  const name = document.getElementById('input-hr-name').value;
  const dept = document.getElementById('input-hr-dept').value;
  const email = document.getElementById('input-hr-email').value;
  const role = document.getElementById('input-hr-role').value;

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  const newHr = {
    id: 'hr-' + Math.floor(Math.random() * 1000),
    name: name,
    dept: dept,
    access: role,
    avatar: initials,
    email: email
  };

  currentState.hrList.push(newHr);
  renderHrRoles();
  renderHrTab();
  closeModal('hr-modal');
  showToast(`👤 New Personnel "${name}" added to company HR list!`);
}

// 11. LEGAL AGREEMENTS & COMPLIANCE TAB
function renderLegalTab() {
  const container = document.getElementById('legal-certificates-container');
  if (!container) return;

  container.innerHTML = currentState.certificates.map(cert => `
    <div class="certificate-card">
      <div class="cert-header">
        <div>
          <div class="cert-title">${cert.project}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Client: ${cert.client}</div>
        </div>
        <span class="status-badge approved">Official Legal Seal</span>
      </div>

      <div style="font-size: 12px; color: var(--text-muted);">
        <div>Signed by: <strong>${cert.signee}</strong></div>
        <div>Timestamp: <strong>${cert.date}</strong></div>
      </div>

      <div>
        <div style="font-size: 11px; font-weight: 700; color: var(--brand-navy); margin-bottom: 4px;">SHA-256 Cryptographic Lock Hash:</div>
        <div class="cert-hash">${cert.hash}</div>
      </div>

      <button class="btn-secondary" style="font-size: 12px; margin-top: 8px; justify-content: center;" onclick="downloadCertificate('${cert.certId}')">
        <iconify-icon icon="tabler:download"></iconify-icon>
        Download Compliance Certificate PDF
      </button>
    </div>
  `).join('');
}

function downloadCertificate(certId) {
  showToast(`📜 Compliance Certificate [${certId}] downloaded.`);
}

// 12. SETTINGS TAB
function renderSettingsTab() {
  const tokenDisplay = document.getElementById('display-admin-token');
  if (tokenDisplay) tokenDisplay.value = `${window.location.origin}${window.location.pathname}?admin_token=${currentState.adminToken}`;
}

function generateNewAdminToken() {
  currentState.adminToken = 'pws_admin_token_' + Math.random().toString(36).substr(2, 10);
  renderSettingsTab();
  showToast('🔑 New Unique Admin Security Link generated!');
}

function copyAdminTokenLink() {
  const input = document.getElementById('display-admin-token');
  if (input) {
    input.select();
    navigator.clipboard.writeText(input.value);
    showToast('📋 Unique Admin Link copied to clipboard!');
  }
}

// 13. WORKFLOW ACTIONS (CREATE, EDIT, APPROVE, REJECT, LINK COPY)
function openCreateModal() {
  if (!currentState.user || !currentState.user.isAdmin) {
    showToast('🔒 Access Denied: Only Admin accounts can create or edit workflows.');
    return;
  }
  const select = document.getElementById('input-wf-hr');
  if (select) {
    select.innerHTML = currentState.hrList.map(r => `<option value="${r.name}">${r.name} (${r.dept})</option>`).join('');
  }
  document.getElementById('create-modal').classList.add('active');
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('active');
}

function submitNewWorkflow(e) {
  e.preventDefault();
  if (!currentState.user || !currentState.user.isAdmin) {
    showToast('🔒 Access Denied: Only Admin accounts can create or edit workflows.');
    closeModal('create-modal');
    return;
  }

  const title = document.getElementById('input-wf-title').value;
  const client = document.getElementById('input-wf-client').value;
  const hrSelect = document.getElementById('input-wf-hr').value;

  const mockHash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

  const newWf = {
    id: 'WF-' + Math.floor(100 + Math.random() * 900),
    title: title,
    client: client,
    stage: 'Client Approval',
    status: 'pending',
    date: 'Just now',
    hr: hrSelect || 'Company Admin',
    hash: mockHash
  };

  currentState.workflows.unshift(newWf);
  renderWorkflowTable();
  if (currentState.activeTab === 'tab-workflows') renderWorkflowsTab();
  if (currentState.activeTab === 'tab-approvals') renderApprovalQueueTab();

  closeModal('create-modal');
  showToast(`🎉 New Workflow "${title}" created and routed to client!`);
}

function openApprovalModal(wfId) {
  const wf = currentState.workflows.find(w => w.id === wfId);
  if (!wf) return;

  document.getElementById('modal-wf-title').innerText = wf.title;
  document.getElementById('modal-wf-client').innerText = `Client: ${wf.client} | ID: ${wf.id}`;
  document.getElementById('modal-wf-hr').innerText = wf.hr;

  document.getElementById('btn-modal-approve').onclick = () => approveWorkflow(wf.id);
  document.getElementById('btn-modal-reject').onclick = () => rejectWorkflow(wf.id);

  document.getElementById('approval-modal').classList.add('active');
}

function approveWorkflow(wfId) {
  const wf = currentState.workflows.find(w => w.id === wfId);
  if (wf) {
    wf.status = 'approved';
    wf.stage = 'Legally Approved';

    // Add to certificates
    const newCert = {
      certId: 'CERT-' + Math.floor(1000 + Math.random() * 9000),
      project: wf.title,
      client: wf.client,
      date: new Date().toISOString().replace('T', ' ').substr(0, 19) + ' UTC',
      hash: wf.hash,
      signee: `Official Approver (${wf.client})`
    };
    currentState.certificates.unshift(newCert);

    renderWorkflowTable();
    if (currentState.activeTab === 'tab-workflows') renderWorkflowsTab();
    if (currentState.activeTab === 'tab-approvals') renderApprovalQueueTab();
    if (currentState.activeTab === 'tab-legal') renderLegalTab();

    closeModal('approval-modal');
    showToast(`✅ "${wf.title}" officially approved by client! Legal Certificate sealed.`);
  }
}

function rejectWorkflow(wfId) {
  const wf = currentState.workflows.find(w => w.id === wfId);
  if (wf) {
    wf.status = 'review';
    wf.stage = 'Revisions Requested';

    renderWorkflowTable();
    if (currentState.activeTab === 'tab-workflows') renderWorkflowsTab();
    if (currentState.activeTab === 'tab-approvals') renderApprovalQueueTab();

    closeModal('approval-modal');
    showToast(`⚠️ Revisions requested for "${wf.title}". Returned to internal team.`);
  }
}

function copyApprovalLink(wfId) {
  const link = `${window.location.origin}${window.location.pathname}?workflow_id=${wfId}`;
  navigator.clipboard.writeText(link);
  showToast(`📋 Client Approval Link copied for ${wfId}`);
}

function setupEventListeners() {}

// 14. TOAST NOTIFICATIONS
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <iconify-icon icon="tabler:info-circle-filled" style="color: var(--brand-teal); font-size: 16px; flex-shrink: 0;"></iconify-icon>
    <span style="line-height: 1.3;">${message}</span>
  `;

  container.appendChild(toast);

  // Disappear after 0.25 seconds (250ms) with quick slide-out transition
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 150);
  }, 250);
}
