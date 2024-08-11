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
    
    public run()
    {
        var spawn = require('child_process').spawn;
        var proc = spawn('common/platforms/' + this._name + '/run.sh');
    
        proc.stdout.on('data', function(data: any) {
          process.stdout.write(data);
        });
    
        proc.stderr.on('data', function(data: any) {
          process.stderr.write(data);
        });
    
        proc.on('close', function(code: any, signal: any) {
          console.log('Test closed -> Code: ', code, '  Signal: ', signal);
        });
    }
}