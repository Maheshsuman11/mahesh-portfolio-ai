/**
 * MAHESH MALI PLATFORM — Main Script
 * Handles: SPA routing, chatbot, user auth, data layer, animations
 */

'use strict';

/* ══════════════════════════════════════════════════
   DATA LAYER — localStorage wrapper
══════════════════════════════════════════════════ */

const DB = {
  KEYS: {
    PROJECTS:   'mm_projects',
    KNOWLEDGE:  'mm_knowledge',
    USERS:      'mm_users',
    LEADS:      'mm_leads',
    NAVIGATION: 'mm_navigation',
    CONTENT:    'mm_content',
    SETTINGS:   'mm_settings',
    SESSION:    'mm_session',
    ADMIN:      'mm_admin'
  },

  get(key) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },

  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch { return false; }
  },

  // Seed data from database.json (inline for static hosting)
  seed() {
    const seedData = {
      navigation: [
        { id: 'nav-1', label: 'Home',      target: 'home',      order: 1, visible: true },
        { id: 'nav-2', label: 'About',     target: 'about',     order: 2, visible: true },
        { id: 'nav-3', label: 'Projects',  target: 'projects',  order: 3, visible: true },
        { id: 'nav-4', label: 'Assistant', target: 'assistant', order: 4, visible: true },
        { id: 'nav-5', label: 'Contact',   target: 'contact',   order: 5, visible: true }
      ],
      projects: [
        { id:'proj-1', title:'AI Chat Platform', description:'A real-time chat application powered by natural language processing. Features smart responses, context awareness, and multi-user support.', image:'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80', tags:['AI','JavaScript','Node.js'], link:'#', featured:true, date:'2024-01' },
        { id:'proj-2', title:'E-Commerce Dashboard', description:'Full-stack e-commerce management with real-time analytics, inventory management, and automated reporting tools.', image:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', tags:['React','MongoDB','Express'], link:'#', featured:true, date:'2023-09' },
        { id:'proj-3', title:'Smart Portfolio Builder', description:'A drag-and-drop portfolio builder using AI to suggest optimal layouts and content for professionals.', image:'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80', tags:['Vue.js','AI','CSS'], link:'#', featured:false, date:'2023-06' },
        { id:'proj-4', title:'Lead Intelligence CRM', description:'An intelligent CRM scoring leads with behavioral analytics and predicting conversion probability using machine learning.', image:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', tags:['Python','ML','React'], link:'#', featured:false, date:'2023-03' }
      ],
      knowledge: [
        { id:'kb-1',  keywords:['hello','hi','hey','greetings','good morning','good evening'],       response:'Hello! 👋 I\'m Mahesh\'s AI assistant. I can tell you about his work, skills, and projects. What would you like to know?' },
        { id:'kb-2',  keywords:['who are you','what are you','your name','introduce yourself'],       response:'I\'m an AI assistant built for Mahesh Mali\'s platform. Ask me anything about Mahesh, his projects, or his skills!' },
        { id:'kb-3',  keywords:['mahesh','who is mahesh','about mahesh','tell me about'],             response:'Mahesh Mali is a passionate full-stack developer and AI enthusiast from India. He specialises in building intelligent web applications using JavaScript, React, Node.js, and AI.' },
        { id:'kb-4',  keywords:['skills','technologies','tech stack','what can he do','expertise'],   response:'Mahesh is skilled in: HTML/CSS, JavaScript, React, Node.js, MongoDB, REST APIs, AI/ML Integration, and UI/UX Design. He loves building products that combine great design with intelligence.' },
        { id:'kb-5',  keywords:['projects','work','portfolio','what has he built','what did he make'],response:'Mahesh has built several impressive projects including an AI Chat Platform, E-Commerce Dashboard, Smart Portfolio Builder, and Lead Intelligence CRM. Check out the Projects page for details!' },
        { id:'kb-6',  keywords:['contact','reach','email','phone','hire','work together'],            response:'You can contact Mahesh via the Contact page, or leave your details here and he\'ll personally get back to you! 📧 maheshmali11884@gmail.com' },
        { id:'kb-7',  keywords:['price','cost','how much','rate','charge','freelance'],               response:'Mahesh works on both freelance and full-time projects. Pricing depends on scope. The best approach is to reach out via the Contact page.' },
        { id:'kb-8',  keywords:['available','free','busy','timeline','when can'],                    response:'Mahesh is currently open to new project discussions. Reach out via the Contact page for availability!' },
        { id:'kb-9',  keywords:['experience','years','how long','background'],                       response:'Mahesh has several years of experience in web development and has been building AI-powered applications since AI APIs became widely accessible.' },
        { id:'kb-10', keywords:['help','what can you do','assist','support'],                        response:'I can tell you about Mahesh\'s skills, projects, and services. I can also connect you with Mahesh if you\'d like to work together! Just ask.' },
        { id:'kb-11', keywords:['bye','goodbye','see you','thanks','thank you'],                     response:'Thank you for visiting! 🙏 Feel free to come back anytime. Would you like to leave your contact info so Mahesh can reach out?' },
        { id:'kb-12', keywords:['location','where','based','city','country'],                        response:'Mahesh is based in India and works with clients globally. He\'s available for remote projects worldwide! 🌍' }
      ],
      content: {
        hero: {
          title: "Hi, I'm Mahesh Mali",
          subtitle: 'Mahesh Mali | Developer & AI Assistant Platform',
          description: "I craft intelligent web experiences that bridge human creativity with artificial intelligence.",
          cta_primary: 'View Projects',
          cta_secondary: 'Try Assistant'
        },
        about: {
          title: 'About Me',
          intro: "I'm Mahesh Mali, a passionate full-stack web developer and AI tools enthusiast based in India.",
          body: "My journey in tech started with a curiosity about how things work on the internet. Over time, that curiosity evolved into a deep passion for building intelligent, scalable web applications. I specialise in creating seamless user experiences powered by modern AI technologies.\n\nI believe technology should empower people, not overwhelm them. Every project I build focuses on clarity, performance, and meaningful interaction.",
          skills: ['HTML/CSS','JavaScript','React','Node.js','AI Integration','UI/UX Design','REST APIs','MongoDB'],
          contact_email: 'maheshmali11884@gmail.com',
          contact_phone: '+91 9039473519',
          location: 'India'
        },
        contact: {
          email: 'maheshmali11884@gmail.com',
          phone: '+91 9039473519',
          location: 'India',
          github: 'https://github.com/Maheshsuman11',
        }
      },
      admin: { mobile: '6265897832', password: 'M@hesh@2026' }
    };

    if (!DB.get(DB.KEYS.NAVIGATION)) DB.set(DB.KEYS.NAVIGATION, seedData.navigation);
    if (!DB.get(DB.KEYS.PROJECTS))   DB.set(DB.KEYS.PROJECTS,   seedData.projects);
    if (!DB.get(DB.KEYS.KNOWLEDGE))  DB.set(DB.KEYS.KNOWLEDGE,  seedData.knowledge);
    if (!DB.get(DB.KEYS.CONTENT))    DB.set(DB.KEYS.CONTENT,    seedData.content);
    if (!DB.get(DB.KEYS.ADMIN))      DB.set(DB.KEYS.ADMIN,      seedData.admin);
    if (!DB.get(DB.KEYS.USERS))      DB.set(DB.KEYS.USERS,      []);
    if (!DB.get(DB.KEYS.LEADS))      DB.set(DB.KEYS.LEADS,      []);
  }
};

/* ══════════════════════════════════════════════════
   APP STATE
══════════════════════════════════════════════════ */
const STATE = {
  currentPage:      'home',
  chatMessageCount: 0,
  leadShown:        false,
  currentUser:      null,
  forgotStep:       1,
  forgotMobile:     null,
  sheetsConfigured: false
};

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  DB.seed();
  loadSession();
  buildNavigation();
  loadContent();
  renderProjects();
  initChat();
  setupScrollReveal();
  setupNavbarScroll();

  // Handle hash navigation
  const hash = window.location.hash.replace('#', '');
  if (hash && ['home','about','projects','assistant','contact'].includes(hash)) {
    showPage(hash);
  }

  // Hide loader
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 600);

  // Footer year
  const fy = document.getElementById('footer-year');
  if (fy) fy.textContent = new Date().getFullYear();
});

