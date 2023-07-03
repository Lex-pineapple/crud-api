import request from 'supertest';
import { PaDB } from 'src/types';

const APILink = 'http://localhost:4000';
const endpoint = '/api/users';
const randData = [
  { isValid: false, data: { username: undefined, age: [34], hobbies: 'dsfg' } },
  { isValid: false, data: { username: 65, age: 'sadvf', hobbies: [] } },
  { isValid: false, data: { username: 'dsfg', age: 448486, hobbies: 'asdfg' } },
  { isValid: true, data: { username: 'asdfg', age: 22, hobbies: ['sadvf'] } },
  { isValid: false, data: { username: 'sadvf', age: 'dscf', hobbies: undefined } },
  { isValid: false, data: { username: 'dscf', age: 'dsfg', hobbies: 'sadvf' } },
  { isValid: false, data: { username: 458431684, age: [34], hobbies: [] } },
  { isValid: false, data: { username: [324], age: 'dsfg', hobbies: null } },
  { isValid: false, data: { username: 'password', age: 22, hobbies: ';' } },
  { isValid: false, data: { username: undefined, age: 448486, hobbies: 'dsfg' } },
  { isValid: false, data: { username: undefined, age: [34], hobbies: 'dscf' } },
  { isValid: false, data: { username: 'dsfg', age: ['ddd', 'ddd'], hobbies: 'dscf' } },
  { isValid: false, data: { username: undefined, age: 465, hobbies: null } },
  { isValid: false, data: { username: 'dsfg', age: 448486, hobbies: undefined } },
  { isValid: false, data: { username: 'dsfg', age: ['ddd', 'ddd'], hobbies: [324] } },
  { isValid: false, data: { username: 448486, age: ['ddd', 'ddd'], hobbies: ['ddd', 'ddd'] } },
  { isValid: false, data: { username: 65, age: 65, hobbies: 'dsfg' } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: 'dsfg', hobbies: [34] } },
  { isValid: true, data: { username: '[]', age: 465, hobbies: [] } },
  {
    isValid: false,
    data: {
      username: 'username',
      age: null,
      hobbies: { username: 'sdfg', age: 'asdfg', hobbies: ['asdfg', 'sdfg'] },
    },
  },
  { isValid: false, data: { username: false, age: [34], hobbies: [34] } },
  { isValid: false, data: { username: 'asdfg', age: 'df', hobbies: 'password' } },
  { isValid: false, data: { username: [], age: 'dsfg', hobbies: 'username' } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: ['ddd', 'ddd'], hobbies: [234] } },
  { isValid: false, data: { username: 22, age: 22, hobbies: 65 } },
  { isValid: false, data: { username: 65, age: 448486, hobbies: 'sadvf' } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: ['ddd', 'ddd'], hobbies: 'sadvf' } },
  { isValid: false, data: { username: [], age: 458431684, hobbies: ['ddd', 'ddd'] } },
  { isValid: false, data: { username: 22, age: ['ddd', 'ddd'], hobbies: false } },
  { isValid: false, data: { username: 458431684, age: [34], hobbies: ['ddd', 'ddd'] } },
  { isValid: false, data: { username: 'password', age: 'df', hobbies: 'asdfg' } },
  {
    isValid: false,
    data: {
      username: 'dsfg',
      age: 'dsfg',
      hobbies: { username: 'sdfg', age: 'asdfg', hobbies: ['asdfg', 'sdfg'] },
    },
  },
  {
    isValid: false,
    data: {
      username: ';',
      age: [34],
      hobbies: { username: 'sdfg', age: 'asdfg', hobbies: ['asdfg', 'sdfg'] },
    },
  },
  { isValid: false, data: { username: 65, age: false, hobbies: 'asdfg' } },
  { isValid: true, data: { username: 'username', age: 22, hobbies: ['dscf'] } },
  { isValid: false, data: { username: 458431684, age: 'dsfg', hobbies: [] } },
  { isValid: false, data: { username: 'asdfg', age: ['ddd', 'ddd'], hobbies: 'dsfg' } },
  {
    isValid: false,
    data: {
      username: [34],
      age: [34],
      hobbies: { username: 'sdfg', age: 'asdfg', hobbies: ['asdfg', 'sdfg'] },
    },
  },
  { isValid: false, data: { username: [34], age: ['ddd', 'ddd'], hobbies: 'dsfg' } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: ';', hobbies: ['ddd', 'ddd'] } },
  { isValid: false, data: { username: true, age: [324], hobbies: [] } },
  { isValid: false, data: { username: [234], age: 'username', hobbies: 'dsfg' } },
  { isValid: false, data: { username: 458431684, age: 'dsfg', hobbies: [324] } },
  { isValid: false, data: { username: 'dsfg', age: 'username', hobbies: 'dscf' } },
  { isValid: false, data: { username: [324], age: ';', hobbies: 448486 } },
  { isValid: false, data: { username: [34], age: 448486, hobbies: 'asdfg' } },
  { isValid: false, data: { username: 458431684, age: 'dsfg', hobbies: 'dsfg' } },
  {
    isValid: false,
    data: {
      username: { username: 'sdfg', age: 'asdfg', hobbies: ['asdfg', 'sdfg'] },
      age: 65,
      hobbies: [324],
    },
  },
  { isValid: false, data: { username: undefined, age: ['ddd', 'ddd'], hobbies: ';' } },
  { isValid: false, data: { username: [], age: [], hobbies: 'dsfg' } },
  { isValid: false, data: { username: 65, age: true, hobbies: 'dsfg' } },
  { isValid: false, data: { username: true, age: 'dsfg', hobbies: 458431684 } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: false, hobbies: undefined } },
  {
    isValid: false,
    data: {
      username: { username: 'sdfg', age: 'asdfg', hobbies: ['asdfg', 'sdfg'] },
      age: 448486,
      hobbies: 'sadvf',
    },
  },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: 65, hobbies: ['ddd', 'ddd'] } },
  { isValid: false, data: { username: [], age: undefined, hobbies: 'dsfg' } },
  { isValid: false, data: { username: [], age: 22, hobbies: ['ddd', 'ddd'] } },
  { isValid: false, data: { username: 'sadvf', age: [324], hobbies: 'password' } },
  { isValid: false, data: { username: [], age: 'asdfg', hobbies: 'sadvf' } },
  { isValid: false, data: { username: 'dscf', age: [], hobbies: 'dscf' } },
  { isValid: false, data: { username: [234], age: 65, hobbies: 'dsfg' } },
  { isValid: false, data: { username: 'dsfg', age: true, hobbies: 65 } },
  { isValid: false, data: { username: [], age: 448486, hobbies: 'dsfg' } },
  { isValid: false, data: { username: [34], age: null, hobbies: 448486 } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: [], hobbies: [] } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: 448486, hobbies: [] } },
  { isValid: false, data: { username: undefined, age: 465, hobbies: [] } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: [], hobbies: [324] } },
  { isValid: false, data: { username: [324], age: undefined, hobbies: 'sadvf' } },
  { isValid: false, data: { username: 'asdfg', age: ';', hobbies: 'dsfg' } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: [234], hobbies: [] } },
  { isValid: false, data: { username: [234], age: true, hobbies: [] } },
  { isValid: false, data: { username: 65, age: [34], hobbies: null } },
  { isValid: true, data: { username: 'ddd', age: 448486, hobbies: ['ddd', 'ddd'] } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: 'asdfg', hobbies: ['ddd', 'ddd'] } },
  {
    isValid: false,
    data: {
      username: ';',
      age: { username: 'sdfg', age: 'asdfg', hobbies: ['asdfg', 'sdfg'] },
      hobbies: 'dsfg',
    },
  },
  { isValid: false, data: { username: 465, age: [], hobbies: undefined } },
  { isValid: false, data: { username: ';', age: 'dsfg', hobbies: [234] } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: undefined, hobbies: [] } },
  { isValid: false, data: { username: 458431684, age: true, hobbies: [] } },
  { isValid: false, data: { username: [], age: [], hobbies: 458431684 } },
  { isValid: false, data: { username: false, age: 'dsfg', hobbies: true } },
  { isValid: true, data: { username: 'asdfg', age: 234, hobbies: ['465'] } },
  { isValid: false, data: { username: [], age: [34], hobbies: 'password' } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: 'sadvf', hobbies: true } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: null, hobbies: ';' } },
  { isValid: false, data: { username: [], age: 448486, hobbies: [34] } },
  {
    isValid: false,
    data: {
      username: [],
      age: { username: 'sdfg', age: 'asdfg', hobbies: ['asdfg', 'sdfg'] },
      hobbies: 'dsfg',
    },
  },
  { isValid: false, data: { username: 'asdfg', age: [324], hobbies: 'sadvf' } },
  { isValid: false, data: { username: 65, age: 448486, hobbies: false } },
  { isValid: false, data: { username: true, age: 458431684, hobbies: 65 } },
  { isValid: false, data: { username: [324], age: [], hobbies: 22 } },
  { isValid: false, data: { username: ['ddd', 'ddd'], age: ['ddd', 'ddd'], hobbies: ';' } },
  { isValid: false, data: { username: [], age: 448486, hobbies: 'dsfg' } },
  {
    isValid: false,
    data: {
      username: { username: 'sdfg', age: 'asdfg', hobbies: ['asdfg', 'sdfg'] },
      age: true,
      hobbies: [],
    },
  },
  { isValid: false, data: { username: 'password', age: 'username', hobbies: 22 } },
  {
    isValid: false,
    data: {
      username: [34],
      age: { username: 'sdfg', age: 'asdfg', hobbies: ['asdfg', 'sdfg'] },
      hobbies: 'df',
    },
  },
  {
    isValid: false,
    data: {
      username: 'df',
      age: 'dsfg',
      hobbies: { username: 'sdfg', age: 'asdfg', hobbies: ['asdfg', 'sdfg'] },
    },
  },
  { isValid: false, data: { username: [34], age: ';', hobbies: 'df' } },
  { isValid: true, data: { username: 'asdfg', age: 23, hobbies: ['hh'] } },
];
const validData = [
  { username: 'asdfg', age: 22, hobbies: ['sadvf'] },
  { username: '[]', age: 465, hobbies: [] },
  { username: 'username', age: 22, hobbies: ['dscf'] },
  { username: 'ddd', age: 448486, hobbies: ['ddd', 'ddd'] },
  { username: 'asdfg', age: 234, hobbies: ['465'] },
  { username: 'asdfg', age: 23, hobbies: ['hh'] },
];
let responseData: PaDB.IDBRecord[] = [];

describe('random tests', () => {
  test('should create multiple new records', async () => {
    for (let i = 0; i < randData.length; i++) {
      const isValid = randData[i].isValid;
      const response = await request(APILink).post(endpoint).send(randData[i].data);
      if (isValid) {
        expect(response.statusCode).toBe(201);
      } else expect(response.statusCode).toBe(400);
    }
  });

  test('should get db', async () => {
    const response = await request(APILink).get(endpoint);
    responseData = response.body;
    expect(response.body).toMatchObject(validData);
  });

  test('should delete all entries', async () => {
    for (let i = 0; i < responseData.length; i++) {
      const response = await request(APILink).delete(endpoint + '/' + responseData[i].id);
      expect(response.statusCode).toBe(204);
    }
  });

  test('should get empty database', async () => {
    const response = await request(APILink).get(endpoint);
    expect(response.body).toMatchObject([]);
  });
});
