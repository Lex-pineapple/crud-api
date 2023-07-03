import { PaDB } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { RespCodes, CommonErrors } from '../constants';
import ServerError from '../server/error';

class DB implements PaDB.IDB {
  db: PaDB.IDBRecord[] = [];

  setAllUsers(data: PaDB.IDBRecord[]) {
    this.db = data;
  }

  getAllUsers(): Promise<PaDB.IDBRecord[]> {
    return new Promise((resolve, _) => {
      const data = this.db;
      // throw new Error('Whoopsie!');
      resolve(data);
    });
  }

  getUserById(uid: string): Promise<PaDB.IDBRecord> {
    return new Promise((resolve, reject) => {
      if (this.isPath(uid)) reject(new ServerError(CommonErrors.notFound));
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

  createUser(userData: string | undefined): Promise<PaDB.IDBRecord> {
    return new Promise((resolve, reject) => {
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (this.validateUserData(parsedData)) resolve(this.add(parsedData));
        else reject(new ServerError(CommonErrors.noRecsReq));
      } else reject(new ServerError(CommonErrors.noRecsReq));
    });
  }

  updateUser(id: string, userData: string): Promise<PaDB.IDBRecord> {
    return new Promise((resolve, reject) => {
      if (this.isPath(id)) reject(new ServerError(CommonErrors.notFound));
      if (this.validateId(id)) {
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (this.validateUserData(parsedData)) {
            const oldUser = this.get(id);
            if (oldUser) resolve(this.update(oldUser, parsedData));
            else {
              const error = {
                message: `User with ID ${id} does not exist`,
                status: RespCodes.ClientError.NotFound,
              };
              reject(new ServerError(error));
            }
          } else reject(new ServerError(CommonErrors.noRecsReq));
        } else reject(new ServerError(CommonErrors.noRecsReq));
      } else reject(new ServerError(CommonErrors.idInvalid));
    });
  }

  deleteUser(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isPath(id)) reject(new ServerError(CommonErrors.notFound));
      if (this.validateId(id)) {
        const user = this.get(id);
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

  isPath(id: string) {
    return id.split('/').length > 1;
  }

  validateUserData(data: any) {
    if (!('username' in data && typeof data.username === 'string')) return false;
    if (!('age' in data && typeof data.age === 'number')) return false;
    if (!('hobbies' in data && data.hobbies instanceof Array)) return false;
    if (data.hobbies.length > 0) {
      if (!data.hobbies.every((i: any) => typeof i === 'string')) return false;
    }
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
      username: data.username,
      age: data.age,
      hobbies: data.hobbies,
    };
    this.db.push(newUser);
    return newUser;
  }

  update(oldData: PaDB.IDBRecord, newData: PaDB.IDBRecord) {
    const index = this.db.indexOf(oldData);
    const updatedUser = {
      id: oldData.id,
      username: newData.username,
      age: newData.age,
      hobbies: newData.hobbies,
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
