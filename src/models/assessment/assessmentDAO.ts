import { Assessment } from "@controllers/assessment/assessment";
import { AssessmentResponse } from "@interfaces/controllers/assessment/assessment";
import { DAO } from "@interfaces/controllers/DAO";
import dbConnection from "@utils/dbConnection";
import { dateToEpoch, epochToDate } from "@utils/dbUtils";
import { RunResult } from "sqlite3";

export class AssessmentDAO implements DAO<Assessment>
{
    private db = dbConnection;

    constructor() { }

    create(entity: Assessment): Promise<Assessment> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("INSERT INTO Assessments (name, description, publish_date, expiration_date, platform_id, test_path) VALUES (?, ?, ?, ?, ?, ?)", 
                [entity.name, entity.description, dateToEpoch(entity.publishDate), dateToEpoch(entity.expirationDate), entity.executionPlatformID, entity.testPath], function (this: RunResult, err: Error | null) { 
                if(this.lastID) entity.id = this.lastID;

                if(err) reject(err);

                resolve(entity);
            });
        });
    }

    update(entity: Assessment): Promise<Assessment> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("UPDATE Assessments SET name = ?, description = ?, publish_date = ?, expiration_date = ?, platform_id = ?, test_path = ? WHERE id = ?", 
                [entity.name, entity.description, dateToEpoch(entity.publishDate), dateToEpoch(entity.expirationDate), entity.executionPlatformID, entity.testPath, entity.id], function (this: RunResult, err: Error | null) {                
                if(err) reject(err);

                resolve(entity);
            });
        });
    }

    delete(entity: Assessment): Promise<void> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("DELETE FROM Assessments WHERE id = ?", entity.id, function (this: RunResult, err: Error | null) { 
                if(err) reject(err);

                resolve();
            });
        });
    }

    async get(id: number): Promise<Assessment> {
        return new Promise(async (resolve, reject) => {
            (await this.db).get('SELECT * FROM Assessments WHERE id = ?', id, function(err: Error | null, row: AssessmentResponse) { 
                if(err) reject(err);
                
                if(row) resolve(new Assessment(row.id, row.name, row.description, epochToDate(row.publish_date), epochToDate(row.expiration_date), row.platform_id, row.test_path));
                else reject();
            });
        });
    }

    getAll(): Promise<Array<Assessment>> {
        return new Promise(async (resolve, reject) => {
            (await this.db).all('SELECT * FROM Assessments', function(err: Error | null, rows: Array<AssessmentResponse>) { 
                if(err) reject(err);

                let response: Array<Assessment> = [];

                rows.forEach((row: AssessmentResponse) => {
                    response.push(new Assessment(row.id, row.name, row.description, epochToDate(row.publish_date), epochToDate(row.expiration_date), row.platform_id, row.test_path));
                })

                if(response && response.length > 0) resolve(response);
                else reject();
            });
        });
    }
}