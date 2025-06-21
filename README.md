# Collaborative Whiteboard

A real-time collaborative whiteboard application built using Node.js, Express, and Socket.IO. This project allows multiple users to draw on a shared canvas, seeing each other's drawings in real-time. The interface is designed to be minimalistic and visually appealing, with subtle animations and a clean, modern look.

## Features

- **Real-time Drawing**: Multiple users can draw simultaneously, with updates broadcasted to all connected clients (in local development mode).
- **Minimalistic Design**: Clean and modern interface with grey and black tones, subtle background patterns, and smooth animations.
- **Vercel Deployment**: Deployed version works as a single-user whiteboard demo due to serverless limitations.

## Deployment Modes

### Local Development (Full Collaborative Features)
When running locally, the application supports real-time collaboration using Socket.IO with persistent WebSocket connections.

### Vercel Deployment (Demo Mode)
When deployed on Vercel, the application runs in single-user mode because Vercel's serverless functions don't support persistent WebSocket connections required for Socket.IO.

## Technologies Used

- **Node.js**: Backend server
- **Express**: Web framework for Node.js
- **Socket.IO**: Real-time bidirectional event-based communication (local development only)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/P-FardeenMalik/Collaborative-Whiteboard.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Collaborative-Whiteboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

#### Open your browser and navigate to http://localhost:8080/ to start drawing!

## Vercel Deployment

The application is configured to work with Vercel. When deployed, it automatically switches to single-user mode. The `vercel.json` configuration handles the serverless deployment.

For true real-time collaboration in production, consider deploying to platforms that support persistent connections like Heroku, Railway, or DigitalOcean.

