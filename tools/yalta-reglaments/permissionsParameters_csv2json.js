"use strict";

const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const stripBom = require('strip-bom');


const csv = stripBom(fs.readFileSync('./CSV/permissionsParameters.csv', 'utf8').toString().replace(/\ +/g," "));
const records = parse(csv, {
    delimiter: ';',
    skip_empty_lines: true
});

const data = records.map((element, i) => {
    if (!element[0]) {
        console.log(element);
        throw new Error('отстутствует код в строке '+i);
    }
    return {
        codeParam: element[0],
        name: element[1],
        parameters: element[2]
    }
})

fs.writeFileSync('./JSON/permissionsParameters.json', JSON.stringify(data, null, 2), 'utf8');

console.log('Конвертирование успешно завершено');