import request from 'supertest';
import { app, server } from 'src/app';
import { Classroom } from '@controllers/classroomControlller';
import { ClassroomRequest } from '@interfaces/classroom';

var assert = require('assert');

describe('API REST - /api/v1/classrooms', function () {

    afterEach(() => { server.close(); })
      
    describe('GET /classrooms', function () {
        it('Should correctly return the classrooms', async function () {
            const mockClassrooms: Array<Classroom> = [
                new Classroom(2,  "Renamed Python classroom", "Renamed classroom for the Python subject"),
                new Classroom(3,  "C# classroom", "Classroom for the C# subject")
            ];

            const response = await request(app).get('/api/v1/classrooms');
            response.body.forEach((classroom: any) => classroom._uuid = ""); // Delete UUID for comparing object result

            assert.equal(response.status, 200);
            assert.equal(JSON.stringify(response.body), JSON.stringify(mockClassrooms));
        });
    });

    describe('POST /classrooms', function () {
        it('Should create a new classroom', async function () {
            let classroomRequest: ClassroomRequest = { name: 'Java classroom', description: "Classroom for the Java subject", password: ""}

            let mockClassroom = new Classroom(4,  "Java classroom", "Classroom for the Java subject");

            const response = await request(app).post('/api/v1/classrooms').send(classroomRequest);
            response.body._uuid = ""; // Delete UUID for comparing object result

            assert.equal(response.status, 200);
            assert.equal(JSON.stringify(response.body), JSON.stringify(mockClassroom));

            // Create another extra classroom for future usage
            let classroomRequest2: ClassroomRequest = { name: 'Paswordless classroom', description: "Classroom for testing", password: ""}
            await request(app).post('/api/v1/classrooms').send(classroomRequest2);
        });

        it('Should give an input validation error on wrong parameters (400)', async function () {
            let classroomRequest: any = { badname: 'Java classroom', description: "Classroom for the Java subject" }

            const response = await request(app).post('/api/v1/classrooms').send(classroomRequest);
            assert.equal(response.status, 400);
        });

        it('Should give a foreign key error on duplicate name (409)', async function () {
            let classroomRequest: ClassroomRequest = { name: 'Java classroom', description: "Different description of the classroom for the Java subject", password: ""}

            const response = await request(app).post('/api/v1/classrooms').send(classroomRequest);
            assert.equal(response.status, 409);
        });
    });

    describe('GET /classrooms/:id', function () {
        let uuid = '';

        it('Should correctly return the classroom by id', async function () {
            let mockClassroom = new Classroom(4,  "Java classroom", "Classroom for the Java subject");

            const response = await request(app).get('/api/v1/classrooms/4');
            uuid = response.body._uuid;
            response.body._uuid = ""; // Delete UUID for comparing object result

            assert.equal(response.status, 200);
            assert.equal(JSON.stringify(response.body), JSON.stringify(mockClassroom));
        });

        it('Should correctly return the classroom by UUID', async function () {
            let mockClassroom = new Classroom(4,  "Java classroom", "Classroom for the Java subject");

            const response = await request(app).get('/api/v1/classrooms/' + uuid);
            response.body._uuid = ""; // Delete UUID for comparing object result

            assert.equal(response.status, 200);
            assert.equal(JSON.stringify(response.body), JSON.stringify(mockClassroom));
        });

        it('Should return an 404 not found', async function () {
            const response = await request(app).get('/api/v1/classrooms/40');

            assert.equal(response.status, 404);
        });
    });

    describe('PUT /classrooms/:id', function () {
        it('Should edit the classroom', async function () {
            let classroomRequest: ClassroomRequest = { name: 'C# classroom edited', description: "Edited classroom for the C# subject", password: ""}

            let mockClassroom = new Classroom(3,  "C# classroom edited", "Edited classroom for the C# subject");

            const response = await request(app).put('/api/v1/classrooms/3').send(classroomRequest);

            assert.equal(response.status, 200);
            assert.equal(JSON.stringify(response.body), JSON.stringify(mockClassroom));
        });

        it('Should return an 404 not found', async function () {
            let classroomRequest: ClassroomRequest = { name: 'C# classroom edited', description: "Edited classroom for the C# subject", password: ""}

            const response = await request(app).put('/api/v1/classrooms/40').send(classroomRequest);

            assert.equal(response.status, 404);
        });

        it('Should give an input validation error on wrong parameters (400)', async function () {
            let classroomRequest: any = { badname: 'C# classroom edited', description: "Edited classroom for the C# subject" }

            const response = await request(app).put('/api/v1/classrooms/3').send(classroomRequest);
            assert.equal(response.status, 400);
        });
    });

    describe('DELETE /classrooms/:id', function () {
        it('Should return an 404 not found', async function () {
            const response = await request(app).delete('/api/v1/classrooms/40');

            assert.equal(response.status, 404);
        });

        it('Should return a foreign key violation error - 422', async function () {
            const response = await request(app).delete('/api/v1/classrooms/3');

            assert.equal(response.status, 422);
        });

        it('Should delete the classroom', async function () {
            const deleteResponse = await request(app).delete('/api/v1/classrooms/4');
            assert.equal(deleteResponse.status, 200);

            const getResponse = await request(app).get('/api/v1/classrooms/4');
            assert.equal(getResponse.status, 404);
        });
    });

});