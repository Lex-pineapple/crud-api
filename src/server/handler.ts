import DB from '../db/db.ts';
import UrlParser from '../utils/urlParser.ts';
import { Server, PaDB, Response, Request } from '../types';
import getReqData from '../utils/getReqData.ts';

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
    } else this.response(res, 'Route not found', 404, 'e');
  }

  async manageGET(id: string | undefined, res: Response) {
    if (id) {
      if (this.db.validateId(id)) {
        const user = this.db.getUserById(id);
        if (user) this.response(res, JSON.stringify(user), 200, 'w');
        else this.response(res, `User with ID ${id} does not exist`, 404, 'e');
      } else this.response(res, 'User ID is invalid', 400, 'e');
    } else {
      const users = this.db.getAllUsers();
      this.response(res, JSON.stringify(users), 200, 'w');
    }
  }

  async managePOST(id: string | undefined, res: Response, req: Request) {
    if (!id) {
      const userData = await getReqData(req);
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (this.db.validateUserData(parsedData, true)) {
          this.db.createUser(parsedData);
          this.response(res, JSON.stringify(parsedData), 201, 'e');
        } else this.response(res, 'Request body does not contain reqied fields', 400, 'e');
      } else this.response(res, 'Request body does not contain reqied fields', 400, 'e');
    } else this.response(res, 'Route not found', 404, 'e');
  }

  async managePUT(id: string | undefined, res: Response, req: Request) {
    if (id) {
      if (this.db.validateId(id)) {
        const userData = await getReqData(req);
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (this.db.validateUserData(parsedData, false)) {
            const user = this.db.getUserById(id);
            if (user) {
              this.db.updateUser(id, parsedData);
              this.response(res, JSON.stringify(parsedData), 400, 'e');
            }
            this.response(res, `User with ID ${id} does not exist`, 404, 'e');
          }
          this.response(res, 'Request body does not contain reqied fields', 400, 'e');
        }
        this.response(res, 'Request body does not contain reqied fields', 400, 'e');
      } else this.response(res, 'User ID is invalid', 400, 'e');
    } else this.response(res, 'Route not found', 404, 'e');
  }

  async manageDELETE(id: string | undefined, res: Response) {
    if (id) {
      if (this.db.validateId(id)) {
        const user = this.db.getUserById(id);
        if (user) {
          this.db.deleteUser(user);
          this.response(res, `User with id: ${user.id} was successfuly removed`, 204, 'e');
        } else this.response(res, `User with ID ${id} does not exist`, 404, 'e');
      } else this.response(res, 'User ID is invalid', 400, 'e');
    } else this.response(res, 'Route not found', 404, 'e');
  }

  response(res: Response, message: string, statusCode: number, perm: string) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    if (perm === 'w') {
      res.write(message);
      res.end();
    }
    if (perm === 'e') {
      res.end(message);
    }
  }
}

export default Handler;
