import DB from '../db/db.ts';
import UrlParser from '../utils/urlParser.ts';
import { Server, PaDB, Response, Request } from '../types';
import getReqData from '../utils/getReqData.ts';

class Handler implements Server.Handler {
  methods: Server.IMethods = {
    GET: this.manageGET.bind(this),
    POST: this.managePOST.bind(this),
    // PUT: 'PUT',
    // DELETE: 'DELETE',
  };
  db: PaDB.IDB;
  parser: UrlParser.UrlParser;

  constructor() {
    this.db = new DB();
    this.parser = new UrlParser();
  }

  async manageGET(url: string | undefined, res: Response) {
    if (url && url.startsWith(this.parser.endpoints.users)) {
      const parsedUrl = this.parser.parseEndpoint(url, this.parser.endpoints.users);
      if (parsedUrl) {
        const user = this.db.getUserById(parsedUrl);
        if (user) this.approveWrite(res, 200, user);
        else this.reject(res, 'User ID is invalid', 400);
      } else {
        const users = this.db.getAllUsers();
        this.approveWrite(res, 200, users);
      }
    } else this.reject(res, 'Route not found', 404);
  }

  async managePOST(url: string | undefined, res: Response, req: Request) {
    if (url) {
      const parsedUrl = this.parser.parseEndpoint(url, this.parser.endpoints.users);
      console.log(parsedUrl);

      if (!parsedUrl) {
        const data = await getReqData(req);
        if (data) {
          const parsedData = JSON.parse(data);
          if (this.db.validateUserData(parsedData)) {
            this.db.createUser(parsedData);
            this.approveSend(res, 201, parsedData);
          } else this.reject(res, 'Request body does not contain reqied fields', 400);
        } else this.reject(res, 'Request body does not contain reqied fields', 400);
      } else this.reject(res, 'Route not found', 404);
    } else this.reject(res, 'Route not found', 404);
  }

  approveWrite(res: Response, statusCode: number, message: PaDB.IDBGetResponse | PaDB.IDBRecord) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ message }));
    res.end();
  }

  approveSend(res: Response, statusCode: number, message: PaDB.IDBGetResponse | PaDB.IDBRecord) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(message));
  }

  reject(res: Response, message: string, statusCode: number) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message }));
  }
}

export default Handler;
