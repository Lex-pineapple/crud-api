import http from 'node:http';
import Handler from './server/handler.ts';

const handler = new Handler();

// const isProd = process.env.NODE_ENV === 'production';
process.on('message', (data: any) => {
  process.stdout.write(`Updating users on worker ${process.pid}\n`);
  handler.db.setAllUsers(JSON.parse(data));
});
const server = http.createServer(async (req, res) => {
  if (req.method && req.method in handler.methods) {
    handler.delegate(res, req);
  } else handler.send(res, JSON.stringify('Route not found'), 404, 'e');
});

export default server;
