
export class Classroom
{
    private _id: number;
    private _name: string;
    private _description: string;

    constructor(id: number, name: string, description: string)
    {
        this._id = id;
        this._name = name;
        this._description = description;
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
    
}