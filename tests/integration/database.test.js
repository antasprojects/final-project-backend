const request = require('supertest')
const app = require('../../src/app')
const db = require('../../src/db/connect')

jest.mock('../../src/db/connect')

describe('GET /database', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });

    it('should return data from the database', async () => {
        const mockData = [{ id: 1, name: 'Red Ranger' }];
        db.query.mockResolvedValue({ rows: mockData });

        const response = await request(app).get('/database');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockData);
    });
});