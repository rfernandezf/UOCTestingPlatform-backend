import { ExecutionPlatform } from "@controllers/executionPlatformController";

export class AssessmentExecution
{
    private _id: number;
    private _assessmentID: number;
    private _userID: number;
    private _executionDate: Date;
    private _passedTests: number;
    private _failedTests: number;
    private _logOutput: string;
    private _executionID: string;

    constructor(id: number, assessmentID: number, userID: number, executionDate: Date, passedTests: number, failedTests: number, logOutput: string, executionID: string) 
    {
      this._id = id;
      this._assessmentID = assessmentID;
      this._userID = userID;
      this._executionDate = executionDate;
      this._passedTests = passedTests;
      this._failedTests = failedTests;
      this._logOutput = logOutput;
      this._executionID = executionID;
    }

    get id(): number
    {
        return this._id;
    }

    get assessmentID(): number
    {
        return this._assessmentID;
    }

    get userID(): number
    {
        return this._userID;
    }

    get executionDate(): Date
    {
        return this._executionDate;
    }

    get passedTests(): number
    {
        return this._passedTests;
    }

    get failedTests(): number
    {
        return this._failedTests;
    }

    get logOutput(): string
    {
        return this._logOutput;
    }

    get executionID(): string
    {
        return this._executionID;
    }

    set id(id: number)
    {
        this._id = id;
    }

    set assessmentID(assessmentID: number)
    {
        this._assessmentID = assessmentID;
    }

    set userID(userID: number)
    {
        this._userID = userID;
    }

    set executionDate(executionDate: Date)
    {
        this._executionDate = executionDate;
    }

    set passedTests(passedTests: number)
    {
        this._passedTests = passedTests;
    }

    set failedTests(failedTests: number)
    {
        this._failedTests = failedTests;
    }

    set logOutput(logOutput: string)
    {
        this._logOutput = logOutput;
    }

    set executionID(executionID: string)
    {
        this._executionID = executionID;
    }

}