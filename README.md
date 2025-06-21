# Collaborative Whiteboard

A real-time collaborative whiteboard application built using Node.js, Express, and Socket.IO. This project allows multiple users to draw on a shared canvas, seeing each other's drawings in real-time. The interface is designed to be minimalistic and visually appealing, with subtle animations and a clean, modern look.

## 🎨 Features

- **Mode Selection**: Choose between Single User and Multi-User modes
- **Real-time Drawing**: Multiple users can draw simultaneously with real-time updates
- **Minimalistic Design**: Clean and modern interface with grey and black tones
- **Cross-Platform**: Works on any device with a web browser
- **Visual Distinction**: Different colors for different users in multi-user mode

## 🚀 Usage Modes

### 🤝 Multi-User Mode
- **Local Development**: True real-time collaboration using Socket.IO
- **Vercel Deployment**: Near real-time collaboration using API polling
- **Visual Feedback**: Blue lines for other users, black lines for you
- **Perfect for**: Team collaboration, brainstorming, shared drawing sessions

### 👤 Single User Mode  
- **Private Drawing**: No data sharing with other users
- **Full Performance**: No network overhead
- **Perfect for**: Personal sketches, private notes, offline drawing

## 📱 Quick Access URLs

- **Main Page**: `https://your-app.vercel.app/` (shows mode selector)
- **Direct Multi-User**: `https://your-app.vercel.app/multi`
- **Direct Single User**: `https://your-app.vercel.app/single`
- **Collaborate**: `https://your-app.vercel.app/collaborate` (alias for multi-user)

## 🛠 Technologies Used

- **Node.js**: Backend server
- **Express**: Web framework for Node.js
- **Socket.IO**: Real-time bidirectional event-based communication (local development)
- **Canvas API**: HTML5 drawing functionality
- **Vercel API Routes**: Serverless functions for cloud collaboration

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

