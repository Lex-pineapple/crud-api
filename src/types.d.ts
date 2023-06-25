export namespace PaDB {
  export interface IDB {
    db: IDBRecord[];
    getAllUsers(): IDBGetResponse;
    getUserById(uid: string): PaDB.IDBRecord | undefined;
    exists(id: string): IDBRecord | undefined;
    createUser(data: PaDB.IDBRecord): void;
    validateUserData(data: any): boolean;
  }

  export interface IDBGetResponse {
    totalRecords: number;
    records: IDBRecord[];
  }

  export interface IDBRecord {
    id?: string;
    username: string;
    age: number;
    hobbies: string[] | [];
  }
}

export namespace Server {
  export interface Handler {
    methods: IMethods;
    db: PaDB.IDB;
    parser: UrlParser.UrlParser;

    manageGET(url: string | undefined, res: Response, req?: Request): Promise<void>;

    managePOST(url: string | undefined, res: Response, req: Request): Promise<void>;

    approveWrite(
      res: Response,
      statusCode: number,
      message: PaDB.IDBGetResponse | PaDB.IDBRecord
    ): void;

    approveSend(
      res: Response,
      statusCode: number,
      message: PaDB.IDBGetResponse | PaDB.IDBRecord
    ): void;

    reject(res: Response, message: string, statusCode: number): void;
  }

  export interface IMethods {
    GET: (url: string | undefined, res: Response, req?: Request) => void;
    POST: (url: string | undefined, res: Response, req: Request) => void;
    // PUT: string;
    // DELETE: string;
  }
}

export namespace UrlParser {
  export interface UrlParser {
    endpoints: IEndpoints;
    parseEndpoint(url: string, endpoint: string): string;
  }

  export interface IEndpoints {
    users: string;
  }
}

export type Response = http.ServerResponse<http.IncomingMessage>;
export type Request = http.IncomingMessage;
