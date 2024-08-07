import { Classroom } from "@controllers/classroom/classroom";
import { ClassroomResponse } from "@interfaces/controllers/classroom/classroom";
import { DAO } from "@interfaces/controllers/DAO";
import dbConnection from "@utils/dbConnection";

export class ClassroomDAO implements DAO<Classroom>
{
    private db = dbConnection;

    constructor() { }

    create(entity: Classroom): Promise<Classroom> {
        return new Promise((resolve, reject) => {
            //INSERT INTO Classrooms (name, description, assessment_id) VALUES ('Test classroom', 'My description comes here', 1);
        });
    }

    update(entity: Classroom): Promise<Classroom> {
        throw new Error("Method not implemented." + entity);
    }

    delete(entity: Classroom): Promise<void> {
        throw new Error("Method not implemented." + entity);
    }

    async get(id: number): Promise<Classroom> {
        return new Promise(async (resolve, reject) => {
            (await this.db).get('SELECT * FROM Classrooms WHERE ID = ?', id, (err, rows: ClassroomResponse) => { 
                if(err) reject(err);

                resolve(new Classroom(rows.id, rows.name, rows.description, rows.assessment_id));
            });
        });
    }

    getAll(): Promise<Array<Classroom>> {
        throw new Error("Method not implemented.");
    }
}