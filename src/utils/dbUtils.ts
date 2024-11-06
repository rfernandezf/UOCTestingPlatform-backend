/**
 * Gets an string with whole raw .sql script file, including whitespaces, tabs, newlines and so on.
 * Returns an ordered array of strings, where each array entry is a whole query ready to be executed.
 * 
 * @param dataSql String containing the raw sqlite file
 * @returns Ordered array of strings with one query on each entry
 */
export function parseSQLFile(dataSql: string)
{
    // Delete all the spaces and tabs
    const dataArray: Array<string >= dataSql.toString().split('\n');

    // Parse all the comments and unnecesary info from sql file
    let sqlQueries: Array<string> = [''];
    dataArray.forEach((line: string) => {
        if(line)
        {
            // Ignore SQL comments
            if(line.startsWith('--') || line.startsWith('/*')) return;

            // Ignore all backspaces and tabs
            line = line.replaceAll('\n', '').replaceAll('\t', '');

            // Concatenate the lines that are part of the same query
            sqlQueries[sqlQueries.length - 1] += line;
            if(line.endsWith(');')) sqlQueries.push('');
        }
    });

    // Delete last element since it's trash
    sqlQueries.pop();

    return sqlQueries;
}

export function msEpochToDate(epoch: number): Date
{
    let date = new Date(0)
    date.setUTCSeconds(epoch);

    return date;
}

export function msDateToEpoch(date: Date): number
{
    return date.getTime() / 1000;
}

export function epochToDate(epoch: number): Date
{
    let date = new Date(epoch)

    return date;
}

export function dateToEpoch(date: Date): number
{
    return date.getTime();
}