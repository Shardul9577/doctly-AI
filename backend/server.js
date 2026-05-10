import { createServer } from 'http';
import app from './app.js';
import { PORT } from './src/config/env.config.js';

// Create HTTP server
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('WebSocket server initialized');
});
