import http from 'node:http';
import Handler from './server/handler.ts';

const handler = new Handler();

// const isProd = process.env.NODE_ENV === 'production';

const server = http.createServer(async (req, res) => {
  if (req.method && req.method in handler.methods) {
    handler.delegate(res, req);
  } else handler.send(res, JSON.stringify('Route not found'), 404, 'e');
});

export default server;
