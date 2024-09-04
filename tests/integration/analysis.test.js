const request = require('supertest');
const app = require('../../src/app');  
const db = require('../../src/db/connect');

jest.mock('../../src/db/connect');

describe("Integration Test - Analysis Routes", () => {

    describe("GET /analysis/user-recommendations", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return user recommendation counts with status 200", async () => {
            const mockData = [
                { user_id: 1, recommendation_count: 10 },
                { user_id: 2, recommendation_count: 5 }
            ];

            db.query.mockResolvedValueOnce({ rows: mockData });

            const res = await request(app)
                .get('/analysis/user-recommendations')
                .expect('Content-Type', /json/)
                .expect(200);  

            expect(res.body).toEqual(mockData);
        });

        it("should return status 500 if database query fails", async () => {
            db.query.mockRejectedValueOnce(new Error("Database Error"));

            const res = await request(app)
                .get('/analysis/user-recommendations')
                .expect(500); 

            expect(res.body).toHaveProperty("error", "Database Error");
        });
    });

    describe("GET /analysis/user-visits", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return user visit counts with status 200", async () => {
            const mockData = [
                { user_id: 1, saved_count: 20 },
                { user_id: 2, saved_count: 15 }
            ];

            db.query.mockResolvedValueOnce({ rows: mockData });

            const res = await request(app)
                .get('/analysis/user-visits')
                .expect('Content-Type', /json/)
                .expect(200);  

            expect(res.body).toEqual(mockData);
        });

        it("should return status 500 if database query fails", async () => {
            db.query.mockRejectedValueOnce(new Error("Database Error"));

            const res = await request(app)
                .get('/analysis/user-visits')
                .expect(500);  
                
            expect(res.body).toHaveProperty("error", "Database Error");
        });
    });
});
