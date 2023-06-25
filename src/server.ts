import http from 'node:http';
import Handler from './server/handler.ts';

const handler = new Handler();

// const isProd = process.env.NODE_ENV === 'production';

const server = http.createServer(async (req, res) => {
  if (req.method && req.method in handler.methods) {
    handler.methods[req.method as keyof typeof handler.methods](req.url, res, req);
  } else handler.reject(res, 'Route not found', 404);
});

export default server;
