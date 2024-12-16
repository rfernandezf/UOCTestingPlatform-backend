import { environment } from "./environment";
import * as fs from "fs";
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });
import { RunResult } from 'sqlite3';
import { SQLiteConnection } from "@models/DB/sqliteConnection";
import { ExecutionPlatform } from "@controllers/executionPlatformController";


const generateDB = async () =>
{
    // Delete old DB if any
    if (fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.database.name))) fs.unlinkSync(path.join(process.env.COMMON_FOLDER!, environment.database.name));

    // Create Java default platform
    let javaPlatform = new ExecutionPlatform(0, 'Java platform');

    let sql = new SQLiteConnection();
    let db = await sql.getConnection();

    db.run("INSERT INTO ExecutionPlatforms (name, internal_name) VALUES (?, ?)", [javaPlatform.name, javaPlatform.internalName], function (this: RunResult, err: Error | null) { 
        if(this && this.lastID) 
        {
            javaPlatform.id = this.lastID;
        }

        if(err) console.log(err);
    });

    let javaPlatformScript: string = `#!/bin/bash\n\ngradle clean test | awk '/[a-zA-Z0-9]* > [a-zA-Z0-9]*.* ((PASSED)|(FAILED))/ { printf "{\\"name\\": \\"%s\\", \\"method\\": \\"%s\\", \\"status\\": \\"%s\\"}" , $1, $3, $NF; fflush() }'`;

    // Create a folder for the new platform if it doesn't exists
    if (!fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, javaPlatform.internalName))) {
    fs.mkdirSync(path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, javaPlatform.internalName), { recursive: true });
    }

    // Write body into the file
    let filePath = path.join(process.env.COMMON_FOLDER!, environment.folders.platforms, javaPlatform.internalName, environment.platforms.scriptName);
    fs.writeFileSync(filePath, javaPlatformScript);
}

generateDB();