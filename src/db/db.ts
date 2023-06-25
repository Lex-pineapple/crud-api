import { PaDB } from '../types';
import { v4 as uuidv4 } from 'uuid';

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
      records: [...this.db],
    };
  }

  getUserById(uid: string): PaDB.IDBRecord | undefined {
    const user = this.exists(uid);
    return user;
  }

  createUser(data: PaDB.IDBRecord) {
    this.db = [
      ...this.db,
      {
        id: uuidv4(),
        ...data,
      },
    ];
  }

  deleteUser(data: PaDB.IDBRecord) {
    const index = this.db.indexOf(data);
    if (index > -1) this.db.splice(index, 1);
  }

  updateUser(id: string, data: PaDB.IDBRecord) {
    console.log(data);
    const oldUser = this.exists(id);
    if (oldUser) {
      const index = this.db.indexOf(oldUser);
      this.db[index] = {
        id,
        ...data,
      };
    }
  }

  validateUserData(data: any, id: boolean) {
    const keys = Object.keys(data);
    if (id) {
      if (keys.length > 4) return false;
      if (!('id' in data && typeof data.id === 'string')) return false;
    } else if (keys.length > 3) return false;
    else if (!('username' in data && typeof data.username === 'string')) return false;
    else if (!('age' in data && typeof data.age === 'number')) return false;
    else if (!('hobbies' in data && data.hobbies instanceof Array)) return false;
    return true;
  }

  exists(id: string) {
    return this.db.find((item) => item.id == id);
  }
}

export default DB;
