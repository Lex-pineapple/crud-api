import { PaDB } from 'src/types';
import request from 'supertest';
const APILink = 'http://localhost:4000';

describe('e2e tests', () => {
  const endpoint = '/api/users';
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
});
