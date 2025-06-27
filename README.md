# KroniCode 🕰️

**You write code, it writes history.**

KroniCode is a semi-automated time tracking desktop app designed for developers using [Tempo](https://www.tempo.io/) and Jira. Built with Electron, React, and Vite, it helps you stay on top of your logs without interrupting your workflow.

---

## 🚀 Features

- 🧭 Onboarding Tour to help first-time users get oriented
- ⏱️ Semi-automated time logging via Tempo + Jira integration
- 🔔 Customizable interval reminders for effortless tracking
- ⏸️ Option to pause auto reminders via the tray
- 🌙 Switch between light and dark themes
- 🔐 Secure token storage with `keytar`
- ⚡ Fast desktop performance with Electron + Vite
- 🛠️ Update checks with progress feedback and toast notifications
- 🧠 Smart error handling with a global error boundary
- 🪟 "Start with system" setting for seamless boot-up integration
- 📅 Tray display shows last successful time log

---

## 🧠 Tech Stack

- **Electron** – for building the desktop experience  
- **React + Vite** – for the blazing-fast frontend  
- **Keytar** – for secure credential storage  
- **Jira/Tempo APIs** – for seamless time entry integration

---

## 🚦 Setup Wizard

When you launch KroniCode for the first time, the **Setup Wizard** will guide you through securely entering your Jira and Tempo API credentials. This ensures seamless integration and secure token storage.

The setup process includes:

1. **Enter Jira credentials:**  
   - Jira domain  
   - Jira email  
   - Jira API token  

2. **Enter Tempo API token**

3. **Confirm and save tokens securely** using encrypted storage (`keytar`).

4. **Customize your reminder interval** (how often you want the time logging popup to appear).

Once completed, the wizard closes and the app is ready to start tracking your time automatically!

You can always visit **Settings** if you need to update your tokens or preferences or you can revisit the wizard via the **Tray**.

---

## 🛠️ Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run in development mode
npm run dev
