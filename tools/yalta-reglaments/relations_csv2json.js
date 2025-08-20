"use strict";

const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const stripBom = require('strip-bom');

const fileNames = fs.readdirSync('./CSV/relations');
const data = [];


fileNames.forEach(fileName => {
    const csv = stripBom(fs.readFileSync(`./CSV/relations/${fileName}`, 'utf8').toString().replace(/\ +/g," "));
    const records = parse(csv, {
        delimiter: ';',
        skip_empty_lines: true
    });
    
    const codes = records[0].slice(1);
 
    data.splice(data.length, 0, ...records.slice(1).filter(row => !row.every(cell => !cell)).map(row => ({
        codeZone: row[0],
        values: row.slice(1).filter((cell, i) => codes[i]).map((cell, i) => {
            let maxLevel;
            const levelsMatch = cell.match(/\(\d+\)/);
            if (levelsMatch) {
                maxLevel = levelsMatch[0].replace(/[\(\)]/g, '');
            }
            const specialPermission = Boolean(cell.match(/\([CС]\)/i)) || undefined;
            const permissionType = cell.trim().replace(/\(\d+\)/, '').replace(/\([CС]\)/i, '');

            if (!permissionType.match(/^[ОУВ ,]*$/)) {
                throw new Error(`Файл: ${fileName}; Ошибка в ячейке ${row[0]} : ${codes[i]} : ${cell}`);
            }

            return {
                codeParam: codes[i],
                permissionTypes: permissionType.replace(/[^ОУВ]/g, '').split(''),
                maxLevel,
                specialPermission
            }
        })
    })));
});

const json = fs.writeFileSync(`./JSON/relations.json`, JSON.stringify(data, null, 2), 'utf8');
     
console.log('Конвертирование успешно завершено');