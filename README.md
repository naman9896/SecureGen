# SecureGen — Institutional Vault

> A cryptographically secure password and API key generator that runs entirely in your browser. No servers. No logs. No leaks.

![SecureGen](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-green?style=flat-square) ![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square) ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BFF8?style=flat-square&logo=tailwindcss)

---

## What is SecureGen?

SecureGen is a privacy-first credential generation tool built for developers, security teams, and anyone who takes secrets seriously. Every password and API key is generated using the browser's native **Web Crypto API (CSPRNG)** — the same standard used by cryptographic software — with zero network requests and zero data retention.

---

## Features

### Password Generator
- Adjustable length from **8 to 128 characters**
- Toggle character sets — uppercase, lowercase, numbers, symbols
- Option to exclude ambiguous characters (`0`, `O`, `l`, `1`)
- **Real-time strength meter** with entropy calculation (bits)
- One-click copy, eye toggle to reveal/hide, and instant regeneration
- Session history of last 10 generated passwords

### API Key Generator
- Three output formats — **Alphanumeric**, **Hexadecimal**, **Base64**
- Custom prefix support (e.g. `sk-`, `api-`, `sk-prod-`)
- Key lengths from **16 to 64 bytes**
- **Batch generation** — up to 100 keys at once
- Copy individual keys or copy all at once
- Export as **TXT** or **CSV**
- **QR code** modal for every generated key

### General
- Fully **client-side** — no backend, no analytics, no tracking
- **Dark / Light mode** toggle, persisted across sessions
- Responsive layout — sidebar navigation on desktop, bottom tab bar on mobile
- Glassmorphism "Copied!" toast with slide-up animation
- Deployment-ready for **Netlify**, Vercel, or any static host

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | Lucide React |
| QR Codes | `qrcode.react` |
| Crypto | Web Crypto API (built-in) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
git clone https://github.com/your-username/securegen.git
cd securegen
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output is in the `dist/` folder — drop it anywhere that serves static files.

---

## Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Push this repo to GitHub
2. Connect the repo in the Netlify dashboard
3. Set build command to `npm run build` and publish directory to `dist`
4. Deploy — done

---

## Project Structure

```
src/
├── utils/
│   ├── crypto.js          # CSPRNG-based generation (passwords & API keys)
│   └── strength.js        # Entropy calculation and strength scoring
├── hooks/
│   ├── usePasswordGenerator.js
│   ├── useApiKeyGenerator.js
│   ├── useClipboard.js
│   └── useTheme.js
└── components/
    ├── Layout/            # Sidebar, Header, MobileNav
    ├── Common/            # Button, Toggle, Checkbox, Toast
    ├── PasswordGenerator/ # Generator, Display, StrengthMeter, History
    ├── ApiKeyGenerator/   # Generator, KeyCard, QRModal
    └── Settings/
```

---

## Security Design

- **CSPRNG only** — `crypto.getRandomValues()` with rejection sampling to eliminate modulo bias
- **No Math.random()** — ever
- **No network requests** — generation is 100% offline-capable
- **No storage** — nothing is written to `localStorage` except your theme preference
- All logic lives in `src/utils/crypto.js` and is auditable in one file

---

## License

MIT © 2026
