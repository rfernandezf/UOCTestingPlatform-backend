import { Classroom } from "@controllers/classroom/classroom";
import { DAO } from "@interfaces/controllers/DAO";
import dbConnection from "@utils/dbConnection";

export class ClassroomDAO implements DAO<Classroom> // Must return Classroom object!!!
{
    private db = dbConnection;

    constructor() { }

    create(entity: Classroom): Classroom {
        throw new Error("Method not implemented." + entity);
    }
    update(entity: Classroom): Classroom {
        throw new Error("Method not implemented." + entity);
    }
    delete(entity: Classroom): void {
        throw new Error("Method not implemented." + entity);
    }
    get(id: number): Classroom {
        this.db.get('SELECT * FROM Classrooms WHERE ID = ?', id, (err, rows) => { 
            console.log('Err:',  err);
            console.log('----> CLASSROOMS: ', rows);
        });
        
        return new Classroom();
    }
    getAll(): Set<Classroom> {
        throw new Error("Method not implemented.");
    }
    test(){this.db.close();}

}