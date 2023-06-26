import { PaDB } from '../types';
import { v4 as uuidv4 } from 'uuid';

class DB implements PaDB.IDB {
  db: PaDB.IDBRecord[] = [
    {
      id: '363538d9-b23a-483d-9847-20b1c9966754',
      username: 'mimi',
      age: 27,
      hobbies: ['barking'],
    },
    {
      id: '49e346fc-d3ce-4048-ad73-6faa1e8d041f',
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
    return this.db.find((item) => item.id == uid);
  }

  createUser(data: PaDB.IDBRecord) {
    this.db.push({
      id: uuidv4(),
      ...data,
    });
  }

  deleteUser(data: PaDB.IDBRecord) {
    const index = this.db.indexOf(data);
    if (index > -1) this.db.splice(index, 1);
  }

  updateUser(id: string, data: PaDB.IDBRecord) {
    const oldUser = this.getUserById(id);
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
      else if (!('id' in data && typeof data.id === 'string')) return false;
    } else if (keys.length > 3) return false;
    else if (!('username' in data && typeof data.username === 'string')) return false;
    else if (!('age' in data && typeof data.age === 'number')) return false;
    else if (!('hobbies' in data && data.hobbies instanceof Array)) return false;
    return true;
  }

  validateId(id: string) {
    const uuidRegExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return uuidRegExp.test(id);
  }
}

export default DB;
