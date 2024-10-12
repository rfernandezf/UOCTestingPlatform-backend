import { Classroom } from "@controllers/classroomControlller";
import { ClassroomDAO } from "./classroomDAO";

var assert = require('assert');
function iThrowError(err: string) {
    console.log(err)
}

describe('Classroom DAO testing', function () {
    let classroomDAO: ClassroomDAO = new ClassroomDAO();

    let classroom1 = new Classroom(0, 'Java classroom', 'Classroom for the Java subject', '1234');
    let classroom2 = new Classroom(0, 'Python classroom', 'Classroom for the Python subject', '4321');
    let classroom3 = new Classroom(0, 'C# classroom', 'Classroom for the C# subject', '0000');

    describe('Insert elements', function () {
        it('Should correctly insert the elements', async function () {

            await classroomDAO.create(classroom1)
            .then((res: Classroom)=> {
                assert.equal(classroom1.name, res.name);
                assert.equal(classroom1.description, res.description);
                classroom1 = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            await classroomDAO.create(classroom2)
            .then((res: Classroom)=> {
                assert.equal(classroom2.name, res.name);
                assert.equal(classroom2.description, res.description);
                classroom2 = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'Second assert failed');
            });

            await classroomDAO.create(classroom3)
            .then((res: Classroom)=> {
                assert.equal(classroom3.name, res.name);
                assert.equal(classroom3.description, res.description);
                classroom3 = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'Third assert failed');
            });
            });
    });

    describe('Get one element', function () {
        let uuid: string = '';

        it('Should correctly get the element by id', async function () {
            await classroomDAO.get(2)
            .then((res: Classroom)=> {
                assert.equal(classroom2.name, res.name);
                assert.equal(classroom2.description, res.description);
                assert.equal(classroom2.uuid, res.uuid);
                assert.equal(classroom2.password, res.password);

                uuid = res.uuid;
            })
            .catch(() => {
                
                assert.throws(iThrowError, 'First assert failed');
            });
        });

        it('Should correctly get the element by uuid', async function () {
            await classroomDAO.getByUUID(uuid)
            .then((res: Classroom)=> {
                assert.equal(classroom2.name, res.name);
                assert.equal(classroom2.description, res.description);
            })
            .catch(() => {
                
                assert.throws(iThrowError, 'First assert failed');
            });
        });
    });

    describe('Update one element', function () {
        it('Should correctly update the element', async function () {
            classroom2.name = 'Renamed Python classroom';
            classroom2.description = 'Renamed classroom for the Python subject';
            classroom2.password = 'MyNewPasswordHere';

            await classroomDAO.update(classroom2)
            .then((res: Classroom)=> {
                assert.equal(classroom2.name, res.name);
                assert.equal(classroom2.description, res.description);
                assert.equal(classroom2.uuid, res.uuid);
                assert.equal(classroom2.password, res.password);
                classroom2 = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            await classroomDAO.get(2)
            .then((res: Classroom)=> {
                assert.equal('Renamed Python classroom', res.name);
                assert.equal('Renamed classroom for the Python subject', res.description);
                assert.equal(classroom2.uuid, res.uuid);
                assert.equal('MyNewPasswordHere', res.password);
            })
            .catch(() => {
                assert.throws(iThrowError, 'Second assert failed');
            });
        });
    });

    describe('Delete one element', function () {
        it('Should correctly delete the element', async function () {
            // Delete element
            await classroomDAO.delete(classroom1.id)
            .then(() => {
                assert.equal(1, 1);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            // Check it's deleted
            await classroomDAO.get(1)
            .then((res: Classroom)=> {
                assert.throws(iThrowError, 'Second assert failed');
            })
            .catch(() => {
                assert.equal(1, 1);
            });
        });
    });

    describe('Get all elements', function () {
        it('Should return the expected elements on the database', async function () {

        let elements: Array<Classroom> = await classroomDAO.getAll();
    
        // Assert array lengths are equal
        assert.equal(elements.length, 2);

        // Check names one by one
        assert.equal(elements[0].name, classroom2.name);
        assert.equal(elements[1].name, classroom3.name);

        });
    });

});