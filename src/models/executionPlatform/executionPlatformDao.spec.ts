import { ExecutionPlatform } from "@controllers/executionPlatform/executionPlatform";
import { ExecutionPlatformDAO } from "./executionPlatformDAO";

var assert = require('assert');
function iThrowError() {
    throw new Error("Error thrown");
}

describe('Execution Platform DAO testing', function () {
    let executionPlatformDAO: ExecutionPlatformDAO = new ExecutionPlatformDAO();

    let javaPlatform = new ExecutionPlatform(0, 'java');
    let pythonPlatform = new ExecutionPlatform(0, 'pythonPlatform');
    let csharpPlatform = new ExecutionPlatform(0, 'csharpPlatform');

    describe('Insert one element', function () {
        it('Should correctly insert the element', async function () {

            await executionPlatformDAO.create(javaPlatform)
            .then((res: ExecutionPlatform)=> {
                assert.equal(javaPlatform.name, res.name);
                javaPlatform = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            await executionPlatformDAO.create(pythonPlatform)
            .then((res: ExecutionPlatform)=> {
                assert.equal(pythonPlatform.name, res.name);
                pythonPlatform = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'Second assert failed');
            });

            await executionPlatformDAO.create(csharpPlatform)
            .then((res: ExecutionPlatform)=> {
                assert.equal(csharpPlatform.name, res.name);
                csharpPlatform = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'Third assert failed');
            });
            });
    });

    describe('Get all elements', function () {
        it('Should return the expected elements on the database', async function () {

        (await executionPlatformDAO.getAll()).length;
        

        // Assert array lengths are equal
        assert.equal((await executionPlatformDAO.getAll()).length, 3);

        });
    });

});