import os from 'os';
import cluster from 'cluster';
import 'dotenv/config';
import server from './server';
import createLoadBalancer from './cluster/createMainServer';
// import { PaDB } from './types';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const workers: Array<any> = [];
const cpuCount = os.cpus().length;
const ports: number[] = [];

if (cluster.isPrimary) {
  // Fork workers
  console.log(`Number of CPUs on host machine is ${cpuCount}`);
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < cpuCount; i++) {
    const newWorker = cluster.fork();
    ports.push(i + 1);
    workers.push(newWorker);
  }

  workers.forEach((worker) => {
    worker.on('error', () => {
      console.log('error');
    });
    worker.on('message', (data: string) => {
      // sending data to workers
      workers.forEach((w) => w.send(data));
    });
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });

  const loadBalancer = createLoadBalancer(PORT, ports, cpuCount);

  loadBalancer.listen(PORT, () => {
    console.log(`Load balancer ${process.pid} started on port ${PORT}`);
    console.log('Please wait while workers are starting...');
  });
} else {
  if (cluster && cluster.worker) {
    const workerId = cluster.worker.id;
    server.listen(PORT + workerId, () => {
      console.log(`Server #${workerId} ${process.pid} started on port ${PORT + workerId}`);
    });
  }
}
