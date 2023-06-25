import { PaDB } from '../types';

class DB implements PaDB.IDB {
  db: PaDB.IDBRecord[] = [
    {
      id: '1',
      username: 'mimi',
      age: 27,
      hobbies: ['barking'],
    },
    {
      id: '2',
      username: 'admin',
      age: 9999,
      hobbies: [],
    },
  ];

  getAllUsers(): PaDB.IDBGetResponse {
    return {
      totalRecords: this.db.length,
      records: { ...this.db },
    };
  }

  getUserById(uid: string): PaDB.IDBRecord | undefined {
    const user = this.exists(uid);
    return user;
  }

  exists(id: string) {
    return this.db.find((item) => item.id == id);
  }
}

export default DB;
