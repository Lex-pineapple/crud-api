import { Server } from '../types';

class ServerError implements Server.Error {
  message: string;
  status: number;

  constructor({ message, status }: Server.Error) {
    this.message = message;
    this.status = status;
  }
}

export default ServerError;
