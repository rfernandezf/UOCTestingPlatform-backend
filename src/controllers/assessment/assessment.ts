import { ExecutionPlatform } from "@controllers/executionPlatform/executionPlatform";

export class Assessment
{
    private _id: number;
    private _name: string;
    private _description: string;
    private _publishDate: Date;
    private _expirationDate: Date;
    private _executionPlatformID: number;
    private _testPath: string;

    constructor(id: number, name: string, description: string, publishDate: Date, expirationDate: Date, executionPlatformID: number, testPath: string) 
    {
      this._id = id;
      this._name = name;
      this._description = description;
      this._publishDate = publishDate;
      this._expirationDate = expirationDate;
      this._executionPlatformID = executionPlatformID;
      this._testPath = testPath;
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

    get testPath(): string
    {
        return this._testPath;
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

    set testPath(testPath: string)
    {
        this._testPath = testPath;
    }

}