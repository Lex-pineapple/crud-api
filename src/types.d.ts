export namespace PaDB {
  export interface IDB {
    db: IDBRecord[];
    getAllUsers(): IDBGetResponse;
    getUserById(uid: string): PaDB.IDBRecord | undefined;
    exists(id: string): IDBRecord | undefined;
  }

  export interface IDBGetResponse {
    totalRecords: number;
    records: IDBRecord[];
  }

  export interface IDBRecord {
    id: string;
    username: string;
    age: number;
    hobbies: string[] | [];
  }
}

export namespace Server {
  export interface Handler {
    methods: IMethods;
    urls: IUrls;
  }

  export interface IMethods {
    GET: (url: string | undefined, res: ServerResponse<IncomingMessage>) => void;
    // POST: string;
    // PUT: string;
    // DELETE: string;
  }

  export interface IUrls {
    GET_users: string;
    GET_user_by_id: string;
    POST_user: string;
    PUT_user: string;
    DELETE_user: string;
  }
}
