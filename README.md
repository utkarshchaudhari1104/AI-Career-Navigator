# AI Career Navigator

AI Career Navigator is a simple career planning platform for students. It uses HTML, CSS, and JavaScript for the website and Python for the backend.

## What it does

- Shows career recommendations
- Stores a student profile
- Runs a career assessment
- Shows skill gaps and a learning roadmap
- Recommends companies and roles
- Provides a simple resume view

## Project files

- `index.html` is the main page.
- `public/app.css` contains the styles.
- `public/app.js` contains the platform features.
- `public/platform.js` contains platform integrations.
- `server/app.py` runs the Python API and serves the built website.

## Run locally

Install the packages:

```bash
npm install
```

Start the website and Python server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser. The Python API runs on `http://localhost:5000`.

## Build

```bash
npm run build
```

To check the JavaScript and Python files:

```bash
npm run lint
```

## Environment variables

The Python server supports these optional variables:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
```
