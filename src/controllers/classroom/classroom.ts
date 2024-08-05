import { ClassroomDAO } from "@models/classroom/classroomDAO";

export class Classroom
{
    private classroomDAO: ClassroomDAO;
    //private students: Set<any>;

    constructor()
    {
        this.classroomDAO = new ClassroomDAO();
        this.classroomDAO.test();
        //this.students = this.classroomDAO.getAll();
        //console.log(this.students);
    }
}