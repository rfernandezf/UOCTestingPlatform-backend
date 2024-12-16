import request from 'supertest';
import * as fs from "fs";
import * as path from 'path';
import { ExecutionPlatform } from '@controllers/executionPlatformController';
import { app, server } from 'src/app';
import { ExecutionPlatformRequest } from '@interfaces/executionPlatform';
import { environment } from '@utils/environment';

var assert = require('assert');

describe('API REST - /api/v1/platforms', function () {

    let javaPlatformScript: string = `#!/bin/bash\n\ngradle clean test | awk '/[a-zA-Z0-9]* > [a-zA-Z0-9]*.* ((PASSED)|(FAILED))/ { printf "{\\"name\\": \\"%s\\", \\"method\\": \\"%s\\", \\"status\\": \\"%s\\"}" , $1, $3, $NF; fflush() }'`;

    afterEach(() => { server.close(); })
      
    describe('GET /platforms', function () {
        it('Should correctly return the platforms', async function () {
            const mockPlatforms: Array<ExecutionPlatform> = [
                new ExecutionPlatform(2,  "python_renamed"),
                new ExecutionPlatform(3,  "csharp")
            ];

            const response = await request(app).get('/api/v1/platforms');

            assert.equal(response.status, 200);
            assert.equal(JSON.stringify(response.body), JSON.stringify(mockPlatforms));
        });
    });

    describe('POST /platforms', function () {
        it('Should create a new platform', async function () {
            let platformRequest: ExecutionPlatformRequest = { name: 'Java platform' }

            let mockPlatform = new ExecutionPlatform(4,  "Java platform");

            const response = await request(app).post('/api/v1/platforms').send(platformRequest);
            assert.equal(response.status, 200);
            assert.equal(JSON.stringify(response.body), JSON.stringify(mockPlatform));

            // Check folder creation
            assert(fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, mockPlatform.internalName)));
        });

        it('Should give an input validation error on wrong parameters (400)', async function () {
            let platformRequest: any = { badname: 'Java platform' }

            const response = await request(app).post('/api/v1/platforms').send(platformRequest);
            assert.equal(response.status, 400);
        });

        it('Should give a foreign key error on duplicate name (409)', async function () {
            let platformRequest: ExecutionPlatformRequest = { name: 'Java platform' }

            const response = await request(app).post('/api/v1/platforms').send(platformRequest);
            assert.equal(response.status, 409);
        });
    });

    describe('GET /platforms/:id', function () {
        it('Should correctly return the platform', async function () {
            let mockPlatform = new ExecutionPlatform(4,  "Java platform");

            const response = await request(app).get('/api/v1/platforms/4');

            assert.equal(response.status, 200);
            assert.equal(JSON.stringify(response.body), JSON.stringify(mockPlatform));
        });

        it('Should return an 404 not found', async function () {
            const response = await request(app).get('/api/v1/platforms/40');

            assert.equal(response.status, 404);
        });
    });

    describe('PUT /platforms/:id', function () {
        it('Should edit the platform', async function () {
            let platformRequest: ExecutionPlatformRequest = { name: 'csharp_edit' }

            let mockPlatform = new ExecutionPlatform(3,  "csharp_edit");

            const response = await request(app).put('/api/v1/platforms/3').send(platformRequest);
            assert.equal(response.status, 200);
            assert.equal(JSON.stringify(response.body), JSON.stringify(mockPlatform));

            // Check folder creation
            assert(fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, mockPlatform.internalName)));
        });

        it('Should return an 404 not found', async function () {
            let platformRequest: ExecutionPlatformRequest = { name: 'csharp_edit' }

            const response = await request(app).put('/api/v1/platforms/40').send(platformRequest);

            assert.equal(response.status, 404);
        });

        it('Should give an input validation error on wrong parameters (400)', async function () {
            let platformRequest: any = { badname: 'csharp_edit_2' }

            const response = await request(app).put('/api/v1/platforms/3').send(platformRequest);
            assert.equal(response.status, 400);
        });
    });

    describe('DELETE /platforms/:id', function () {
        it('Should return an 404 not found', async function () {
            const response = await request(app).delete('/api/v1/platforms/40');

            assert.equal(response.status, 404);
        });

        it('Should delete the platform', async function () {
            const deleteResponse = await request(app).delete('/api/v1/platforms/2');
            assert.equal(deleteResponse.status, 200);

            const getResponse = await request(app).get('/api/v1/platforms/2');
            assert.equal(getResponse.status, 404);
        });
    });

    describe('PUT /platforms/:id/script', () => {

        it('Should return an 404 not found', async () => {
            const response = await request(app).put('/api/v1/platforms/40/script').send(javaPlatformScript);

            assert.equal(response.status, 404);
        });

        it('Should create the script file', async () => {
            let mockPlatform = new ExecutionPlatform(4,  "Java platform");

            const response = await request(app).put('/api/v1/platforms/4/script').set("Content-type", "text/plain").send(javaPlatformScript);

            assert.equal(response.status, 200);

            // Check file and file content
            if(fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, mockPlatform.internalName, environment.platforms.scriptName)))
            {
                let readBuffer = fs.readFileSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, mockPlatform.internalName, environment.platforms.scriptName));
                assert.equal(JSON.stringify(javaPlatformScript), JSON.stringify(readBuffer.toString()));
            }

            else assert(false);
        });
    });    
    
    describe('GET /platforms/:id/script', async function () {
        it('Should return an 404 not found', async () => {
            const response = await request(app).get('/api/v1/platforms/40/script');

            assert.equal(response.status, 404);
        });

        it('Should return the script file', async () => {
            const response = await request(app).get('/api/v1/platforms/4/script');

            assert.equal(response.status, 200);
            assert.equal(javaPlatformScript, response.text);
        });
    });
});