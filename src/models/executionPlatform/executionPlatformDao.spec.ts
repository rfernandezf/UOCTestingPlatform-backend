import { ExecutionPlatform } from "@controllers/executionPlatform/executionPlatform";
import { ExecutionPlatformDAO } from "./executionPlatformDAO";

var assert = require('assert');
function iThrowError(err: string) {
    console.log(err)
}

describe('Execution Platform DAO testing', function () {
    let executionPlatformDAO: ExecutionPlatformDAO = new ExecutionPlatformDAO();

    let javaPlatform = new ExecutionPlatform(0, 'java');
    let pythonPlatform = new ExecutionPlatform(0, 'python');
    let csharpPlatform = new ExecutionPlatform(0, 'csharp');

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

    describe('Get one element', function () {
        it('Should correctly get the element', async function () {
            await executionPlatformDAO.get(2)
            .then((res: ExecutionPlatform)=> {
                assert.equal(pythonPlatform.name, res.name);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });
        });
    });

    describe('Update one element', function () {
        it('Should correctly update the element', async function () {
            pythonPlatform.name = 'python_renamed';

            await executionPlatformDAO.update(pythonPlatform)
            .then((res: ExecutionPlatform)=> {
                assert.equal(pythonPlatform.name, res.name);
                pythonPlatform = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            await executionPlatformDAO.get(2)
            .then((res: ExecutionPlatform)=> {
                assert.equal('python_renamed', res.name);
            })
            .catch(() => {
                assert.throws(iThrowError, 'Second assert failed');
            });
        });
    });

    describe('Delete one element', function () {
        it('Should correctly delete the element', async function () {
            // Delete element
            await executionPlatformDAO.delete(javaPlatform)
            .then(() => {
                assert.equal(1, 1);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            // Check it's deleted
            await executionPlatformDAO.get(1)
            .then((res: ExecutionPlatform)=> {
                assert.throws(iThrowError, 'Second assert failed');
            })
            .catch(() => {
                assert.equal(1, 1);
            });
        });
    });

    describe('Get all elements', function () {
        it('Should return the expected elements on the database', async function () {

        let elements: Array<ExecutionPlatform> = await executionPlatformDAO.getAll();
    
        // Assert array lengths are equal
        assert.equal(elements.length, 2);

        // Check names one by one
        assert.equal(elements[0].name, pythonPlatform.name);
        assert.equal(elements[1].name, csharpPlatform.name);

        });
    });

});