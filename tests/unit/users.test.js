const request = require('supertest')
const app = require('../../src/app')
const db = require("../../src/db/connect")
const User = require("../../src/models/User");


describe('POST /users/register', () => {
    afterEach(async () => {
        await User.destroy({email: "antek5757"});
    });

    it('should register a new user and return a token', async () => {
        const newUser = {
            username: "antek5757",
            email: "antek5757",
            password: "hassan5757"
        };

        const response = await request(app)
            .post('/users/register')
            .send(newUser);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
        const createdUser = await User.findByEmail("antek5757");
        expect(createdUser).not.toBeNull();
    });
});


describe('POST /users/login', () => {
    beforeAll(async () => {
        const newUser = {
            username: "antek5758",
            email: "antek5758",
            password: "hassan5758"
        };

        await request(app)
        .post('/users/register')
        .send(newUser);
    });

    afterAll(async () => {
        await User.destroy({ email: 'antek5758' });
    });

    it('should login a user and return a token', async () => {
        const loginCredentials = {
            email: "antek5758",
            password: "hassan5758"
        };

        const response = await request(app)
            .post('/users/login')
            .send(loginCredentials);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    });
});