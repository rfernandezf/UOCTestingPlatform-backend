import request from 'supertest';
import { ExecutionPlatform } from '@controllers/executionPlatformController';
import { app, server } from 'src/app';

var assert = require('assert');
function iThrowError(err: string) {
    console.log(err)
}

describe('API REST - /api/v1/platforms', function () {

    afterEach(() => { server.close(); })
      
    describe('GET /platforms', function () {
        it('Should correctly return the platforms', async function () {
            const mockPlatforms: Array<ExecutionPlatform> = [
                new ExecutionPlatform(2,  "python_renamed"),
                new ExecutionPlatform(3,  "csharp")
            ];

            const response = await request(app).get('/api/v1/platforms');

            assert.equal(response.status, 200);
            assert.equal(response.body, mockPlatforms.toString());
        });
    });

});