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
            throw new Error("Method not implemented.");
        });
    }

    update(entity: Classroom): Promise<Classroom> {
        throw new Error("Method not implemented.");
    }

    delete(entity: Classroom): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async get(id: number): Promise<Classroom> {
        throw new Error("Method not implemented.");
    }

    getAll(): Promise<Array<Classroom>> {
        throw new Error("Method not implemented.");
    }
}