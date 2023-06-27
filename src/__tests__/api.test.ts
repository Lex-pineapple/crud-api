import { PaDB } from 'src/types';
import request from 'supertest';

const APILink = 'http://localhost:4000';
// const validateuuid = (id: string) => {
//   const uuidRegExp =
//     /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
//   return uuidRegExp.test(id);
// };

// const testDB = []

describe('Test negative cases', () => {
  const endpoint = '/api/users';
  describe('wrong routes', () => {
    const link = endpoint + '/' + 'b92a1ae3-4e54-4246-87b9-002472915bd6';
    test('empty GET request', async () => {
      const response = await request(APILink).get('');
      expect(response.statusCode).toBe(404);
      expect(response.body).toBe('Route not found');
    });

    test('wrong GET request', async () => {
      const response = await request(APILink).get('/unknown');
      expect(response.statusCode).toBe(404);
      expect(response.body).toBe('Route not found');
    });

    test('invalid id, GET', async () => {
      const response = await request(APILink).get('/api/users/1');
      expect(response.statusCode).toBe(400);
      expect(response.body).toBe('User ID is invalid');
    });

    test('empty POST request', async () => {
      const response = await request(APILink).post(endpoint).send({});
      expect(response.statusCode).toBe(400);
      expect(response.body).toBe('Request body does not contain reqied fields');
    });

    describe('wrong POST request', () => {
      test('test#1', async () => {
        const response = await request(APILink).post(endpoint).send({
          cookies: 1,
          milk: 3,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Request body does not contain reqied fields');
      });
      test('test#2', async () => {
        const response = await request(APILink).post(endpoint).send({
          id: 'c55221ee-e1c0-4cda-af5d-df9f08a0ca6e',
          username: 'Mimi',
          age: 15,
          hobbies: 12,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Request body does not contain reqied fields');
      });
      test('test#3', async () => {
        const response = await request(APILink)
          .post(endpoint)
          .send({
            id: 'c55221ee-e1c0-4cda-af5d-df9f08a0ca6e',
            username: 'Mimi',
            age: 'mimi',
            hobbies: [12],
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Request body does not contain reqied fields');
      });
      test('test#4', async () => {
        const response = await request(APILink)
          .post(endpoint)
          .send({
            id: 'c55221ee-e1c0-4cda-af5d-df9f08a0ca6e',
            username: 32,
            age: 12,
            hobbies: [12],
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Request body does not contain reqied fields');
      });
      test('test#5', async () => {
        const response = await request(APILink)
          .post(endpoint)
          .send({
            id: 'c55221ee',
            username: 'Mimi',
            age: 12,
            hobbies: [12],
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Request body does not contain reqied fields');
      });
      test('test#6', async () => {
        const response = await request(APILink)
          .post('/unknown')
          .send({
            id: 'c55221ee-e1c0-4cda-af5d-df9f08a0ca6e',
            username: 'Mimi',
            age: 12,
            hobbies: [12],
          });
        expect(response.statusCode).toBe(404);
        expect(response.body).toBe('Route not found');
      });
      test('test#7', async () => {
        const response = await request(APILink)
          .post(endpoint)
          .send({
            id: 'c55221ee-e1c0-4cda-af5d-df9f08a0ca6e',
            username: 'Mimi',
            age: 12,
            hobbies: [12],
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Request body does not contain reqied fields');
      });
    });

    test('empty PUT request', async () => {
      const response = await request(APILink).put(link).send({});
      expect(response.statusCode).toBe(400);
      expect(response.body).toBe('Request body does not contain reqied fields');
    });

    test('invalid ID, PUT', async () => {
      const wrongIdLink = endpoint + '/' + 'b92a1ae3';
      const response = await request(APILink).put(wrongIdLink).send({});
      expect(response.statusCode).toBe(400);
      expect(response.body).toBe('User ID is invalid');
    });

    describe('wrong PUT request', () => {
      let data: PaDB.IDBRecord;
      let link: string;
      beforeAll(async () => {
        const response = await request(APILink)
          .post(endpoint)
          .send({
            username: 'Mimi',
            age: 15,
            hobbies: ['knitting'],
          });
        data = response.body;
        link = endpoint + '/' + data.id;
      });
      afterAll(async () => {
        await request(APILink).delete(endpoint + '/' + data.id);
      });
      test('test#1', async () => {
        const response = await request(APILink).put(link).send({
          cookies: 1,
          milk: 3,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Request body does not contain reqied fields');
      });
      test('test#2', async () => {
        const response = await request(APILink).put(link).send({
          id: 'c55221ee-e1c0-4cda-af5d-df9f08a0ca6e',
          username: 'Mimi',
          age: 15,
          hobbies: 12,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Request body does not contain reqied fields');
      });
      test('test#3', async () => {
        const response = await request(APILink)
          .put(link)
          .send({
            id: 'c55221ee-e1c0-4cda-af5d-df9f08a0ca6e',
            username: 'Mimi',
            age: 'mimi',
            hobbies: [12],
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Request body does not contain reqied fields');
      });
      test('test#4', async () => {
        const response = await request(APILink)
          .put(link)
          .send({
            id: 'c55221ee-e1c0-4cda-af5d-df9f08a0ca6e',
            username: 32,
            age: 12,
            hobbies: [12],
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Request body does not contain reqied fields');
      });
      test('test#5', async () => {
        const response = await request(APILink)
          .put(link)
          .send({
            id: 'c55221ee',
            username: 'Mimi',
            age: 12,
            hobbies: [12],
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Request body does not contain reqied fields');
      });
      test('test#6', async () => {
        const response = await request(APILink)
          .put('/unknown')
          .send({
            id: 'c55221ee-e1c0-4cda-af5d-df9f08a0ca6e',
            username: 'Mimi',
            age: 12,
            hobbies: [12],
          });
        expect(response.statusCode).toBe(404);
        expect(response.body).toBe('Route not found');
      });
      test('test#7', async () => {
        const response = await request(APILink)
          .put(link)
          .send({
            id: 'c55221ee-e1c0-4cda-af5d-df9f08a0ca6e',
            username: 'Mimi',
            age: 12,
            hobbies: [12],
          });
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe('Request body does not contain reqied fields');
      });
      test('test#8', async () => {
        const id = 'b92a1ae3-4e54-4246-87b9-002472915bd6';
        const link = endpoint + '/' + 'b92a1ae3-4e54-4246-87b9-002472915bd6';
        const response = await request(APILink)
          .put(link)
          .send({
            username: 'Mimi',
            age: 12,
            hobbies: [12],
          });
        expect(response.statusCode).toBe(404);
        expect(response.body).toBe(`User with ID ${id} does not exist`);
      });
    });

    test('empty DELETE request', async () => {
      const response = await request(APILink).delete('');
      expect(response.statusCode).toBe(404);
      expect(response.body).toBe('Route not found');
    });

    test('wrong DELETE request', async () => {
      const response = await request(APILink).delete('/unknown');
      expect(response.statusCode).toBe(404);
      expect(response.body).toBe('Route not found');
    });

    test('invalid id, DELETE', async () => {
      const response = await request(APILink).delete('/api/users/1');
      expect(response.statusCode).toBe(400);
      expect(response.body).toBe('User ID is invalid');
    });

    test('id does not exist, DELETE', async () => {
      const id = 'b92a1ae3-4e54-4246-87b9-002472915bd6';
      const link = endpoint + '/' + 'b92a1ae3-4e54-4246-87b9-002472915bd6';
      const response = await request(APILink).delete(link);
      expect(response.statusCode).toBe(404);
      expect(response.body).toBe(`User with ID ${id} does not exist`);
    });
  });

  describe('empty db', () => {
    test('user does not exist', async () => {
      const uid = '16d14f7a-e2bb-418a-b46f-124ad52125d1';
      const link = endpoint + '/' + uid;
      const response = await request(APILink).get(link);
      expect(response.statusCode).toBe(404);
      expect(response.body).toBe(`User with ID ${uid} does not exist`);
    });

    test('get all users', async () => {
      const response = await request(APILink).get(endpoint);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject([]);

      const response2 = await request(APILink).get(endpoint + '/');
      expect(response2.statusCode).toBe(200);
      expect(response2.body).toMatchObject([]);
    });
  });
});

describe('e2e tests', () => {
  test('case #1', () => {});
});
