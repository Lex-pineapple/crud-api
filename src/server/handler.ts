import DB from '../db/db.ts';
import UrlParser from '../utils/urlParser.ts';
import { Server, PaDB, Response, Request } from '../types';
import getReqData from '../utils/getReqData.ts';
import ServerError from '../server/error.ts';
import cluster from 'cluster';

class Handler implements Server.Handler {
  methods: Server.IMethods = {
    GET: this.manageGET.bind(this),
    POST: this.managePOST.bind(this),
    PUT: this.managePUT.bind(this),
    DELETE: this.manageDELETE.bind(this),
  };
  endpoints: Server.IEndpoints = {
    users: '/api/users',
  };
  db: PaDB.IDB;
  parser: UrlParser.UrlParser;

  constructor() {
    this.db = new DB();
    this.parser = new UrlParser();
  }

  delegate(res: Response, req: Request) {
    if (req.url && req.url.startsWith(this.endpoints.users)) {
      const parsedUrl = this.parser.parseEndpoint(req.url, this.endpoints.users);
      this.methods[req.method as keyof typeof this.methods](parsedUrl, res, req);
    } else this.send(res, JSON.stringify('Route not found'), 404, 'e');
  }

  async manageGET(id: string | undefined, res: Response) {
    try {
      if (id) {
        const user = await this.db.getUserById(id);
        if (cluster.isWorker && process.send) process.send(JSON.stringify(this.db.db));
        this.send(res, JSON.stringify(user), 200, 'w');
      } else {
        const users = await this.db.getAllUsers();
        if (cluster.isWorker && process.send) process.send(JSON.stringify(this.db.db));
        this.send(res, JSON.stringify(users), 200, 'w');
      }
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async managePOST(id: string | undefined, res: Response, req: Request) {
    if (!id) {
      try {
        const userData = await getReqData(req);
        const dbData = await this.db.createUser(userData);
        if (cluster.isWorker && process.send) process.send(JSON.stringify(this.db.db));
        this.send(res, JSON.stringify(dbData), 201, 'e');
      } catch (error) {
        this.handleError(error, res);
      }
    } else this.send(res, JSON.stringify('Route not found'), 404, 'e');
  }

  async managePUT(id: string | undefined, res: Response, req: Request) {
    if (id) {
      try {
        const userData = await getReqData(req);
        const updUser = await this.db.updateUser(id, userData);
        if (cluster.isWorker && process.send) process.send(JSON.stringify(this.db.db));
        this.send(res, JSON.stringify(updUser), 200, 'e');
      } catch (error) {
        this.handleError(error, res);
      }
    } else this.send(res, JSON.stringify('Route not found'), 404, 'e');
  }

  async manageDELETE(id: string | undefined, res: Response) {
    if (id) {
      try {
        await this.db.deleteUser(id);
        if (cluster.isWorker && process.send) process.send(JSON.stringify(this.db.db));
        this.send(res, '', 204, 'w');
      } catch (error) {
        this.handleError(error, res);
      }
    } else this.send(res, JSON.stringify('Route not found'), 404, 'e');
  }

  send(res: Response, message: string, statusCode: number, perm: string) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    if (perm === 'w') {
      res.write(message);
      res.end();
    }
    if (perm === 'e') {
      res.end(message);
    }
  }

  handleError(error: unknown, res: Response) {
    if (error instanceof ServerError)
      this.send(res, JSON.stringify(error.message), error.status, 'e');
    else
      this.send(
        res,
        'The error occured on the side of the server, please try again later',
        500,
        'e'
      );
  }
}

export default Handler;