/* ══════════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════════ */
function buildNavigation() {
  const nav = DB.get(DB.KEYS.NAVIGATION) || [];
  const sorted = nav.filter(n => n.visible).sort((a, b) => a.order - b.order);

  const desktopNav = document.getElementById('nav-links-desktop');
  const mobileNav  = document.getElementById('nav-mobile');
  if (!desktopNav || !mobileNav) return;

  desktopNav.innerHTML = sorted.map(n => `
    <li>
      <button onclick="showPage('${n.target}')" class="nav-btn" data-target="${n.target}">
        ${n.label}
      </button>
    </li>
  `).join('');

  mobileNav.innerHTML = sorted.map(n => `
    <button onclick="showPage('${n.target}'); closeMobileNav();" class="nav-btn" data-target="${n.target}">
      ${n.label}
    </button>
  `).join('');

  updateNavAuth();
}

function updateNavActive() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === STATE.currentPage);
  });
}

function setupNavbarScroll() {
  window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    if (nb) nb.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Hamburger
document.addEventListener('DOMContentLoaded', () => {
  const hb = document.getElementById('hamburger-btn');
  if (hb) hb.addEventListener('click', () => {
    const mn = document.getElementById('nav-mobile');
    if (mn) mn.classList.toggle('open');
  });
});
function closeMobileNav() {
  const mn = document.getElementById('nav-mobile');
  if (mn) mn.classList.remove('open');
}

/* ══════════════════════════════════════════════════
   PAGE ROUTING
══════════════════════════════════════════════════ */
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));

  const target = document.getElementById(pageId + '-page');
  if (target) {
    target.classList.add('active');
    STATE.currentPage = pageId;
    window.history.pushState({}, '', '#' + pageId);
    window.scrollTo({ top: 0, behavior: 'instant' });
    updateNavActive();
    closeMobileNav();

    // Trigger reveal animations
    setTimeout(triggerReveal, 100);
  }
}

