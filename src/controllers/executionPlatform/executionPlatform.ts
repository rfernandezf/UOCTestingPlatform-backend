export class ExectionPlatform
{
    private platformName: string;

    constructor(platformName: string) 
    {
      this.platformName = platformName;
    }

    public run()
    {
        var spawn = require('child_process').spawn;
        var proc = spawn('common/platforms/' + this.platformName + '/run.sh');
    
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