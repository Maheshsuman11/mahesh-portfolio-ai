# 🚀 Mahesh Mali Personal Platform

A modern full-stack personal platform combining a Portfolio, AI Chatbot, Admin Dashboard, User System, and Lead Generation — all in a single static website.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [How to Open the Website](#how-to-open-the-website)
4. [Admin Login](#admin-login)
5. [Managing Projects](#managing-projects)
6. [Managing Chatbot Knowledge](#managing-chatbot-knowledge)
7. [Managing Users](#managing-users)
8. [Managing Leads](#managing-leads)
9. [Google Sheets Integration](#google-sheets-integration)
10. [Deploy on GitHub Pages](#deploy-on-github-pages)
11. [PWA Installation](#pwa-installation)
12. [Customization Guide](#customization-guide)

---

## 🌟 Project Overview

This platform includes:

- **Portfolio Website** — Home, About, Projects, Contact pages with modern dark design
- **AI Chatbot Assistant** — Keyword-based NLP chatbot on the Assistant page
- **Lead Generation** — Captures visitor details after chatbot conversations
- **User System** — Optional sign-up/login for visitors
- **Admin Dashboard** — Full control over all content, users, leads, and settings
- **PWA Support** — Installable like a mobile app
- **localStorage** — All data stored in the browser (no server needed)
- **Google Sheets Sync** — Optional: sync leads and users to a Google Sheet

---

## 📁 File Structure

```
mahesh-platform/
│
├── index.html          ← Main public website (SPA - Single Page App)
├── admin.html          ← Admin panel (password protected)
│
├── style.css           ← Public website styles
├── admin.css           ← Admin panel styles
│
├── script.js           ← Main website logic (routing, chatbot, auth)
├── admin.js            ← Admin panel logic (CRUD operations)
│
├── manifest.json       ← PWA manifest (app install info)
├── service-worker.js   ← PWA offline caching
│
├── database.json       ← Seed data reference (not loaded at runtime)
│
└── README.md           ← This file
```

**Total: 10 files** (within the 5-15 requirement)

---

## 🌐 How to Open the Website

### Method 1 — Simple (Local File)
1. Download or unzip all files into one folder
2. Double-click `index.html` to open in your browser
3. That's it! No server needed.

> **Note:** Some PWA features and service workers require a web server. Use Method 2 for best results.

### Method 2 — Local Server (Recommended)
If you have Python installed:
```bash
cd mahesh-platform
python3 -m http.server 8080
# Then open: http://localhost:8080
```

If you have Node.js:
```bash
npx serve .
# Then open the URL shown in terminal
```

---

## 🔐 Admin Login

Access the admin panel at: `admin.html`

| Field     | Value         |
|-----------|---------------|
| Mobile    | `9039473519`  |
| Password  | `M@hesh@2026`    |

> ⚠️ **Important:** Change these credentials after your first login via Admin Panel → Content Editor → Admin Credentials section.

### Admin Panel Sections:

| Section               | What you can do |
|----------------------|-----------------|
| 📊 Dashboard          | View stats, recent leads at a glance |
| 🚀 Projects Manager   | Add, edit, delete portfolio projects |
| 👥 Users Manager      | View users, reset passwords, block/unblock |
| 📋 Leads Manager      | View leads, mark as contacted, export CSV |
| 🧠 Chatbot KB         | Add/edit/delete chatbot knowledge entries |
| 🗺️ Navigation         | Add/remove/reorder nav links |
| ✏️ Content Editor     | Edit hero text, about section, contact info |
| ⚙️ Settings           | Google Sheets webhook, data export/reset |

---

## 🚀 Managing Projects

### Add a New Project (Admin Panel)
1. Go to `admin.html` and log in
2. Click **Projects Manager** in the sidebar
3. Click **+ Add Project**
4. Fill in: Title, Description, Image URL, Tags, Link, Date
5. Click **Save Project**

### Project Fields:
| Field       | Required | Description |
|-------------|----------|-------------|
| Title       | ✅ Yes   | Project name |
| Description | ✅ Yes   | Short description |
| Image URL   | No       | Unsplash, Imgur, or any image URL |
| Tags        | No       | Comma-separated: `React, AI, Node.js` |
| Link        | No       | URL to live project or GitHub repo |
| Date        | No       | Project completion date |
| Featured    | No       | Show in featured section |

---

## 🧠 Managing Chatbot Knowledge

The chatbot uses keyword matching — when a user's message contains a keyword, the bot returns the linked response.

### Add a New Knowledge Entry:
1. Go to Admin Panel → **Chatbot KB**
2. Click **+ Add Entry**
3. **Keywords:** Enter comma-separated trigger words
   - Example: `hello, hi, hey, greetings`
4. **Response:** Type what the bot should say
5. Click **Save Entry**

### Tips for Good Chatbot Responses:
- Add emojis to make responses feel friendly 😊
- Include actionable suggestions: "Check out the Projects page!"
- Cover variations: `cost, price, how much, rate, charge`
- Add a fallback for unknown questions (already included)

---

## 👥 Managing Users

Users can sign up at the public website (optional). Admin can:

| Action          | How |
|-----------------|-----|
| View users      | Admin → Users Manager |
| Reset password  | Click 🔑 Reset PW next to user |
| Block user      | Click 🚫 Block — user cannot login |
| Unblock user    | Click ✅ Unblock |
| Delete user     | Click 🗑️ |

> **Note:** Admin cannot be deleted or blocked through the Users panel. Change admin credentials in Content Editor.

---

## 📋 Managing Leads

Leads are collected when visitors submit their details via:
- The **chatbot** (after 3 messages, a capture form appears)
- The **Contact page** form

### Lead Actions:
| Action        | How |
|---------------|-----|
| View leads    | Admin → Leads Manager |
| Mark done     | Click ✅ Mark Done |
| Reopen        | Click ↩️ Reopen |
| Delete        | Click 🗑️ |
| Export CSV    | Click 📤 Export CSV button |

---

## 📊 Google Sheets Integration (Optional)

To automatically sync leads and user registrations to a Google Sheet:

### Step 1: Create Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Paste this code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
  const data  = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.type || 'lead',
    data.name || '',
    data.phone || '',
    data.message || '',
    data.source || ''
  ]);
  return ContentService.createTextOutput('OK');
}
```

### Step 2: Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Copy the deployment URL

### Step 3: Add URL to Admin Settings
1. Admin Panel → Settings
2. Paste URL in **Google Sheets Webhook URL**
3. Click **Save Settings**

---

## 🌐 Deploy on GitHub Pages

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click **New Repository**
3. Name it: `mahesh-platform` (or anything)
4. Set to **Public**

### Step 2: Upload Files
**Option A — GitHub Web Interface:**
1. Open your repo
2. Click **uploading an existing file**
3. Drag all 10 files and drop them
4. Click **Commit changes**

**Option B — Git Command Line:**
```bash
git init
git add .
git commit -m "Initial commit: Mahesh Mali Platform"
git remote add origin https://github.com/YOUR_USERNAME/mahesh-platform.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. In your repo, click **Settings**
2. Scroll to **Pages** section
3. Source: **Deploy from a branch**
4. Branch: **main** → **/ (root)**
5. Click **Save**

Your site will be live at:
`https://YOUR_USERNAME.github.io/mahesh-platform/`

> ⏱️ It may take 2-5 minutes for GitHub Pages to build.

---

## 📱 PWA Installation

The website can be installed as a mobile app:

### On Android (Chrome):
1. Open the website in Chrome
2. Tap the **⋮ menu** (top right)
3. Tap **Add to Home Screen**
4. Tap **Add**

### On iPhone (Safari):
1. Open the website in Safari
2. Tap the **Share** button (bottom center)
3. Tap **Add to Home Screen**
4. Tap **Add**

### On Desktop (Chrome/Edge):
1. Look for the **install icon** in the address bar
2. Click it and confirm

---

## 🎨 Customization Guide

### Change Personal Info:
- Admin Panel → **Content Editor**
- Update Hero, About, and Contact sections

### Change Colors:
Open `style.css` and find the `:root` section:
```css
:root {
  --cyan:  #00c8ff;   /* Main accent color */
  --amber: #ff9500;   /* Secondary accent */
  --bg-deep: #060b14; /* Background */
}
```

### Change Fonts:
In `style.css`, replace the Google Fonts import and update:
```css
--font-display: 'Syne', sans-serif;
--font-body:    'DM Sans', sans-serif;
```

### Add a New Page:
1. Add a new page div in `index.html`:
```html
<div class="page" id="blog-page">
  <!-- Your page content -->
</div>
```
2. Add it to navigation via Admin Panel → Navigation Manager

---

## 🔧 Technical Notes

- **No backend required** — All data stored in `localStorage`
- **No API keys needed** — Everything runs client-side
- **Google Sheets is optional** — Platform works perfectly without it
- **Data persists** — localStorage data survives browser restarts
- **Data is browser-specific** — Data stored in Chrome won't appear in Firefox

---

## 📝 Changelog

| Version | Changes |
|---------|---------|
| 1.0.0   | Initial release — Full platform with all features |

---

## 📄 License

Built for personal use by **Mahesh Mali**. Free to use and modify.

---

*Built with ❤️ and AI — Mahesh Mali Platform v1.0.0*