/* ══════════════════════════════════════════════════
   CONTENT LOADING
══════════════════════════════════════════════════ */
function loadContent() {
  const content = DB.get(DB.KEYS.CONTENT);
  if (!content) return;

  // Hero
  if (content.hero) {
    setText('hero-title', `Hi, I'm <span class="accent">${content.hero.title.split("'m ")[1] || 'Mahesh Mali'}</span>`);
    setText('hero-subtitle', content.hero.subtitle);
    setText('hero-desc', content.hero.description);
  }

  // About
  if (content.about) {
    const ab = content.about;
    setText('about-intro', ab.intro);
    // Render multi-line body
    const bodyEl = document.getElementById('about-body');
    if (bodyEl) bodyEl.innerHTML = (ab.body || '').split('\n\n').map(p => `<p>${p}</p>`).join('').replace(/<p><\/p>/g, '');
    setText('about-email', ab.contact_email);
    setText('about-phone', ab.contact_phone);
    setText('about-location', ab.location);

    // Skills
    const sg = document.getElementById('skills-grid');
    if (sg && ab.skills) {
      sg.innerHTML = ab.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
    }
  }

  // Contact
  if (content.contact) {
    const ct = content.contact;
    setText('contact-email-text',    ct.email);
    setText('contact-phone-text',    ct.phone);
    setText('contact-location-text', ct.location);
    setAttr('contact-email-link',    'href', `mailto:${ct.email}`);
    setAttr('contact-phone-link',    'href', `tel:${ct.phone}`);
    setAttr('contact-github-link',   'href', ct.github || '#');
    setAttr('contact-linkedin-link', 'href', ct.linkedin || '#');
  }
}

function setText(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
function setAttr(id, attr, val) {
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, val);
}

