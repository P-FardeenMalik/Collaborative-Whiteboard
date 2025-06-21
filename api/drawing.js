// In-memory storage for drawing data (in production, use a database)
let drawingActions = [];
let lastCleanup = Date.now();

export default function handler(req, res) {
  // Enable CORS for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Clean up old data every 5 minutes to prevent memory issues
  const now = Date.now();
  if (now - lastCleanup > 300000) { // 5 minutes
    // Keep only last 1000 actions and actions from last hour
    const oneHourAgo = now - 3600000;
    drawingActions = drawingActions
      .filter(action => action.timestamp > oneHourAgo)
      .slice(-1000);
    lastCleanup = now;
  }

  if (req.method === 'POST') {
    const { type, x, y, color = '#000000', userId } = req.body;
    
    if (!type || x === undefined || y === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const action = {
      id: Date.now() + Math.random(),
      type,
      x: parseFloat(x),
      y: parseFloat(y),
      color,
      userId: userId || 'anonymous',
      timestamp: Date.now()
    };
    
    drawingActions.push(action);
    
    res.status(200).json({ success: true, actionId: action.id });
    
  } else if (req.method === 'GET') {
    const since = parseInt(req.query.since) || 0;
    const userId = req.query.userId;
    
    // Return only actions from other users and after the specified timestamp
    const filteredActions = drawingActions.filter(action => 
      action.timestamp > since && 
      (!userId || action.userId !== userId)
    );
    
    res.status(200).json({ 
      actions: filteredActions,
      timestamp: Date.now()
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
