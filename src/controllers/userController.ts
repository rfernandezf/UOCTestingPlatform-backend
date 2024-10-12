import { UserRole } from "@interfaces/user";

export class User
{
    private _id: number;
    private _name: string;
    private _surnames: string;
    private _email: string;
    private _userRole: UserRole;

    constructor(id: number, name: string, surnames: string, email: string, userRole: UserRole)
    {
        this._id = id;
        this._name = name;
        this._surnames = surnames;
        this._email = email;
        this._userRole = userRole;
    }

    get id(): number
    {
        return this._id;
    }

    get name(): string
    {
        return this._name;
    }

    get surnames(): string
    {
        return this._surnames;
    }

    get email(): string
    {
        return this._email;
    }

    get userRole(): UserRole
    {
        return this._userRole;
    }

    set id(id: number)
    {
        this._id = id;
    }

    set name(name: string)
    {
        this._name = name;
    }
    
    set surnames(surnames: string)
    {
        this._surnames = surnames;
    }

    set email(email: string)
    {
        this._email = email;
    }

    set userRole(userRole: UserRole)
    {
        this._userRole = userRole;
    }
}