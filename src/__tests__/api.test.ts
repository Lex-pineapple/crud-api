import request from 'supertest';

const APILink = 'http://localhost:4000';

describe('Test API GET', () => {
  describe('wrong routes', () => {
    test('empty request', async () => {
      const response = await request(APILink).get('');
      expect(response.statusCode).toBe(404);
      expect(response.body).toBe('Route not found');
    });
    test('wrong request', async () => {
      const response = await request(APILink).get('/unknown');
      expect(response.statusCode).toBe(404);
      expect(response.body).toBe('Route not found');
    });
    test('invalid id', async () => {
      const response = await request(APILink).get('/api/users/1');
      expect(response.statusCode).toBe(400);
      expect(response.body).toBe('User ID is invalid');
    });
  });
});
