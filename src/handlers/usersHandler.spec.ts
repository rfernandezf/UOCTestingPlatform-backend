import request from 'supertest';
import { app, server } from 'src/app';
import { User } from '@controllers/userController';
import { UserRequest } from '@interfaces/user';
import { Classroom } from '@controllers/classroomControlller';

var assert = require('assert');

describe('API REST - /api/v1/users', function () {

    afterEach(() => { server.close(); })
      
    describe('GET /users', function () {
        it('Should correctly return the users', async function () {
            const mockUsers: Array<User> = [
                new User(2,  "Juan David", "G. Solórzano", "DGarciaso@uoc.edu", "43214321", 2),
                new User(3,  "Juan", "John Doe", "juanjohndoe@uoc.edu", "0000", 2)
            ];

            const response = await request(app).get('/api/v1/users');

            assert.equal(response.status, 200);
            assert.equal(response.body, mockUsers.toString());
        });
    });

    describe('POST /users', function () {
        it('Should create a new user', async function () {
            let userRequest: UserRequest = {
                name: 'Rafael',
                surnames: 'Fernandez',
                email: 'rfl@test.com',
                password: '1111',
                role_id: 1
            }

            let mockUser = new User(4,  "Rafael", "Fernandez", "rfl@test.com", "1111", 1);

            const response = await request(app).post('/api/v1/users').send(userRequest);
            assert.equal(response.status, 200);
            assert.equal(response.body, mockUser.toString());
        });

        it('Should give an input validation error on wrong parameters (400)', async function () {
            let userRequest: any = {
                badname: 'Rafael',
                surnames: 'Fernandez',
                email: 'rfl@test.com',
                password: '1111',
                role_id: 1
            }

            const response = await request(app).post('/api/v1/users').send(userRequest);
            assert.equal(response.status, 400);
        });

        it('Should give a foreign key error on duplicate name (409)', async function () {
            let userRequest: UserRequest = {
                name: 'Rafael',
                surnames: 'Fernandez',
                email: 'rfl@test.com',
                password: '1111',
                role_id: 1
            }

            const response = await request(app).post('/api/v1/users').send(userRequest);
            assert.equal(response.status, 409);
        });
    });

    describe('GET /users/:id', function () {
        it('Should correctly return the user', async function () {
            let mockUser = new User(4,  "Rafael", "Fernandez", "rfl@test.com", "1111", 1);

            const response = await request(app).get('/api/v1/users/4');

            assert.equal(response.status, 200);
            assert.equal(response.body, mockUser.toString());
        });

        it('Should return an 404 not found', async function () {
            const response = await request(app).get('/api/v1/users/40');

            assert.equal(response.status, 404);
        });
    });

    describe('PUT /users/:id', function () {
        it('Should edit the user', async function () {
            let userRequest: UserRequest = {
                name: 'Rafael',
                surnames: 'Fernandez Flores',
                email: 'rfl@uoc.edu',
                password: '1111',
                role_id: 1
            }

            let mockUser = new User(4,  "Rafael", "Fernandez Flores", "rfl@uoc.edu", "1111", 1);

            const response = await request(app).put('/api/v1/users/3').send(userRequest);
            assert.equal(response.status, 200);
            assert.equal(response.body, mockUser.toString());
        });

        it('Should return an 404 not found', async function () {
            let userRequest: UserRequest = {
                name: 'Rafael',
                surnames: 'Fernandez Flores',
                email: 'rfl@uoc.edu',
                password: '1111',
                role_id: 1
            }

            const response = await request(app).put('/api/v1/users/40').send(userRequest);

            assert.equal(response.status, 404);
        });

        it('Should give an input validation error on wrong parameters (400)', async function () {
            let userRequest: any = {
                badname: 'Rafael',
                surnames: 'Fernandez Flores',
                email: 'rfl@uoc.edu',
                password: '1111',
                role_id: 1
            }

            const response = await request(app).put('/api/v1/users/3').send(userRequest);
            assert.equal(response.status, 400);
        });
    });

    describe('DELETE /users/:id', function () {
        it('Should return an 404 not found', async function () {
            const response = await request(app).delete('/api/v1/users/40');

            assert.equal(response.status, 404);
        });

        it('Should return a foreign key violation error - 422', async function () {
            const response = await request(app).delete('/api/v1/users/3');

            assert.equal(response.status, 422);
        });

        it('Should delete the user', async function () {
            const deleteResponse = await request(app).delete('/api/v1/users/4');
            assert.equal(deleteResponse.status, 200);

            const getResponse = await request(app).get('/api/v1/users/4');
            assert.equal(getResponse.status, 404);
        });
    });

    describe('GET /users/:id/classrooms', function () {
        it('Should correctly return the classrooms the user is subscribed to', async function () {
            let mockClassrooms: Array<Classroom> = [new Classroom(2,  "Renamed Python classroom", "Renamed classroom for the Python subject")];

            const response = await request(app).get('/api/v1/users/2/classrooms');

            assert.equal(response.status, 200);
            assert.equal(response.body, mockClassrooms.toString());
        });
    });

    describe('POST /users/:id_user/classrooms/:id_classroom', function () {
        it('Should correctly add the user to the classroom', async function () {
            const response = await request(app).post('/api/v1/users/2/classrooms/3');
            assert.equal(response.status, 200);
        });

        it('Should give a foreign key error on duplicate relationship (409)', async function () {
            const response = await request(app).post('/api/v1/users/2/classrooms/3');
            assert.equal(response.status, 409);
        });

        it('Should return an 422 - Foreign key violation: User not found', async function () {
            const response = await request(app).post('/api/v1/users/20/classrooms/3');
            assert.equal(response.status, 422);
        });

        it('Should return an 422 - Foreign key violation: Classroom not found', async function () {
            const response = await request(app).post('/api/v1/users/2/classrooms/30');
            assert.equal(response.status, 422);
        });
    });

    describe('DELETE /users/:id_user/classrooms/:id_classroom', function () {
        it('Should correctly delete the user from the classroom', async function () {
            const response = await request(app).delete('/api/v1/users/2/classrooms/3');
            assert.equal(response.status, 200);
        });

        it('Should return an 404 - Relationship not found', async function () {
            const response = await request(app).delete('/api/v1/users/2/classrooms/3');
            assert.equal(response.status, 404);
        });

        it('Should return an 404 - User not found', async function () {
            const response = await request(app).delete('/api/v1/users/20/classrooms/3');
            assert.equal(response.status, 404);
        });

        it('Should return an 404 - Classroom not found', async function () {
            const response = await request(app).delete('/api/v1/users/2/classrooms/30');
            assert.equal(response.status, 404);
        });
    });
});