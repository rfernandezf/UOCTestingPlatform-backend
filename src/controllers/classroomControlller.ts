
export class Classroom
{
    private _id: number;
    private _name: string;
    private _description: string;
    private _password: string;    
    private _uuid: string;

    constructor(id: number, name: string, description: string, password: string = '', uuid: string = '')
    {
        this._id = id;
        this._name = name;
        this._description = description;
        this._password = password;
        this._uuid = uuid;
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

    get password(): string
    {
        return this._password;
    }

    get uuid(): string
    {
        return this._uuid;
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
    
    set password(password: string)
    {
        this._password = password;
    }

    set uuid(uuid: string)
    {
        this._uuid = uuid;
    }
    
}