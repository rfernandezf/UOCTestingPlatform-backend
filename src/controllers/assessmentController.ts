import { ExecutionPlatform } from "@controllers/executionPlatformController";

export class Assessment
{
    private _id: number;
    private _name: string;
    private _description: string;
    private _publishDate: Date;
    private _expirationDate: Date;
    private _executionPlatformID: number;
    private _classroomID: number;
    private _testPath: string;
    private _fileName: string;
    private _maxFailedTests: number;
    private _maxRetries: number;

    constructor(id: number, name: string, description: string, publishDate: Date, expirationDate: Date, executionPlatformID: number, classroomID: number, testPath: string = '', fileName: string = '', maxFailedTests: number = 0, maxRetries: number = 0) 
    {
      this._id = id;
      this._name = name;
      this._description = description;
      this._publishDate = publishDate;
      this._expirationDate = expirationDate;
      this._executionPlatformID = executionPlatformID;
      this._classroomID = classroomID;
      this._testPath = testPath;
      this._fileName = fileName;
      this._maxFailedTests = maxFailedTests;
      this._maxRetries = maxRetries;
    }

    get id(): number
    {
        return this._id;
    }

    get name(): string
    {
        return this._name;
    }

    get description(): string
    {
        return this._description;
    }

    get publishDate(): Date
    {
        return this._publishDate;
    }

    get expirationDate(): Date
    {
        return this._expirationDate;
    }

    get executionPlatformID(): number
    {
        return this._executionPlatformID;
    }

    get classroomID(): number
    {
        return this._classroomID;
    }

    get testPath(): string
    {
        return this._testPath;
    }

    get fileName(): string
    {
        return this._fileName;
    }

    get maxFailedTests(): number
    {
        return this._maxFailedTests;
    }

    get maxRetries(): number
    {
        return this._maxRetries;
    }

    set id(id: number)
    {
        this._id = id;
    }

    set name(name: string)
    {
        this._name = name;
    }

    set description(description: string)
    {
        this._description = description;
    }

    set publishDate(publishDate: Date)
    {
        this._publishDate = publishDate;
    }

    set expirationDate(expirationDate: Date)
    {
        this._expirationDate = expirationDate;
    }

    set executionPlatformID(executionPlatformID: number)
    {
        this._executionPlatformID = executionPlatformID;
    }

    set classroomID(classroomID: number)
    {
        this._classroomID = classroomID;
    }

    set testPath(testPath: string)
    {
        this._testPath = testPath;
    }

    set fileName(fileName: string)
    {
        this._fileName = fileName;
    }

    set maxFailedTests(maxFailedTests: number)
    {
        this._maxFailedTests = maxFailedTests;
    }

    set maxRetries(maxRetries: number)
    {
        this._maxRetries = maxRetries;
    }
}