import request from 'supertest';
import * as fs from "fs";
import * as path from 'path';
global.EventSource = require('eventsource');
import * as http from 'http';
import { app, server } from 'src/app';
import { AssessmentRequest } from '@interfaces/assessment';
import { Assessment } from '@controllers/assessmentController';
import { dateToEpoch, epochToDate } from '@utils/dbUtils';
import { environment } from '@utils/environment';
import { SSEConnectionHandler } from 'src/sse/sseConnection';

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
            const deleteResponse = await request(app).delete('/api/v1/assessments/3');
            assert.equal(deleteResponse.status, 200);

            const getResponse = await request(app).get('/api/v1/assessments/3');
            assert.equal(getResponse.status, 404);
        });
    });

    describe('POST /assessments/:id/files', () => {
        it('Should return an 404 not found', async () => {
            const response = await request(app).post('/api/v1/assessments/40/files');

            assert.equal(response.status, 404);
        });

        it('Should return an 400 when no files attached', async () => {
            const response = await request(app).post('/api/v1/assessments/4/files');

            assert.equal(response.status, 400);
        });

        it('Should upload the test files', async () => {
            const response = await request(app).post('/api/v1/assessments/4/files').attach('file', path.join(__dirname, '../../test/assessment_fake_test_files.zip'));
            assert.equal(response.status, 200);

            const getResponse = await request(app).get('/api/v1/assessments/4');
            assert.equal(getResponse.status, 200);

            // Check if file were uploaded successfully
            let assessment: any = getResponse.body;
            assert(fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment._testPath, assessment._fileName)));
        });
    });

    describe('DELETE /assessments/:id/files', () => {
        it('Should delete the test files', async () => {
            const getResponse = await request(app).get('/api/v1/assessments/4');
            assert.equal(getResponse.status, 200);
            let assessment: any = getResponse.body;            
            
            const response = await request(app).delete('/api/v1/assessments/4/files');
            assert.equal(response.status, 200);

            // Check if file has been deleted or not
            assert(!fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, assessment._testPath, assessment._fileName)));
        });

        it('Should return an 404 not found', async () => {
            const response = await request(app).delete('/api/v1/assessments/40/files');

            assert.equal(response.status, 404);
        });
    });

    describe('POST assessments/:id/run/:sseClientId', () => {
        let sseConnectionID = "";
        
        it('Should return an 404 assessment not found', async () => {
            const response = await request(app).post('/api/v1/assessments/40/run/my-sse-id-here');

            assert.equal(response.status, 404);
        });

        it('Should return an 412 no unitary tests found', async () => {
            const response = await request(app).post('/api/v1/assessments/2/run/my-sse-id-here');

            assert.equal(response.status, 412);
        });

        it('Should return an 412 no SSE connection with the client', async () => {
            // Upload test file again
            const uploadResponse = await request(app).post('/api/v1/assessments/4/files').attach('file', path.join(__dirname, '../../test/assessment_fake_test_files.zip'));
            assert.equal(uploadResponse.status, 200);

            // Check no SSE session error
            const response = await request(app).post('/api/v1/assessments/4/run/my-sse-id-here');
            assert.equal(response.status, 412);
        });

        it('Should return an 400 when no files attached', async () => {
            let sseData: SSETestConn = await getSSEConnection();
            let sseClientID = sseData.clientID;
            let sseSession = sseData.sseSession;
            let server = sseData.server;

            const response = await request(app).post('/api/v1/assessments/4/run/' + sseClientID);
            assert.equal(response.status, 400);

            sseSession.close();
            server.close();
        });

        it('Should return 202 and start to run the tests', async () => {
            let sseData: SSETestConn = await getSSEConnection();
            let sseClientID = sseData.clientID;
            let sseSession = sseData.sseSession;
            let server = sseData.server;

            const response = await request(app).post('/api/v1/assessments/4/run/' + sseClientID).attach('file', path.join(__dirname, '../../test/assessment_fake_code.zip'));
            assert.equal(response.status, 202);

            sseSession.close();
            server.close();
        });
    });

    interface SSETestConn {clientID: string, sseSession: EventSource, server: http.Server};

    async function getSSEConnection(): Promise<SSETestConn>
    {
        return new Promise(async (resolve, reject) => {
            app.get('/api/v1/sse', SSEConnectionHandler.getInstance().createConnection());
            let server = app.listen(8080);

            const sseSession = new EventSource('http://localhost:8080/api/v1/sse');

            sseSession.onerror = (e) => { 
                console.log('ERROR: ', e);
                sseSession.close();
                reject();
            }

            sseSession.onmessage = (e) => {
                let clientID = JSON.parse(e.data).clientId;
                resolve({clientID, sseSession, server});
            }
        });
    }
});