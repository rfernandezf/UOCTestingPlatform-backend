import { ClassroomsUsersDAO } from "./classroomsUsersDAO";
import { ClassroomDAO } from "./classroomDAO";
import { UserDAO } from "./userDAO";
import { User } from "@controllers/user";
import { Classroom } from "@controllers/classroom";

var assert = require('assert');
function iThrowError(err: string) {
    console.log(err)
}

describe('Classrooms-Users DAO testing', function () {
    let classroomsUsersDAO: ClassroomsUsersDAO = new ClassroomsUsersDAO();
    let classroomDAO: ClassroomDAO = new ClassroomDAO();
    let userDAO: UserDAO = new UserDAO();
    
    describe('Add users to classrooms', function () {
        it('Should correctly insert the elements', async function () {
            let classrooms = await classroomDAO.getAll();
            let users = await userDAO.getAll();

            await classroomsUsersDAO.addUserToClassroom(users[0], classrooms[0])
            .then(() => {
                assert.equal(1, 1);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            await classroomsUsersDAO.addUserToClassroom(users[0], classrooms[1])
            .then(() => {
                assert.equal(1, 1);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            await classroomsUsersDAO.addUserToClassroom(users[1], classrooms[0])
            .then(()=> {
                assert.equal(1, 1);
            })
            .catch(() => {
                assert.throws(iThrowError, 'Second assert failed');
            });

            await classroomsUsersDAO.addUserToClassroom(users[1], classrooms[1])
            .then(()=> {
                assert.equal(1, 1);
            })
            .catch(() => {
                assert.throws(iThrowError, 'Second assert failed');
            });
        });
    });

    describe('Get users in classrooms', function () {
        it('Should correctly get the element', async function () {
            let classrooms = await classroomDAO.getAll();
            let users = await userDAO.getAll();

            await classroomsUsersDAO.getUsersInClassroom(classrooms[0])
            .then((res: Array<User>)=> {
                assert.equal(res[0].name, users[0].name);
                assert.equal(res[1].name, users[1].name);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });
        });
    });

    describe('Get classrooms in users', function () {
        it('Should correctly get the element', async function () {
            let classrooms = await classroomDAO.getAll();
            let users = await userDAO.getAll();

            await classroomsUsersDAO.getClassroomsInUser(users[0])
            .then((res: Array<Classroom>)=> {
                assert.equal(res[0].name, classrooms[0].name);
                assert.equal(res[1].name, classrooms[1].name);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });
        });
    });

    describe('Delete user from classroom', function () {
        it('Should correctly get the element', async function () {
            let classrooms = await classroomDAO.getAll();
            let users = await userDAO.getAll();

            // Delete the user from the classroom
            await classroomsUsersDAO.deleteUserFromClassroom(users[0], classrooms[1])
            .then(()=> {
                assert.equal(1, 1);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });

            // Check that the user only got one assigned classroom
            await classroomsUsersDAO.getClassroomsInUser(users[0])
            .then((res: Array<Classroom>)=> {
                assert.equal(res.length, 1);
                assert.equal(res[0].name, classrooms[0].name);
            })
            .catch(() => {
                assert.throws(iThrowError, 'Second assert failed');
            });

            // Check that the classroom only got one assigned user
            await classroomsUsersDAO.getUsersInClassroom(classrooms[1])
            .then((res: Array<User>)=> {
                assert.equal(res.length, 1);
                assert.equal(res[0].name, users[1].name);
            })
            .catch(() => {
                assert.throws(iThrowError, 'First assert failed');
            });
        });
    });

});