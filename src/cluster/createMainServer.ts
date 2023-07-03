import http from 'node:http';
import getReqData from '../utils/getReqData';

function createLoadBalancer(PORT: number, ports: number[], cpuCount: number) {
  let currPortIDX = 0;

  return http.createServer(async (req, res) => {
    const currWorkerPort = PORT + ports[currPortIDX++ % cpuCount];
    console.log(`\nSending request to [${req.method}] ${currWorkerPort}\n`);
    const reqData = await getReqData(req);

    const connector = http.request(
      {
        hostname: 'localhost',
        port: currWorkerPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (connectorRes) => {
        const body: any[] = [];
        connectorRes.on('data', (chunk) => {
          body.push(chunk);
        });
        res.setHeader('Content-Type', 'application/json');
        connectorRes.on('end', () => {
          if (connectorRes.statusCode) res.statusCode = connectorRes.statusCode;
          const msg = Buffer.concat(body).toString();
          res.write(msg);
          res.end();
        });
        connectorRes.on('error', () => {
          console.log('An error occured');

          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end('The error occured on the side of the server, please try again later');
        });
      }
    );

    connector.on('error', () => {
      console.log('An error occured');

      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end('The error occured on the side of the server, please try again later');
    });

    if (req.method !== 'GET') connector.write(reqData);
    connector.end();
  });
}

export default createLoadBalancer;
