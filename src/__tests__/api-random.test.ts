import request from 'supertest';
import { PaDB } from 'src/types';
import { generateNumber } from '../utils/generateNumber';
import { generateString } from '../utils/generateString';
import { generateRandomType } from '../utils/generateRandomType';
import validateTestData from '../utils/validateTestData';

const APILink = 'http://localhost:4000';
const endpoint = '/api/users';
describe('random tests', () => {
  const genData: any[] = [];
  const genData2: PaDB.IDBRecord[] = [];
  beforeAll(() => {
    for (let i = 0; i < 100; i++) {
      const data = {
        username: generateRandomType(),
        age: generateRandomType(),
        hobbies: generateRandomType(),
      };
      genData.push(validateTestData(data));
    }
    for (let i = 0; i < 50; i++) {
      genData2.push({
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

  test('should create multiple new records', async () => {
    for (let i = 0; i < genData.length; i++) {
      const isValid = genData[i].isValid;
      const response = await request(APILink).post(endpoint).send(genData[i].data);
      if (isValid) {
        expect(response.statusCode).toBe(201);
      } else expect(response.statusCode).toBe(400);
    }
  });

  test('should get db', async () => {
    const findValid = genData.filter((item) => {
      if (item.isValid) return item;
    });
    const response = await request(APILink).get(endpoint);

    if (findValid.length > 0) {
      const validData = findValid.map((item) => item.data);
      expect(response.body).toMatchObject(validData);
    } else expect(response.body).toMatchObject([]);
  });
});
