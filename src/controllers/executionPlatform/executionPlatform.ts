import { ExecutionSteps } from "@interfaces/executionPlatforms/executionPlatforms";


export class ExectionPlatform
{
    private executionSteps: ExecutionSteps;

    constructor()
    {
        this.executionSteps = [];
    }

    public run(...args: any)
    {
        if(args) console.log(this.executionSteps);
        var spawn = require('child_process').spawn;
        var proc = spawn('common/gradle.sh');
    
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