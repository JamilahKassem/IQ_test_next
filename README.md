
# Frontend App (Next.js)

This is the frontend application built with Next.js that connects to a backend server via WebSockets on ports 9001 and 9002. The WebSocket ports and other connection settings are defined in the frontend config file.

## Tech stack

- **Framework**: Next.js (React)
- **Language**: JavaScript / TypeScript (depending on your setup)
- **Runtime**: Node.js
- **Communication**: WebSockets to ports 9001 and 9002 of the backend server

## Prerequisites

Before you start, make sure you have:

- Node.js installed (LTS version recommended)
- npm installed (comes bundled with Node.js)

You can verify the installation with:

```bash
node -v
npm -v
```

## Installation

1. Navigate to the frontend project directory (where this README and `package.json` are located):

   ```bash
   cd path/to/frontend
   ```

2. Install all dependencies:

   ```bash
   npm install
   ```

   This reads `package.json` and installs all required packages into `node_modules`.

## Configuration

The frontend uses WebSockets to connect to the backend server on ports **9001** and **9002**. These ports (and any base URLs) are defined in the config file within the frontend project.

1. Open the config file (for example `config.js`, `config.ts`, or similar) in the frontend project.
2. Confirm that the WebSocket URLs point to your backend server, for example:

   ```js
   const SOCKET_PORT_1 = 9001;
   const SOCKET_PORT_2 = 9002;
   const SOCKET_URL_1 = `ws://localhost:${SOCKET_PORT_1}`;
   const SOCKET_URL_2 = `ws://localhost:${SOCKET_PORT_2}`;
   ```

3. If your backend runs on a different host or you are deploying, update these values accordingly.

## Running the frontend

From the frontend project directory:

```bash
npm run dev
```

This starts the Next.js development server, usually at:

```text
http://localhost:3000
```

Open this URL in your browser to access the app.

> Note: The command should be `npm run dev`, not `node run dev`.

Make sure your backend server is running and listening on ports 9001 and 9002 so the WebSocket connections from the frontend can be established successfully.

## Typical workflow

1. Start the database server (with the schema loaded from the provided SQL file).
2. Start the backend server (listening on ports 9001 and 9002 for WebSockets).
3. Start the frontend:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser and interact with the app.

## Troubleshooting

- **WebSockets not connecting**
  - Check that the backend server is running and listening on ports 9001 and 9002.
  - Verify that the WebSocket URLs in the frontend config file match the backend host and ports.
- **Build or dev server errors**
  - Make sure `npm install` completed successfully.
  - Delete the `node_modules` folder and run `npm install` again if necessary.
