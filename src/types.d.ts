export namespace PaDB {
  export interface IDB {
    db: IDBRecord[];
    getAllUsers(): IDBGetResponse;
    getUserById(uid: string): PaDB.IDBRecord | undefined;
    createUser(data: PaDB.IDBRecord): void;
    deleteUser(data: PaDB.IDBRecord): void;
    updateUser(id: string, data: PaDB.IDBRecord): void;
    validateUserData(data: any, id: boolean): boolean;
    validateId(id: string): boolean;
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
    endpoints: IEndpoints;

    manageGET(url: string | undefined, res: Response, req?: Request): Promise<void>;

    managePOST(url: string | undefined, res: Response, req: Request): Promise<void>;

    manageDELETE(url: string | undefined, res: Response): Promise<void>;

    managePUT(url: string | undefined, res: Response, req: Request): Promise<void>;

    response(res: Response, message: string, statusCode: number, perm: string): void;
  }

  export interface IEndpoints {
    users: string;
  }

  export interface IMethods {
    GET: (url: string | undefined, res: Response, req?: Request) => void;
    POST: (url: string | undefined, res: Response, req: Request) => void;
    PUT: (url: string | undefined, res: Response, req: Request) => void;
    DELETE: (url: string | undefined, res: Response) => void;
  }
}

export namespace UrlParser {
  export interface UrlParser {
    parseEndpoint(url: string, endpoint: string): string;
  }
}

export type Response = http.ServerResponse<http.IncomingMessage>;
export type Request = http.IncomingMessage;
