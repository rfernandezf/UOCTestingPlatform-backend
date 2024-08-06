export class ExecutionPlatform
{
    private _id: number;
    private _name: string;

    constructor(id: number, name: string) 
    {
      this._id = id;
      this._name = name;
    }

    get id(): number
    {
        return this._id;
    }

    get name(): string
    {
        return this._name;
    }

    set name(name: string)
    {
        this._name = name;
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