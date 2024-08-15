import { Assessment } from "@controllers/assessmentController";
import { ExecutionPlatform } from "@controllers/executionPlatformController";
import { ExecutionPlatformDAO } from "@models/executionPlatformDAO";
import { environment } from "@utils/environment";
import * as fs from "fs";
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import yauzl from 'yauzl';
import * as child_process from 'child_process'; 
import { ExecutionScriptResponse } from "@interfaces/executionPlatform";
import { SSEConnectionHandler } from "src/sse/sseConnection";
import Logger from "@utils/logger";

export class TestExecution
{
    private _assessment: Assessment;
    private _file: Buffer;
    private _uuid: string;
    private _sseClientId: string;

    constructor(assessment: Assessment, file: Buffer, sseClientId: string)
    {
        this._assessment = assessment;
        this._file = file;
        this._uuid = uuidv4();
        this._sseClientId = sseClientId;
    }

    public async run()
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

            // Async call. We'll return the result & errors (if any) to the client using SSE
            this.launchScript(executionPlatform.internalName, executionPath);
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

    private launchScript(internalName: string, executionPath: string): Promise<Array<ExecutionScriptResponse>>
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

                    let receivedDataBuffer: string = '';
                    let result: Array<ExecutionScriptResponse> = [];
                
                    proc.stdout.on('data', (data: Buffer) => {
                        receivedDataBuffer += data.toString();

                        let splittedBuffer = receivedDataBuffer.split('}');

                        splittedBuffer.forEach((testResult) => {
                            // If we cannot JSON parse it probably is an incompleted message and must be stored for concatenate it with the next buffer sending
                            try
                            {
                                let partialResult = JSON.parse(testResult + '}');
                                result.push(partialResult);
                                
                                // Start sending events
                                SSEConnectionHandler.getInstance().sendEvent(this._sseClientId, partialResult);
                            } catch(err) { 
                                receivedDataBuffer = testResult; 
                            }
                            
                        });
                    });
                
                    proc.stderr.on('data', function(data: any) {
                        Logger.info(data.toString());
                    });

                    proc.on('error', (err: any) => {
                        Logger.error(err);
                        SSEConnectionHandler.getInstance().sendEvent(this._sseClientId, {error: 'ERROR_EXECUTING_SCRIPT'});
                        SSEConnectionHandler.getInstance().closeConnection(this._sseClientId);
                        reject(new Error("ERROR_EXECUTING_SCRIPT"));
                    });
                
                    proc.on('close', (code: any, signal: any) => {
                        Logger.info('Test closed -> Code: ' + code + '  Signal: ' + signal);
                        try
                        {
                          resolve(result);
                        } catch(err) { 
                            SSEConnectionHandler.getInstance().sendEvent(this._sseClientId, {error: 'ERROR_EXECUTING_SCRIPT'});
                            SSEConnectionHandler.getInstance().closeConnection(this._sseClientId);
                            reject(new Error("ERROR_EXECUTING_SCRIPT")); 
                        } finally {
                            // Close SSE session
                            SSEConnectionHandler.getInstance().closeConnection(this._sseClientId);

                            // Delete the files after ending with the execution
                            if (fs.existsSync(executionPath)) {
                                fs.rm(executionPath, { recursive: true }, () => {});
                            }
                        }
                    });
                }

                else 
                {
                    SSEConnectionHandler.getInstance().sendEvent(this._sseClientId, {error: 'NO_EXECUTION_SCRIPT_FOUND'});
                    SSEConnectionHandler.getInstance().closeConnection(this._sseClientId);
                    reject(new Error("NO_EXECUTION_SCRIPT_FOUND"));
                }
            } catch(err) { reject(err); }
        });
    }


}