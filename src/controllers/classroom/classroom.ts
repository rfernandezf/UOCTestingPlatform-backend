
export class Classroom
{
    private _id: number;
    private _name: string;
    private _description: string;
    private _assessment: any;

    constructor(id: number, name: string, description: string, assessment: any)
    {
        this._id = id;
        this._name = name;
        this._description = description;
        this._assessment = assessment;
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

    get assessment(): any
    {
        return this._assessment;
    }

    set name(name: string)
    {
        this._name = name;
    }

    set description(description: string)
    {
        this._description = description;
    }

    set assessment(assessment: any)
    {
        this._assessment = assessment;
    }
}