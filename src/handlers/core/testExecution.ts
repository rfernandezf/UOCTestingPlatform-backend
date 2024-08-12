import { Assessment } from "@controllers/assessment";
import { ExecutionPlatform } from "@controllers/executionPlatform";
import { ExecutionPlatformDAO } from "@models/executionPlatformDAO";
import { environment } from "@utils/environment";
import * as fs from "fs";
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import yauzl from 'yauzl';
import * as child_process from 'child_process'; 
import { ExecutionScriptResponse } from "@interfaces/controllers/executionPlatform";

export class TestExecution
{
    private _assessment: Assessment;
    private _file: Buffer;
    private _uuid: string;

    constructor(assessment: Assessment, file: Buffer)
    {
        this._assessment = assessment;
        this._file = file;
        this._uuid = uuidv4();
    }

    public async run(): Promise<ExecutionScriptResponse>
    {
        try
        {
            // Download zip received from the student into a new execution folder
            let executionPath = path.join(process.env.COMMON_FOLDER!, environment.folders.executions, this._uuid)
            if (!fs.existsSync(executionPath)) {
                fs.mkdirSync(executionPath, { recursive: true });
            }

            fs.writeFileSync(path.join(executionPath, "assessment.zip"), this._file);

            // Uncompress it and delete the zip file
            await this.uncompressZip(
                path.join(executionPath, "assessment.zip"),
                executionPath, 
                true);

            // Uncompress zip file with the test battery uploaded by the teacher
            await this.uncompressZip(
                path.join(process.env.COMMON_FOLDER!, environment.folders.assessments, this._assessment.testPath, this._assessment.fileName), 
                executionPath);

            // Get associated execution platform and copy it's running script to our execution folder
            this._assessment.executionPlatformID
            let executionPlatforms: ExecutionPlatformDAO = new ExecutionPlatformDAO();
            let executionPlatform: ExecutionPlatform = await executionPlatforms.get(this._assessment.executionPlatformID);

            return await this.launchScript(executionPlatform.internalName, executionPath);

        } catch(err) { throw err; }
    }

    private uncompressZip(zipFilePath: string, extractionPath: string, deleteZip: boolean = false): Promise<void>
    {
        return new Promise(async (resolve, reject) => {
            // Uncompress the file and delete the zip
            yauzl.open(zipFilePath, {lazyEntries: true}, function(err: Error | null, zipfile: yauzl.ZipFile) {
                if (err) throw err;
                zipfile.readEntry();
                zipfile.on("entry", function(entry: any) {
                if (/\/$/.test(entry.fileName)) {
                    // Directory file names end with '/'.
                    // Note that entries for directories themselves are optional.
                    // An entry's fileName implicitly requires its parent directories to exist.
                    if (!fs.existsSync(path.join(extractionPath, entry.fileName))){
                    fs.mkdirSync(path.join(extractionPath, entry.fileName), { recursive: true });
                    }
                    zipfile.readEntry();
                } 
                else if(/^(__MACOSX\/).*$/.test(entry.fileName)) zipfile.readEntry();
                else {
                    // file entry
                    zipfile.openReadStream(entry, function(err: Error | null, readStream: any) {
                    if (err) throw err;                
                    
                    var fileStream = fs.createWriteStream(path.join(extractionPath, entry.fileName));
                    readStream.pipe(fileStream);

                    readStream.on("end", function() {
                        zipfile.readEntry();
                    });

                    });
                }
                });
            });

            // Delete the zip file
            if (deleteZip && fs.existsSync(zipFilePath)){
                fs.unlinkSync(zipFilePath);
            }

            resolve();
        });
    }

    private launchScript(internalName: string, executionPath: string): Promise<ExecutionScriptResponse>
    {
        return new Promise(async (resolve, reject) => {
            try
            {
                let scriptPath: string = path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, internalName, environment.platforms.scriptName);

                if (fs.existsSync(scriptPath)) 
                {
                    fs.copyFileSync(scriptPath, path.join(executionPath, environment.platforms.scriptName));
                    fs.chmodSync(path.join(executionPath, environment.platforms.scriptName), '777');

                    var proc = child_process.spawn('./' + environment.platforms.scriptName, {cwd: executionPath});

                    let receivedData: string = '';
                
                    proc.stdout.on('data', function(data: Buffer) {
                        //process.stdout.write(data);
                        receivedData += data.toString();
                    });
                
                    proc.stderr.on('data', function(data: any) {
                        process.stderr.write(data);
                    });

                    proc.on('error', function(err: any) {
                        console.log(err);
                        reject(new Error("ERROR_EXECUTING_SCRIPT"));
                    });
                
                    proc.on('close', function(code: any, signal: any) {
                        console.log('Test closed -> Code: ', code, '  Signal: ', signal);
                        try
                        {
                          let result: ExecutionScriptResponse = JSON.parse(receivedData);
                          resolve(result);
                        } catch(err) { reject(new Error("ERROR_EXECUTING_SCRIPT")); }
                    });
                }

                else reject(new Error("NO_EXECUTION_SCRIPT_FOUND"));
            } catch(err) { reject(err); }
        });
    }


}