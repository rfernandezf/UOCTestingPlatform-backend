export const environment =
{
    folders: {
        assessments: "/assessments",
        certs: "/certs",
        platforms: "/platforms",
        executions: "/executions"
    },
    database: {
        name: "database.sqlite",
        testName: "database_test.sqlite",
        generationScript: "generateDatabase.sql"
    },
    platforms: {
        scriptName: "run.sh"
    },
    auth: {
        passcodeExpiration: 10, // In minutes
        expiratedPasscodesChecking: 1 // In minutes
    }
}