export class ExecutionPlatform
{
    private _id: number;
    private _name: string;
    private _internalName: string;

    constructor(id: number, name: string) 
    {
      this._id = id;
      this._name = name;
      this._internalName = this.convertToInternalName();
    }

    get id(): number
    {
        return this._id;
    }

    get name(): string
    {
        return this._name;
    }

    get internalName(): string
    {
        return this._internalName;
    }

    set id(id: number)
    {
        this._id = id;
    }

    set name(name: string)
    {
        this._name = name;
        this._internalName = this.convertToInternalName();
    }

    private convertToInternalName()
    {
      return this._name.toLowerCase().replaceAll(' ', '_').replace(/[^a-zA-Z0-9_]+/g, '');
    }
}