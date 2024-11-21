import { AssessmentExecution } from "@controllers/assessmentExecutionController";
import { AllAssessmentExecutions as AssessmentLatestExecution, AllAssessmentExecutionsResponse as AssessmentLatestsExecutionResponse, AssessmentExecutionResponse } from "@interfaces/assessmentExecution";
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

    getAllLatestExecutions(): Promise<Array<AssessmentLatestExecution>> {
        return new Promise(async (resolve, reject) => {
            (await this.db).all(
                'SELECT assessment_id, assessment_name, user_id, email, classroom_name, execution_date, passed_tests, failed_tests FROM (' +
                'SELECT a.id AS assessment_id, a.name AS assessment_name, u.id AS user_id, u.email, c.name AS classroom_name, ae.execution_date, ae.passed_tests, ae.failed_tests, ' + 
                'ROW_NUMBER() OVER (PARTITION BY a.id, u.id ORDER BY ae.execution_date DESC) AS row_num ' +
                'FROM AssessmentExecutions ae, Assessments a, Users u, Classrooms c ' +
                'WHERE ae.assessment_id = a.id AND ae.user_id = u.id AND a.classroom_id = c.id) AS ranked ' +
                'WHERE row_num = 1 ORDER BY execution_date DESC;', 
                function(err: Error | null, rows: Array<AssessmentLatestsExecutionResponse>) { 
                if(err) reject(err);

                let response: Array<AssessmentLatestExecution> = [];

                rows.forEach((row: AssessmentLatestsExecutionResponse) => {
                    let parsedRow: AssessmentLatestExecution = {
                        assessment_id: row.assessment_id,
                        assessment_name: row.assessment_name,
                        user_id: row.user_id,
                        email: row.email,
                        classroom_name: row.classroom_name,
                        execution_date: epochToDate(row.execution_date),
                        passed_tests: row.passed_tests,
                        failed_tests: row.failed_tests,
                        status: row.passed_tests > 0 && row.failed_tests == 0 ? 'Success' : 'Failed'
                    };
                    response.push(parsedRow);
                })

                if(response && response.length > 0) resolve(response);
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }
}