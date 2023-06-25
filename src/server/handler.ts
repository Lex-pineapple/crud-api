import DB from '../db/db.ts';
import { Server } from '../types';
import { PaDB } from '../types';
import http from 'node:http';

class Handler {
  methods: Server.IMethods = {
    GET: this.manageGet.bind(this),
    // POST: 'POST',
    // PUT: 'PUT',
    // DELETE: 'DELETE',
  };
  urls: Server.IUrls = {
    GET_users: '/api/users',
    GET_user_by_id: '/api/users/*',
    POST_user: '/api/users',
    PUT_user: '/api/users/*',
    DELETE_user: '/api/users/*',
  };
  db: PaDB.IDB;

  constructor() {
    this.db = new DB();
  }

  getUserId(url: string) {
    const splitUrl = url.split('/');
    return splitUrl[splitUrl.length - 1];
  }

  manageGet(url: string | undefined, res: http.ServerResponse<http.IncomingMessage>) {
    if (url === this.urls.GET_users) {
      this.approveGet(res, this.db.getAllUsers());
    } else if (url) {
      const userId = this.getUserId(url);
      const user = this.db.getUserById(userId);
      if (user) this.approveGet(res, user);
      else this.rejectNotFound(res, 'Route not found');
    } else this.rejectNotFound(res, 'Route not found');
  }

  approveGet(
    res: http.ServerResponse<http.IncomingMessage>,
    message: PaDB.IDBGetResponse | PaDB.IDBRecord
  ) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ message }));
    res.end();
  }

  rejectNotFound(res: http.ServerResponse<http.IncomingMessage>, message: string) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message }));
  }
}

export default Handler;
