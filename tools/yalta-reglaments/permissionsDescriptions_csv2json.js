"use strict";

const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const stripBom = require('strip-bom');


const csv = stripBom(fs.readFileSync('./CSV/permissionsDescriptions.csv', 'utf8').toString().replace(/\ +/g," "));
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
        codeParamShort: element[0],
        name: element[1],
        descParam: element[2]
    }
})

const json = fs.writeFileSync('./JSON/permissionsDescriptions.json', JSON.stringify(data, null, 2), 'utf8');

console.log('Конвертирование успешно завершено');