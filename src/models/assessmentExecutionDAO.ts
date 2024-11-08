import { AssessmentExecution } from "@controllers/assessmentExecutionController";
import { AssessmentExecutionResponse } from "@interfaces/assessmentExecution";
import { DAO } from "@interfaces/DAO";
import dbConnection from "@utils/dbConnection";
import { dateToEpoch, epochToDate } from "@utils/dbUtils";
import { RunResult } from "sqlite3";
import { v4 as uuidv4 } from 'uuid';

export class AssessmentExecutionDAO implements DAO<AssessmentExecution>
{
    private db = dbConnection;

    constructor() { }

    create(entity: AssessmentExecution): Promise<AssessmentExecution> {
        return new Promise(async (resolve, reject) => {
            let pathNameUUID: string = uuidv4();

            (await this.db).run("INSERT INTO AssessmentExecutions (assessment_id, user_id, execution_date, passed_tests, failed_tests, execution_time, log_output, execution_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                [entity.assessmentID, entity.userID, dateToEpoch(entity.executionDate), entity.passedTests, entity.failedTests, entity.executionTime, entity.logOutput, entity.executionID], function (this: RunResult, err: Error | null) { 
                if(this.lastID) 
                {
                    entity.id = this.lastID;
                }

                if(err) reject(err);

                resolve(entity);
            });
        });
    }

    update(entity: AssessmentExecution): Promise<AssessmentExecution> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("UPDATE AssessmentExecutions SET assessment_id = ?, user_id = ?, execution_date = ?, passed_tests = ?, failed_tests = ?, execution_time = ?, log_output = ?, execution_id = ? WHERE id = ?", 
                [entity.assessmentID, entity.userID, dateToEpoch(entity.executionDate), entity.passedTests, entity.failedTests, entity.executionTime, entity.logOutput, entity.executionID, entity.id], function (this: RunResult, err: Error | null) {                
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
                (await this.db).run("DELETE FROM AssessmentExecutions WHERE id = ?", id, function (this: RunResult, err: Error | null) { 
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

    async get(id: number): Promise<AssessmentExecution> {
        return new Promise(async (resolve, reject) => {
            (await this.db).get('SELECT * FROM AssessmentExecutions WHERE id = ?', id, function(err: Error | null, row: AssessmentExecutionResponse) { 
                if(err) reject(err);
                
                if(row) resolve(new AssessmentExecution(row.id, row.assessment_id, row.user_id, epochToDate(row.execution_date), row.passed_tests, row.failed_tests, row.execution_time, row.log_output, row.execution_id));
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }

    getByUserID(assessmentID: number, userID: number): Promise<Array<AssessmentExecution>> {
        return new Promise(async (resolve, reject) => {
            (await this.db).all('SELECT * FROM AssessmentExecutions WHERE assessment_id = ? AND user_id = ? ORDER BY execution_date ASC', assessmentID, userID, function(err: Error | null, rows: Array<AssessmentExecutionResponse>) { 
                if(err) reject(err);

                let response: Array<AssessmentExecution> = [];

                rows.forEach((row: AssessmentExecutionResponse) => {
                    response.push(new AssessmentExecution(row.id, row.assessment_id, row.user_id, epochToDate(row.execution_date), row.passed_tests, row.failed_tests, row.execution_time, row.log_output, row.execution_id));
                })

                if(response && response.length > 0) resolve(response);
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }

    getAll(): Promise<Array<AssessmentExecution>> {
        return new Promise(async (resolve, reject) => {
            (await this.db).all('SELECT * FROM AssessmentExecutions', function(err: Error | null, rows: Array<AssessmentExecutionResponse>) { 
                if(err) reject(err);

                let response: Array<AssessmentExecution> = [];

                rows.forEach((row: AssessmentExecutionResponse) => {
                    response.push(new AssessmentExecution(row.id, row.assessment_id, row.user_id, epochToDate(row.execution_date), row.passed_tests, row.failed_tests, row.execution_time, row.log_output, row.execution_id));
                })

                if(response && response.length > 0) resolve(response);
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }
}