/* ══════════════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════════════ */
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const projects = DB.get(DB.KEYS.PROJECTS) || [];
  document.getElementById('stat-projects').innerHTML = `${projects.length}<span>+</span>`;

  if (!projects.length) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📂</div><div class="empty-state-text">No projects yet. Add them from the Admin panel.</div></div>`;
    return;
  }

  grid.innerHTML = projects.map(p => `
    <div class="project-card reveal">
      <div class="project-img-wrap">
        ${p.image
          ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.title)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'project-img-placeholder\\'>🚀</div>'">`
          : `<div class="project-img-placeholder">🚀</div>`}
      </div>
      <div class="project-body">
        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="project-tag">${escHtml(t)}</span>`).join('')}
        </div>
        <div class="project-title">${escHtml(p.title)}</div>
        <div class="project-desc">${escHtml(p.description)}</div>
        ${p.link && p.link !== '#'
          ? `<a href="${escHtml(p.link)}" target="_blank" class="project-link">View Project →</a>`
          : `<span class="project-link" style="opacity:.5;cursor:default;">Coming Soon</span>`}
      </div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════
   CHATBOT
══════════════════════════════════════════════════ */
function initChat() {
  addBotMessage("Hello! 👋 I'm Mahesh's AI assistant. Ask me anything about his skills, projects, or how to get in touch!");
}

function getKnowledgeResponse(input) {
  const knowledge = DB.get(DB.KEYS.KNOWLEDGE) || [];
  const lowerInput = input.toLowerCase().trim();

  // Exact/partial keyword match
  for (const entry of knowledge) {
    const keywords = Array.isArray(entry.keywords) ? entry.keywords : [];
    for (const kw of keywords) {
      if (lowerInput.includes(kw.toLowerCase())) {
        return entry.response;
      }
    }
  }

  // Fallback
  return "I'm not sure about that one! 🤔 Try asking about Mahesh's skills, projects, or how to contact him. Or use the Contact page for direct questions!";
}

function addBotMessage(text) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.innerHTML = `
    <div class="msg-avatar bot-av">🤖</div>
    <div class="msg-bubble">${text}</div>
  `;
  container.appendChild(div);
  scrollChat();
}

function addUserMessage(text) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `
    <div class="msg-bubble">${escHtml(text)}</div>
    <div class="msg-avatar user-av">👤</div>
  `;
  container.appendChild(div);
  scrollChat();
}

function showTypingIndicator() {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'chat-msg bot typing-indicator';
  div.id = 'typing-indicator';
  div.innerHTML = `
    <div class="msg-avatar bot-av">🤖</div>
    <div class="typing-dots">
      <span></span><span></span><span></span>
    </div>
  `;
  container.appendChild(div);
  scrollChat();
}

function removeTypingIndicator() {
  const ti = document.getElementById('typing-indicator');
  if (ti) ti.remove();
}

function scrollChat() {
  const container = document.getElementById('chat-messages');
  if (container) container.scrollTop = container.scrollHeight;
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  addUserMessage(text);
  STATE.chatMessageCount++;

  // Show typing animation
  showTypingIndicator();
  const delay = 600 + Math.random() * 800;

  setTimeout(() => {
    removeTypingIndicator();
    const response = getKnowledgeResponse(text);
    addBotMessage(response);

    // Show lead capture after 3 messages
    if (STATE.chatMessageCount >= 3 && !STATE.leadShown) {
      setTimeout(showLeadCapture, 1200);
    }
  }, delay);
}

function sendSuggestion(text) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    sendChatMessage();
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
}

function autoResizeTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function showLeadCapture() {
  STATE.leadShown = true;
  const card = document.getElementById('lead-capture-card');
  if (card) card.classList.remove('hidden');
}

function dismissLead() {
  const card = document.getElementById('lead-capture-card');
  if (card) card.classList.add('hidden');
  addBotMessage("No problem! Feel free to browse the website. If you change your mind, the Contact page is always there 😊");
}

function submitLead() {
  const name    = document.getElementById('lead-name')?.value.trim();
  const phone   = document.getElementById('lead-phone')?.value.trim();
  const message = document.getElementById('lead-message')?.value.trim();

  if (!name || !phone) {
    showToast('Please enter your name and phone number.', 'error');
    return;
  }

  const lead = {
    id:        'lead-' + Date.now(),
    name, phone, message,
    source:    'chatbot',
    date:      new Date().toISOString(),
    contacted: false
  };

  const leads = DB.get(DB.KEYS.LEADS) || [];
  leads.unshift(lead);
  DB.set(DB.KEYS.LEADS, leads);

  // Hide card
  const card = document.getElementById('lead-capture-card');
  if (card) card.classList.add('hidden');

  addBotMessage(`Thank you, ${escHtml(name)}! 🎉 Mahesh will get back to you soon. In the meantime, feel free to explore the Projects page!`);
  showToast('Your details have been saved!', 'success');

  // Try Google Sheets (non-blocking)
  sendToGoogleSheets('lead', lead);
}

/* ══════════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════════ */
function submitContactForm() {
  const name    = document.getElementById('contact-form-name')?.value.trim();
  const contact = document.getElementById('contact-form-contact')?.value.trim();
  const message = document.getElementById('contact-form-message')?.value.trim();

  if (!name || !contact || !message) {
    showToast('Please fill in all fields.', 'error');
    return;
  }

  const lead = {
    id:        'lead-' + Date.now(),
    name, phone: contact, message,
    source:    'contact-form',
    date:      new Date().toISOString(),
    contacted: false
  };

  const leads = DB.get(DB.KEYS.LEADS) || [];
  leads.unshift(lead);
  DB.set(DB.KEYS.LEADS, leads);

  // Clear form
  ['contact-form-name','contact-form-contact','contact-form-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  showToast('Message sent! Mahesh will get back to you shortly.', 'success');
  sendToGoogleSheets('lead', lead);
}

/* ══════════════════════════════════════════════════
   GOOGLE SHEETS API LAYER
   Primary storage = Google Sheets (permanent)
   localStorage = cache (fast local reads)
══════════════════════════════════════════════════ */
const SheetsAPI = {
  getUrl() {
    const s = DB.get(DB.KEYS.SETTINGS) || {};
    return s.sheets_webhook_url || null;
  },
  async post(payload) {
    const url = this.getUrl();
    if (!url) return { success: false, offline: true };
    try {
      const res  = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000)
      });
      const text = await res.text();
      try { return JSON.parse(text); } catch { return { success: true }; }
    } catch (err) {
      console.warn('Sheets request failed:', err.message);
      return { success: false, offline: true };
    }
  },
  async signup(user)                   { return await this.post({ action: 'signup',         ...user }); },
  async login(mobile, password)        { return await this.post({ action: 'login',          mobile, password }); },
  async checkMobile(mobile)            { return await this.post({ action: 'checkMobile',    mobile }); },
  async updatePassword(mobile, newPwd) { return await this.post({ action: 'updatePassword', mobile, newPassword: newPwd }); },
  async saveLead(lead)                 { return await this.post({ action: 'lead',            ...lead }); }
};

// Legacy wrapper — leads & contact form still use this
async function sendToGoogleSheets(type, data) {
  await SheetsAPI.saveLead({ ...data, source: data.source || type });
}

/* ══════════════════════════════════════════════════
   USER AUTHENTICATION
══════════════════════════════════════════════════ */
function loadSession() {
  const settings = DB.get(DB.KEYS.SETTINGS) || {};
  STATE.sheetsConfigured = !!settings.sheets_webhook_url;

  const session = DB.get(DB.KEYS.SESSION);
  if (session && session.mobile) {
    const users = DB.get(DB.KEYS.USERS) || [];
    const user  = users.find(u => u.mobile === session.mobile && !u.blocked);
    if (user) {
      STATE.currentUser = user;
    } else {
      DB.set(DB.KEYS.SESSION, null);
    }
  }
  updateNavAuth();
}

function updateNavAuth() {
  const area = document.getElementById('nav-auth-area');
  if (!area) return;

  if (STATE.currentUser) {
    area.innerHTML = `
      <button class="nav-user-btn" onclick="logoutUser()">
        👤 ${escHtml(STATE.currentUser.name.split(' ')[0])} · Logout
      </button>
    `;
  } else {
    area.innerHTML = `
      <button class="nav-user-btn" onclick="openModal('auth-modal')">
        Sign In
      </button>
    `;
  }
}

function switchAuthTab(tab) {
  const tabs = ['login','signup'];
  tabs.forEach(t => {
    document.getElementById(`tab-${t}`)?.classList.toggle('active', t === tab);
    const fw = document.getElementById(`${t}-form-wrap`);
    if (fw) fw.style.display = t === tab ? '' : 'none';
  });
  const fw = document.getElementById('forgot-form-wrap');
  if (fw) fw.style.display = 'none';
  STATE.forgotStep = 1;
}

function showForgotForm() {
  ['login-form-wrap','signup-form-wrap'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const fw = document.getElementById('forgot-form-wrap');
  if (fw) fw.style.display = '';
  STATE.forgotStep = 1;
  const np = document.getElementById('forgot-new-pass-wrap');
  if (np) np.style.display = 'none';
  const fb = document.getElementById('forgot-btn');
  if (fb) fb.textContent = 'Find Account';
}

async function handleForgotPassword() {
  const mobile = document.getElementById('forgot-mobile')?.value.trim();
  if (!mobile) { showToast('Enter your mobile number.', 'error'); return; }

  const btn = document.getElementById('forgot-btn');

  if (STATE.forgotStep === 1) {
    if (btn) { btn.textContent = 'Checking...'; btn.disabled = true; }

    let found = false;
    const users = DB.get(DB.KEYS.USERS) || [];
    if (users.find(u => u.mobile === mobile)) found = true;

    if (!found && STATE.sheetsConfigured) {
      const res = await SheetsAPI.checkMobile(mobile);
      if (res.success && res.exists) found = true;
    }

    if (btn) { btn.textContent = 'Find Account'; btn.disabled = false; }

    if (!found) { showToast('No account found with this number.', 'error'); return; }

    STATE.forgotStep  = 2;
    STATE.forgotMobile = mobile;
    const np = document.getElementById('forgot-new-pass-wrap');
    if (np) np.style.display = '';
    if (btn) btn.textContent = 'Update Password';
    showToast('Account found! Set your new password.', 'info');

  } else {
    const newPass = document.getElementById('forgot-new-pass')?.value.trim();
    if (!newPass || newPass.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }

    if (btn) { btn.textContent = 'Updating...'; btn.disabled = true; }

    // Update local cache
    const users = DB.get(DB.KEYS.USERS) || [];
    const idx   = users.findIndex(u => u.mobile === (STATE.forgotMobile || mobile));
    if (idx !== -1) { users[idx].password = newPass; DB.set(DB.KEYS.USERS, users); }

    // Update in Sheets
    if (STATE.sheetsConfigured) {
      await SheetsAPI.updatePassword(STATE.forgotMobile || mobile, newPass);
    }

    if (btn) { btn.textContent = 'Update Password'; btn.disabled = false; }
    showToast('Password updated! You can now log in.', 'success');
    closeModal('auth-modal');
    switchAuthTab('login');
  }
}

async function loginUser() {
  const mobile   = document.getElementById('login-mobile')?.value.trim();
  const password = document.getElementById('login-password')?.value;

  if (!mobile || !password) { showToast('Please enter mobile and password.', 'error'); return; }

  const btn = document.getElementById('login-submit-btn');
  if (btn) { btn.textContent = '⏳ Logging in...'; btn.disabled = true; }

  let user     = null;
  let errorMsg = 'Invalid mobile or password.';

  // Step 1: Local cache check (fast)
  const cached = DB.get(DB.KEYS.USERS) || [];
  const local  = cached.find(u => u.mobile === mobile && u.password === password);
  if (local) {
    if (local.blocked) { errorMsg = 'Your account has been blocked. Contact admin.'; }
    else               { user = local; }
  }

  // Step 2: Google Sheets verify (agar configured hai)
  if (!user && STATE.sheetsConfigured) {
    try {
      const res = await SheetsAPI.login(mobile, password);
      if (res.success && res.user) {
        user = res.user;
        // Cache update
        const idx = cached.findIndex(u => u.mobile === mobile);
        if (idx !== -1) cached[idx] = { ...cached[idx], ...user, password };
        else cached.push({ ...user, password });
        DB.set(DB.KEYS.USERS, cached);
      } else if (res.error) {
        errorMsg = res.error;
      }
    } catch (e) { console.warn('Sheets login failed (offline?):', e); }
  }

  if (btn) { btn.textContent = 'Login'; btn.disabled = false; }

  if (!user) { showToast(errorMsg, 'error'); return; }

  STATE.currentUser = user;
  DB.set(DB.KEYS.SESSION, { mobile: user.mobile });
  updateNavAuth();
  closeModal('auth-modal');
  showToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
}

async function signupUser() {
  const name     = document.getElementById('signup-name')?.value.trim();
  const mobile   = document.getElementById('signup-mobile')?.value.trim();
  const password = document.getElementById('signup-password')?.value;

  if (!name || !mobile || !password) { showToast('Please fill all fields.', 'error'); return; }
  if (password.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }
  if (!/^\d{10}$/.test(mobile)) { showToast('Enter a valid 10-digit mobile number.', 'error'); return; }

  const btn = document.getElementById('signup-submit-btn');
  if (btn) { btn.textContent = '⏳ Creating...'; btn.disabled = true; }

  const cached = DB.get(DB.KEYS.USERS) || [];

  // Local duplicate check
  if (cached.find(u => u.mobile === mobile)) {
    showToast('An account with this mobile already exists.', 'error');
    if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }
    return;
  }

  // Sheets duplicate check
  if (STATE.sheetsConfigured) {
    const chk = await SheetsAPI.checkMobile(mobile);
    if (chk.success && chk.exists) {
      showToast('An account with this mobile already exists.', 'error');
      if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }
      return;
    }
  }

  const user = {
    id:       'user-' + Date.now(),
    name, mobile, password,
    blocked:  false,
    joinDate: new Date().toISOString()
  };

  // Save to Sheets (PRIMARY — permanent storage)
  if (STATE.sheetsConfigured) {
    const res = await SheetsAPI.signup(user);
    if (!res.success && !res.offline) {
      showToast(res.error || 'Signup failed. Please try again.', 'error');
      if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }
      return;
    }
  }

  // Save to localStorage (cache)
  cached.push(user);
  DB.set(DB.KEYS.USERS, cached);

  if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }

  STATE.currentUser = user;
  DB.set(DB.KEYS.SESSION, { mobile: user.mobile });
  updateNavAuth();
  closeModal('auth-modal');
  showToast(`Account created! Welcome, ${name.split(' ')[0]}!`, 'success');

  if (!STATE.sheetsConfigured) {
    setTimeout(() => showToast('Tip: Connect Google Sheets in Admin Settings to keep data permanently!', 'info'), 2000);
  }
}

function logoutUser() {
  STATE.currentUser = null;
  DB.set(DB.KEYS.SESSION, null);
  updateNavAuth();
  showToast('Logged out.', 'info');
}

/* ══════════════════════════════════════════════════
   MODAL SYSTEM
══════════════════════════════════════════════════ */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
});

/* ══════════════════════════════════════════════════
   TOAST NOTIFICATIONS
══════════════════════════════════════════════════ */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${escHtml(message)}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

/* ══════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════ */
function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function triggerReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    observer.observe(el);
    // Force visibility for elements already in viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('visible');
  });
}

/* ══════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════ */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
}

/* ══════════════════════════════════════════════════
   PUBLIC API (used by admin to trigger re-renders)
══════════════════════════════════════════════════ */
window.AppAPI = {
  renderProjects,
  buildNavigation,
  loadContent,
  showToast,
  DB
};
