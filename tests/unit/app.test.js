const request = require('supertest')
const app = require('../../src/app')



describe('GET /', () => {
    it('should return a healthy message', async () => {
        const response = await request(app).get('/');

        const server_name = process.env.SERVER_NAME || 'Local Host';
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ "final-project-backend": "healthy v9", "server-name": server_name });
    });
});


