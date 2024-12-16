import { Assessment } from "@controllers/assessmentController";
import { AssessmentResponse } from "@interfaces/assessment";
import { DAO } from "@interfaces/DAO";
import dbConnection from "@utils/dbConnection";
import { dateToEpoch, epochToDate } from "@utils/dbUtils";
import { RunResult } from "sqlite3";
import { v4 as uuidv4 } from 'uuid';

export class AssessmentDAO implements DAO<Assessment>
{
    private db = dbConnection;

    constructor() { }

    create(entity: Assessment): Promise<Assessment> {
        return new Promise(async (resolve, reject) => {
            let pathNameUUID: string = uuidv4();

            (await this.db).run("INSERT INTO Assessments (name, description, publish_date, expiration_date, platform_id, classroom_id, test_path, file_name, max_failed_tests, max_retries) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                [entity.name, entity.description, dateToEpoch(entity.publishDate), dateToEpoch(entity.expirationDate), entity.executionPlatformID, entity.classroomID, pathNameUUID, entity.fileName, entity.maxFailedTests, entity.maxRetries], function (this: RunResult, err: Error | null) { 
                if(this && this.lastID) 
                {
                    entity.id = this.lastID;
                    entity.testPath = pathNameUUID;
                }

                if(err) reject(err);

                resolve(entity);
            });
        });
    }

    update(entity: Assessment): Promise<Assessment> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("UPDATE Assessments SET name = ?, description = ?, publish_date = ?, expiration_date = ?, platform_id = ?, classroom_id = ?, file_name = ?, max_failed_tests = ?, max_retries = ? WHERE id = ?", 
                [entity.name, entity.description, dateToEpoch(entity.publishDate), dateToEpoch(entity.expirationDate), entity.executionPlatformID, entity.classroomID, entity.fileName, entity.maxFailedTests, entity.maxRetries, entity.id], function (this: RunResult, err: Error | null) {                
                if(err) reject(err);
                if(this.changes == 0) reject(new Error('ELEMENT_NOT_FOUND'));

                resolve(entity);
            });
        });
    }

    delete(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try
            {            
                (await this.db).run("DELETE FROM Assessments WHERE id = ?", id, function (this: RunResult, err: Error | null) { 
                    if(err) reject(err);
                    if(this.changes == 0) reject(new Error('ELEMENT_NOT_FOUND'));

                    resolve();        
                });
            }
            catch(err: any)
            {
                reject(err);
            }
        });
    }

    async get(id: number): Promise<Assessment> {
        return new Promise(async (resolve, reject) => {
            (await this.db).get('SELECT * FROM Assessments WHERE id = ?', id, function(err: Error | null, row: AssessmentResponse) { 
                if(err) reject(err);
                
                if(row) resolve(new Assessment(row.id, row.name, row.description, epochToDate(row.publish_date), epochToDate(row.expiration_date), row.platform_id, row.classroom_id, row.test_path, row.file_name, row.max_failed_tests, row.max_retries));
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }

    async getByClassroom(classroomId: number): Promise<Array<Assessment>> {
        return new Promise(async (resolve, reject) => {
            (await this.db).all('SELECT a.* FROM Assessments a, Classrooms c WHERE a.classroom_id = c.id AND c.id = ?', classroomId, function(err: Error | null, rows: Array<AssessmentResponse>) { 
                if(err) reject(err);
                
                let response: Array<Assessment> = [];

                rows.forEach((row: AssessmentResponse) => {
                    response.push(new Assessment(row.id, row.name, row.description, epochToDate(row.publish_date), epochToDate(row.expiration_date), row.platform_id, row.classroom_id, row.test_path, row.file_name, row.max_failed_tests, row.max_retries));
                })
                
                if(response && response.length > 0) resolve(response);
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }

    getAll(): Promise<Array<Assessment>> {
        return new Promise(async (resolve, reject) => {
            (await this.db).all('SELECT * FROM Assessments', function(err: Error | null, rows: Array<AssessmentResponse>) { 
                if(err) reject(err);

                let response: Array<Assessment> = [];

                rows.forEach((row: AssessmentResponse) => {
                    response.push(new Assessment(row.id, row.name, row.description, epochToDate(row.publish_date), epochToDate(row.expiration_date), row.platform_id, row.classroom_id, row.test_path, row.file_name, row.max_failed_tests, row.max_retries));
                })

                if(response && response.length > 0) resolve(response);
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }
}