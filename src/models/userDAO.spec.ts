
import { User } from "@controllers/user";
import { UserDAO } from "./userDAO";
import { UserRole } from "@interfaces/controllers/user";

var assert = require('assert');
function iThrowError(err: string) {
    console.log(err)
}

describe('User DAO testing', function () {
    let userDAO: UserDAO = new UserDAO();

    let user1 = new User(0, 'Rafael', 'Fernández Flores', 'rfernandezflo@uoc.edu', '1234', UserRole.ADMIN);
    let user2 = new User(0, 'David', 'García Solórzano', 'dgarciaso@uoc.edu', '4321', UserRole.ADMIN);
    let user3 = new User(0, 'Juan', 'John Doe', 'juanjohndoe@uoc.edu', '0000', UserRole.STUDENT);

    describe('Insert elements', function () {
        it('Should correctly insert the elements', async function () {

            await userDAO.create(user1)
            .then((res: User)=> {
                assert.equal(user1.name, res.name);
                assert.equal(user1.surnames, res.surnames);
                assert.equal(user1.email, res.email);
                assert.equal(user1.password, res.password);
                assert.equal(user1.userRole, res.userRole);
                user1 = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            await userDAO.create(user2)
            .then((res: User)=> {
                assert.equal(user2.name, res.name);
                assert.equal(user2.surnames, res.surnames);
                assert.equal(user2.email, res.email);
                assert.equal(user2.password, res.password);
                assert.equal(user2.userRole, res.userRole);
                user2 = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'Second assert failed');
            });

            await userDAO.create(user3)
            .then((res: User)=> {
                assert.equal(user3.name, res.name);
                assert.equal(user3.surnames, res.surnames);
                assert.equal(user3.email, res.email);
                assert.equal(user3.password, res.password);
                assert.equal(user3.userRole, res.userRole);
                user3 = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'Third assert failed');
            });
            });
    });

    describe('Get one element', function () {
        it('Should correctly get the element', async function () {
            await userDAO.get(2)
            .then((res: User)=> {
                assert.equal(user2.name, res.name);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });
        });
    });

    describe('Update one element', function () {
        it('Should correctly update the element', async function () {
            user2.name = 'Juan David';
            user2.surnames = 'G. Solórzano';
            user2.email = 'DGarciaso@uoc.edu';
            user2.password = '43214321';
            user2.userRole = 2;

            await userDAO.update(user2)
            .then((res: User)=> {
                assert.equal(user2.name, res.name);
                assert.equal(user2.surnames, res.surnames);
                assert.equal(user2.email, res.email);
                assert.equal(user2.password, res.password);
                assert.equal(user2.userRole, res.userRole);
                user2 = res;
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            await userDAO.get(2)
            .then((res: User)=> {
                assert.equal('Juan David', res.name);
                assert.equal('G. Solórzano', res.surnames);
                assert.equal('DGarciaso@uoc.edu', res.email);
                assert.equal('43214321', res.password);
                assert.equal(2, res.userRole);
            })
            .catch(() => {
                assert.throws(iThrowError, 'Second assert failed');
            });
        });
    });

    describe('Delete one element', function () {
        it('Should correctly delete the element', async function () {
            // Delete element
            await userDAO.delete(user1.id)
            .then(() => {
                assert.equal(1, 1);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            // Check it's deleted
            await userDAO.get(1)
            .then((res: User)=> {
                assert.throws(iThrowError, 'Second assert failed');
            })
            .catch(() => {
                assert.equal(1, 1);
            });
        });
    });

    describe('Get all elements', function () {
        it('Should return the expected elements on the database', async function () {

        let elements: Array<User> = await userDAO.getAll();
    
        // Assert array lengths are equal
        assert.equal(elements.length, 2);

        // Check names one by one
        assert.equal(elements[0].name, user2.name);
        assert.equal(elements[1].name, user3.name);

        });
    });

});