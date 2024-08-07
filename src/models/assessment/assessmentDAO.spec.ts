import { Assessment } from "@controllers/assessment/assessment";
import { AssessmentDAO } from "./assessmentDAO";


var assert = require('assert');
function iThrowError(err: string) {
    console.log(err)
}

describe('Assessment DAO testing', function () {
    let assessmentDAO: AssessmentDAO = new AssessmentDAO();

    let assessmentJava = new Assessment(0, 'Java Assessment', 'New PAC assessment in Java', new Date(), new Date(), 1, 1, 'path/here');
    let assessmentPython = new Assessment(0, 'Python Assessment', 'New PAC assessment in Python', new Date(), new Date(), 2, 2, 'path/here');
    let assessmentCSharp = new Assessment(0, 'C# Assessment', 'New PAC assessment in C#', new Date(), new Date(), 3, 3, 'path/here');

    describe('Insert elements', function () {
        it('Should correctly insert the elements', async function () {

            await assessmentDAO.create(assessmentJava)
            .then((res: Assessment)=> {
                assert.equal(assessmentJava.name, res.name);
                assert.equal(assessmentJava.description, res.description);
                assert.equal(assessmentJava.publishDate.toDateString(), res.publishDate.toDateString());
                assert.equal(assessmentJava.expirationDate.toDateString(), res.expirationDate.toDateString());
                assert.equal(assessmentJava.executionPlatformID, res.executionPlatformID);
                assert.equal(assessmentJava.classroomID, res.classroomID);
                assert.equal(assessmentJava.testPath, res.testPath);
                assessmentJava = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            await assessmentDAO.create(assessmentPython)
            .then((res: Assessment)=> {
                assert.equal(assessmentPython.name, res.name);
                assert.equal(assessmentPython.description, res.description);
                assert.equal(assessmentPython.publishDate.toDateString(), res.publishDate.toDateString());
                assert.equal(assessmentPython.expirationDate.toDateString(), res.expirationDate.toDateString());
                assert.equal(assessmentPython.executionPlatformID, res.executionPlatformID);
                assert.equal(assessmentPython.classroomID, res.classroomID);
                assert.equal(assessmentPython.testPath, res.testPath);
                assessmentPython = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'Second assert failed');
            });

            await assessmentDAO.create(assessmentCSharp)
            .then((res: Assessment)=> {
                assert.equal(assessmentCSharp.name, res.name);
                assert.equal(assessmentCSharp.description, res.description);
                assert.equal(assessmentCSharp.publishDate.toDateString(), res.publishDate.toDateString());
                assert.equal(assessmentCSharp.expirationDate.toDateString(), res.expirationDate.toDateString());
                assert.equal(assessmentCSharp.executionPlatformID, res.executionPlatformID);
                assert.equal(assessmentCSharp.classroomID, res.classroomID);
                assert.equal(assessmentCSharp.testPath, res.testPath);
                assessmentCSharp = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'Third assert failed');
            });
            });
    });

    describe('Get one element', function () {
        it('Should correctly get the element', async function () {
            await assessmentDAO.get(2)
            .then((res: Assessment)=> {
                assert.equal(assessmentPython.name, res.name);
                assert.equal(assessmentPython.description, res.description);
                assert.equal(assessmentPython.publishDate.toDateString(), res.publishDate.toDateString());
                assert.equal(assessmentPython.expirationDate.toDateString(), res.expirationDate.toDateString());
                assert.equal(assessmentPython.executionPlatformID, res.executionPlatformID);
                assert.equal(assessmentPython.classroomID, res.classroomID);
                assert.equal(assessmentPython.testPath, res.testPath);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });
        });
    });

    describe('Update one element', function () {
        it('Should correctly update the element', async function () {
            assessmentPython.name = 'Python Renamed Assessment';
            assessmentPython.description = 'Renamed PAC assessment in Python';
            assessmentPython.publishDate = new Date();
            assessmentPython.expirationDate = new Date();
            assessmentPython.executionPlatformID = 5;
            assessmentPython.classroomID = 5;
            assessmentPython.testPath = 'modified/path/here';

            await assessmentDAO.update(assessmentPython)
            .then((res: Assessment)=> {
                assert.equal(assessmentPython.name, res.name);
                assert.equal(assessmentPython.description, res.description);
                assert.equal(assessmentPython.publishDate.toDateString(), res.publishDate.toDateString());
                assert.equal(assessmentPython.expirationDate.toDateString(), res.expirationDate.toDateString());
                assert.equal(assessmentPython.executionPlatformID, res.executionPlatformID);
                assert.equal(assessmentPython.classroomID, res.classroomID);
                assert.equal(assessmentPython.testPath, res.testPath);
                assessmentPython = res;
            })
            .catch((err) => {
                console.log(err)
                assert.throws(iThrowError, 'First assert failed');
            });

            await assessmentDAO.get(2)
            .then((res: Assessment)=> {
                assert.equal('Python Renamed Assessment', res.name);
                assert.equal('Renamed PAC assessment in Python', res.description);
                assert.equal(assessmentPython.publishDate.toDateString(), res.publishDate.toDateString());
                assert.equal(assessmentPython.expirationDate.toDateString(), res.expirationDate.toDateString());
                assert.equal(5, res.executionPlatformID);
                assert.equal(5, res.classroomID);
                assert.equal('modified/path/here', res.testPath);
            })
            .catch(() => {
                assert.throws(iThrowError, 'Second assert failed');
            });
        });
    });

    describe('Delete one element', function () {
        it('Should correctly delete the element', async function () {
            // Delete element
            await assessmentDAO.delete(assessmentJava)
            .then(() => {
                assert.equal(1, 1);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            // Check it's deleted
            await assessmentDAO.get(1)
            .then((res: Assessment)=> {
                assert.throws(iThrowError, 'Second assert failed');
            })
            .catch(() => {
                assert.equal(1, 1);
            });
        });
    });

    describe('Get all elements', function () {
        it('Should return the expected elements on the database', async function () {

        let elements: Array<Assessment> = await assessmentDAO.getAll();
    
        // Assert array lengths are equal
        assert.equal(elements.length, 2);

        // Check names one by one
        assert.equal(elements[0].name, assessmentPython.name);
        assert.equal(elements[1].name, assessmentCSharp.name);

        });
    });

});