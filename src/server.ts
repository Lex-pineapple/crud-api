import http from 'node:http';
import Handler from './server/handler';

const handler = new Handler();

process.on('message', (data: string) => {
  // set DB data to all users in the worker
  handler.db.setAllUsers(JSON.parse(data));
});

const server = http.createServer(async (req, res) => {
  try {
    if (req.method && req.method in handler.methods) {
      handler.delegate(res, req);
    } else handler.send(res, JSON.stringify('Route not found'), 404, 'e');
  } catch (error) {
    handler.handleError(error, res);
  }
});

export default server;
