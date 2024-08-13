import request from 'supertest';
import { app, server } from 'src/app';
import { AssessmentRequest } from '@interfaces/assessment';
import { Assessment } from '@controllers/assessmentController';
import { dateToEpoch, epochToDate } from '@utils/dbUtils';

var assert = require('assert');

describe('API REST - /api/v1/assessments', () => {

    afterEach(() => { server.close(); })

    let mockAssessments: Array<Assessment> = [];
      
    describe('GET /assessments', () => {
        it('Should correctly return the assessments', async () => {
            const response = await request(app).get('/api/v1/assessments');

            assert.equal(response.status, 200);
            assert.equal(response.body[0]._name, "Python Renamed Assessment");
            assert.equal(response.body[1]._name, "C# Assessment");

            mockAssessments.push(response.body[0] as Assessment);
            mockAssessments.push(response.body[1] as Assessment);
        });
    });

    describe('POST /assessments', () => {
        it('Should create a new assessment', async () => {
            let assessmentRequest: AssessmentRequest = {
                name: 'Java assessment',
                description: 'Java assessment description',
                publish_date: dateToEpoch(new Date()),
                expiration_date: dateToEpoch(new Date()),
                platform_id: 4,
                classroom_id: 3
            }

            let mockAssessment = new Assessment(
                4,  
                assessmentRequest.name, 
                assessmentRequest.description, 
                epochToDate(assessmentRequest.publish_date), 
                epochToDate(assessmentRequest.expiration_date), 
                assessmentRequest.platform_id, 
                assessmentRequest.classroom_id);

            const response = await request(app).post('/api/v1/assessments').send(assessmentRequest);
            assert.equal(response.status, 200);
            assert.equal(response.body, mockAssessment.toString());

            mockAssessments.push(response.body);
        });

        it('Should give an input validation error on wrong parameters (400)', async () => {
            let assessmentRequest: any = {
                badname: 'Java assessment',
                description: 'Java assessment description',
                publish_date: dateToEpoch(new Date()),
                expiration_date: dateToEpoch(new Date()),
                platform_id: 4,
                classroom_id: 3
            }

            const response = await request(app).post('/api/v1/assessments').send(assessmentRequest);
            assert.equal(response.status, 400);
        });

        it('Should give a conflict error on duplicate name (409)', async () => {
            let assessmentRequest: AssessmentRequest = {
                name: 'Java assessment',
                description: 'Java assessment description',
                publish_date: dateToEpoch(new Date()),
                expiration_date: dateToEpoch(new Date()),
                platform_id: 4,
                classroom_id: 3
            }

            const response = await request(app).post('/api/v1/assessments').send(assessmentRequest);
            assert.equal(response.status, 409);
        });

        it('Should give a foreign key error on unexistant platform id (422)', async () => {
            let assessmentRequest: AssessmentRequest = {
                name: 'Assessment 2',
                description: 'Java assessment description',
                publish_date: dateToEpoch(new Date()),
                expiration_date: dateToEpoch(new Date()),
                platform_id: 40,
                classroom_id: 3
            }

            const response = await request(app).post('/api/v1/assessments').send(assessmentRequest);
            assert.equal(response.status, 422);
        });

        it('Should give a foreign key error on unexistant classroom id (422)', async () => {
            let assessmentRequest: AssessmentRequest = {
                name: 'Assessment 2',
                description: 'Java assessment description',
                publish_date: dateToEpoch(new Date()),
                expiration_date: dateToEpoch(new Date()),
                platform_id: 4,
                classroom_id: 30
            }

            const response = await request(app).post('/api/v1/assessments').send(assessmentRequest);
            assert.equal(response.status, 422);
        });
    });

    describe('GET /assessments/:id', () => {
        it('Should correctly return the assessment', async () => {
            const response = await request(app).get('/api/v1/assessments/4');

            assert.equal(response.status, 200);
            assert.equal(response.body, mockAssessments[2].toString());
        });

        it('Should return an 404 not found', async () => {
            const response = await request(app).get('/api/v1/assessments/40');

            assert.equal(response.status, 404);
        });
    });

    describe('PUT /assessments/:id', () => {
        it('Should edit the assessment', async () => {
            let assessmentRequest: AssessmentRequest = {
                name: 'Java assessment edited',
                description: 'Java assessment description edited',
                publish_date: dateToEpoch(new Date()),
                expiration_date: dateToEpoch(new Date()),
                platform_id: 4,
                classroom_id: 3
            }

            mockAssessments[2].name = 'Java assessment edited';
            mockAssessments[2].description = 'Java assessment description edited';

            const response = await request(app).put('/api/v1/assessments/4').send(assessmentRequest);
            assert.equal(response.status, 200);
            assert.equal(response.body, mockAssessments[2].toString());
        });

        it('Should return an 404 not found', async () => {
            let assessmentRequest: AssessmentRequest = {
                name: 'Java assessment edited',
                description: 'Java assessment description edited',
                publish_date: dateToEpoch(new Date()),
                expiration_date: dateToEpoch(new Date()),
                platform_id: 4,
                classroom_id: 3
            }

            const response = await request(app).put('/api/v1/assessments/40').send(assessmentRequest);

            assert.equal(response.status, 404);
        });

        it('Should give an input validation error on wrong parameters (400)', async () => {
            let assessmentRequest: any = {
                badname: 'Java assessment edited',
                description: 'Java assessment description edited',
                publish_date: dateToEpoch(new Date()),
                expiration_date: dateToEpoch(new Date()),
                platform_id: 4,
                classroom_id: 3
            }

            const response = await request(app).put('/api/v1/assessments/3').send(assessmentRequest);
            assert.equal(response.status, 400);
        });
    });

    describe('DELETE /assessments/:id', () => {
        it('Should return an 404 not found', async () => {
            const response = await request(app).delete('/api/v1/assessments/40');

            assert.equal(response.status, 404);
        });

        it('Should delete the assessment', async () => {
            const deleteResponse = await request(app).delete('/api/v1/assessments/4');
            assert.equal(deleteResponse.status, 200);

            const getResponse = await request(app).get('/api/v1/assessments/4');
            assert.equal(getResponse.status, 404);
        });
    });

    describe('POST /assessments/:id/files', () => {
        it('Should return an 404 not found', async () => {
            // TO DO
        });

        it('Should return an 400 when no files attached', async () => {
            // TO DO
        });

        it('Should upload the test files', async () => {
            // TO DO
        });
    });

    describe('DELETE /assessments/:id/files', () => {
        it('Should delete the test files', async () => {
            // TO DO
        });

        it('Should return an 404 not found', async () => {
            // TO DO
        });
    });

    describe('POST assessments/:id/run/:sseClientId', () => {
        it('Should return an 404 assessment not found', async () => {
            // TO DO
        });

        it('Should return an 412 no unitary tests found', async () => {
            // TO DO
        });

        it('Should return an 400 no SSE connection with the client', async () => {
            // TO DO
        });

        it('Should return an 412 no unitary tests found', async () => {
            // TO DO
        });

        it('Should return an 400 when no files attached', async () => {
            // TO DO
        });

        it('Should return 202 and start to run the tests', async () => {
            // TO DO
        });
    });
});