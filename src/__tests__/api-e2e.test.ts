import { PaDB } from 'src/types';
import request from 'supertest';
import { generateString } from '../utils/generateString';
import { generateNumber } from '../utils/generateNumber';
const APILink = 'http://localhost:4000';

describe('e2e tests', () => {
  const endpoint = '/api/users';
  afterAll(async () => {
    const response = await request(APILink).get(endpoint);
    if (response.body) {
      response.body.forEach(async (item: PaDB.IDBRecord) => {
        await request(APILink).delete(endpoint + '/' + item.id);
      });
    }
  });
  describe('case #1', () => {
    const data = {
      username: 'Mimi',
      age: 25,
      hobbies: ['barking'],
    };
    let createdRecord: PaDB.IDBRecord;
    let updatedRecord: PaDB.IDBRecord;
    test('should get empty db', async () => {
      const response = await request(APILink).get(endpoint);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject([]);
    });

    test('should create new object', async () => {
      const response = await request(APILink).post(endpoint).send(data);
      createdRecord = response.body;
      expect(response.statusCode).toBe(201);
      expect(Object.keys(response.body).length).toBe(4);
      expect(response.body.username).toBe(data.username);
      expect(response.body.age).toBe(data.age);
      expect(response.body.hobbies).toMatchObject(data.hobbies);
    });

    test('should get newly created record', async () => {
      const response = await request(APILink).get(endpoint + '/' + createdRecord.id);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(createdRecord);
    });

    test('should update record', async () => {
      const response = await request(APILink)
        .put(endpoint + '/' + createdRecord.id)
        .send({
          username: 'ADMIN',
          age: 999,
          hobbies: ['lying', 'scissors'],
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe('ADMIN');
      expect(response.body.age).toBe(999);
      expect(response.body.hobbies).toMatchObject(['lying', 'scissors']);
      updatedRecord = {
        id: createdRecord.id,
        username: 'ADMIN',
        age: 999,
        hobbies: ['lying', 'scissors'],
      };
    });

    test('should get updated record', async () => {
      const response = await request(APILink).get(endpoint + '/' + createdRecord.id);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(updatedRecord);
    });

    test('should delete record', async () => {
      const response = await request(APILink).delete(endpoint + '/' + updatedRecord.id);
      expect(response.statusCode).toBe(204);
      expect(response.body).toBe('');
    });

    test('should return user error', async () => {
      const response = await request(APILink).get(endpoint + '/' + updatedRecord.id);
      expect(response.statusCode).toBe(404);
      expect(response.body).toBe(`User with ID ${updatedRecord.id} does not exist`);
    });

    test('should get empty db', async () => {
      const response = await request(APILink).get(endpoint);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject([]);
    });
  });
  describe('case #2', () => {
    const correctData = {
      username: 'Mimi',
      age: 25,
      hobbies: ['barking'],
    };
    const wrongData1 = {
      id: '56b28301-667e-4548-ae18-b9fb5dc7da49',
      username: 'Mimi',
      age: 25,
      hobbies: [12],
    };
    const wrongData2 = {
      username: 12,
      age: 999,
      hobbies: 'baking',
    };
    let createdRecord: PaDB.IDBRecord;
    let createdRecord2: PaDB.IDBRecord;
    let updatedRecord: PaDB.IDBRecord;

    test('should get empty db', async () => {
      const response = await request(APILink).get(endpoint);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject([]);
    });

    test('should fail to create new object', async () => {
      const response = await request(APILink).post(endpoint).send(wrongData1);
      expect(response.statusCode).toBe(400);
      expect(response.body).toBe('Request body does not contain reqied fields');

      const response2 = await request(APILink).post(endpoint).send(wrongData2);
      expect(response2.statusCode).toBe(400);
      expect(response2.body).toBe('Request body does not contain reqied fields');
    });

    test('should get empty db', async () => {
      const response = await request(APILink).get(endpoint);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject([]);
    });

    test('should create new record', async () => {
      const response = await request(APILink).post(endpoint).send(correctData);
      createdRecord = response.body;
      expect(response.statusCode).toBe(201);
      expect(Object.keys(response.body).length).toBe(4);
      expect(response.body.username).toBe(correctData.username);
      expect(response.body.age).toBe(correctData.age);
      expect(response.body.hobbies).toMatchObject(correctData.hobbies);
    });

    test('should fail to delete record', async () => {
      const id = '6de54bfe-c0e5-4b54-aaf8-0e8f69a9d676';
      const response = await request(APILink).delete(endpoint + '/' + id);
      expect(response.statusCode).toBe(404);
      expect(response.body).toBe(`User with ID ${id} does not exist`);
    });

    test('should get newly created record', async () => {
      const response = await request(APILink).get(endpoint + '/' + createdRecord.id);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(createdRecord);
    });

    test('should fail to update record', async () => {
      const response = await request(APILink)
        .put(endpoint + '/' + createdRecord.id)
        .send({
          username: 'ADMIN',
          age: 'IMORTAL',
          hobbies: ['lying', 'scissors'],
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toBe('Request body does not contain reqied fields');
    });

    test('should update record', async () => {
      const response = await request(APILink)
        .put(endpoint + '/' + createdRecord.id)
        .send({
          username: 'ADMIN',
          age: 999,
          hobbies: ['lying', 'scissors'],
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe('ADMIN');
      expect(response.body.age).toBe(999);
      expect(response.body.hobbies).toMatchObject(['lying', 'scissors']);
      updatedRecord = {
        id: createdRecord.id,
        username: 'ADMIN',
        age: 999,
        hobbies: ['lying', 'scissors'],
      };
    });

    test('should create new record', async () => {
      const response = await request(APILink).post(endpoint).send(correctData);
      createdRecord2 = response.body;
      expect(response.statusCode).toBe(201);
      expect(Object.keys(response.body).length).toBe(4);
      expect(response.body.username).toBe(correctData.username);
      expect(response.body.age).toBe(correctData.age);
      expect(response.body.hobbies).toMatchObject(correctData.hobbies);
    });

    test('should get db with 2 records', async () => {
      const fullDb = [updatedRecord, createdRecord2];
      const response = await request(APILink).get(endpoint);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(fullDb);
    });

    test('should delete all records', async () => {
      const response = await request(APILink).delete(endpoint + '/' + updatedRecord.id);
      expect(response.statusCode).toBe(204);
      expect(response.body).toBe('');

      const response2 = await request(APILink).delete(endpoint + '/' + createdRecord2.id);
      expect(response2.statusCode).toBe(204);
      expect(response2.body).toBe('');
    });

    test('should get empty db', async () => {
      const response = await request(APILink).get(endpoint);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject([]);
    });
  });

  describe('case #3', () => {
    const genData: PaDB.IDBRecord[] = [];
    const dbData: PaDB.IDBRecord[] = [];
    beforeAll(() => {
      for (let i = 0; i < 50; i++) {
        genData.push({
          username: generateString(5),
          age: generateNumber(3),
          hobbies: new Array(generateNumber(1)).fill(generateString(5)),
        });
      }
    });
    afterAll(async () => {
      const response = await request(APILink).get(endpoint);
      if (response.body) {
        response.body.forEach(async (item: PaDB.IDBRecord) => {
          await request(APILink).delete(endpoint + '/' + item.id);
        });
      }
    });

    test('should get empty db', async () => {
      const response = await request(APILink).get(endpoint);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject([]);
    });

    test('should post data', async () => {
      const response = await request(APILink).post(endpoint).send(genData[0]);
      dbData.push(response.body);
    });

    test('should get data', async () => {
      const response = await request(APILink).get(endpoint);
      expect(response.body).toMatchObject(dbData);
    });

    test('should post data', async () => {
      const response = await request(APILink).post(endpoint).send(genData[1]);
      dbData.push(response.body);
    });

    test('should post data', async () => {
      const response = await request(APILink).post(endpoint).send(genData[2]);
      dbData.push(response.body);
    });

    test('should get data', async () => {
      const response = await request(APILink).get(endpoint);
      expect(response.body).toMatchObject(dbData);
    });

    test('should update data', async () => {
      const response = await request(APILink)
        .put(endpoint + '/' + dbData[0].id)
        .send({
          username: 'hahe',
          age: 12,
          hobbies: [],
        });
      expect(response.body.id).toBe(dbData[0].id);
      dbData[0] = response.body;
    });

    test('should get data', async () => {
      const response = await request(APILink).get(endpoint);
      expect(response.body).toMatchObject(dbData);
    });

    test('should delete data', async () => {
      await request(APILink).delete(endpoint + '/' + dbData[0].id);
      dbData.shift();
      const response = await request(APILink).get(endpoint);
      expect(response.body).toMatchObject(dbData);
    });

    test('should fail to delete already deleted data', async () => {
      const failId = dbData[0].id;
      const responseDel1 = await request(APILink).delete(endpoint + '/' + failId);
      expect(responseDel1.statusCode).toBe(204);
      dbData.shift();
      const responseDel2 = await request(APILink).delete(endpoint + '/' + failId);
      expect(responseDel2.statusCode).toBe(404);
      const responseGet = await request(APILink).get(endpoint);
      expect(responseGet.body).toMatchObject(dbData);
    });
  });
});
