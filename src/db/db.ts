import { PaDB } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { RespCodes, CommonErrors } from '../constants.ts';
import ServerError from '../server/error.ts';

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

  getAllUsers(): Promise<PaDB.IDBGetResponse> {
    return new Promise((resolve, _) => {
      const data = {
        totalRecords: this.db.length,
        records: [...this.db],
      };
      // throw new Error('Whoopsie!');
      resolve(data);
    });
  }

  getUserById(uid: string): Promise<PaDB.IDBRecord> {
    return new Promise((resolve, reject) => {
      if (this.validateId(uid)) {
        const user = this.get(uid);
        if (user) resolve(user);
        else {
          const error = {
            message: `User with ID ${uid} does not exist`,
            status: RespCodes.ClientError.NotFound,
          };
          reject(new ServerError(error));
        }
      } else reject(new ServerError(CommonErrors.idInvalid));
    });
  }

  createUser(userData: string): Promise<PaDB.IDBRecord> {
    return new Promise((resolve, reject) => {
      const parsedData = JSON.parse(userData);
      if (this.validateUserData(parsedData, true)) resolve(this.add(parsedData));
      else reject(new ServerError(CommonErrors.noRecsReq));
    });
  }

  updateUser(id: string, userData: string): Promise<PaDB.IDBRecord> {
    return new Promise(async (resolve, reject) => {
      if (this.validateId(id)) {
        const parsedData = JSON.parse(userData);
        if (this.validateUserData(parsedData, false)) {
          const oldUser = await this.getUserById(id);
          if (oldUser) resolve(this.update(oldUser, parsedData));
          else {
            const error = {
              message: `User with ID ${id} does not exist`,
              status: RespCodes.ClientError.NotFound,
            };
            reject(new ServerError(error));
          }
        } else reject(new ServerError(CommonErrors.noRecsReq));
      } else reject(new ServerError(CommonErrors.idInvalid));
    });
  }

  deleteUser(id: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (this.validateId(id)) {
        const user = await this.getUserById(id);
        if (user) {
          this.remove(user);
          resolve(`User with id: ${user.id} was successfuly removed`);
        } else {
          const error = {
            message: `User with ID ${id} does not exist`,
            status: RespCodes.ClientError.NotFound,
          };
          reject(new ServerError(error));
        }
      } else reject(new ServerError(CommonErrors.idInvalid));
    });
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

  get(id: string) {
    return this.db.find((item) => item.id === id);
  }

  add(data: PaDB.IDBRecord) {
    const newUser = {
      id: uuidv4(),
      ...data,
    };
    this.db.push(newUser);
    return newUser;
  }

  update(oldData: PaDB.IDBRecord, newData: PaDB.IDBRecord) {
    const index = this.db.indexOf(oldData);
    const updatedUser = {
      id: oldData.id,
      ...newData,
    };
    this.db[index] = updatedUser;
    return updatedUser;
  }

  remove(data: PaDB.IDBRecord) {
    const index = this.db.indexOf(data);
    if (index > -1) this.db.splice(index, 1);
  }
}

export default DB;
