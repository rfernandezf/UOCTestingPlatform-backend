import { Classroom } from "@controllers/classroom/classroom";
import { DAO } from "@interfaces/controllers/DAO";
import { DBConnection } from "@interfaces/controllers/DB/DBConnection";

export class ClassroomDAO implements DAO<Classroom> // Must return Classroom object!!!
{
    private db;

    constructor()
    {
        this.db = DBConnection.getInstance().getDB();
    }

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
        throw new Error("Method not implemented." + id);
    }
    getAll(): Set<Classroom> {
        throw new Error("Method not implemented.");
    }
    test(){this.db.close();}

}