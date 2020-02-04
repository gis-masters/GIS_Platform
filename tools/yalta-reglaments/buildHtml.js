"use strict";

const fs = require('fs');
const permissionsParameters = require('./JSON/permissionsParameters.json');
const zoneDescriptions = require('./JSON/zoneDescriptions.json');
const relations = require('./JSON/relations.json');
const permissionsDescriptions = require('./JSON/permissionsDescriptions.json');
const bemhtml = require('bem-xjst').bemhtml;
const nl2brX  = require('nl2br-x');
const translit = require('../translit');

const types = [
    {
        id: 'О',
        title: 'Основной вид разрешенного использования'
    },
    {
        id: 'У',
        title: 'Условно разрешенный вид разрешенного использования'
    },
    {
        id: 'В',
        title: 'Вспомогательный  вид разрешенного использования'
    }
];

relations.forEach(zone => {
    const desc = zoneDescriptions.find(descItem => descItem.codeZoneShort === zone.codeZone) ||
        zoneDescriptions.find(descItem => descItem.codeZoneShort === zone.codeZone.substring(0, zone.codeZone.lastIndexOf('-'))) ||
        zoneDescriptions.find(descItem => descItem.codeZoneShort === zone.codeZone.substring(0, zone.codeZone.lastIndexOf('-')).split('/')[0]);

    if (!desc) {
        throw new Error('Нет описания зоны ' + zone.codeZone);
    }
    
    const zoneData = types.map(type => {
        const content = zone.values
            .filter(({ permissionTypes }) => permissionTypes.includes(type.id))
            .map(({ maxLevel, codeParam, specialPermission, }) => {
                const perParam = permissionsParameters.find(item => item.codeParam === codeParam) ||
                    permissionsDescriptions.find(item => item.codeParamShort === codeParam);

                if (!perParam) {
                    throw new Error(`Нет описания параметра ${codeParam} в зоне ${zone.codeZone}`);
                }

                return {
                    tag: 'details',
                    content: [
                        {
                            tag: 'summary',
                            content: {
                                tag: 'h3',
                                content: `${codeParam} ${perParam.name}`
                            }
                        },
                        (specialPermission ? {
                            tag: 'p',
                            content: {
                                tag: 'em',
                                content: 'Установление  вида разрешенного использования в качестве основного возможно только для существующего положения соответствующего данному виду или по согласованию с Советом Министров Республики Крым'
                            }
                        } : null),
                        (maxLevel ? {
                            tag: 'p',
                            content: {
                                tag: 'em',
                                content: `Ограничение до ${maxLevel} этаж${maxLevel != 1 ? 'ей' : 'а'}`
                            }
                        } : null),
                        {
                            tag: 'p',
                            content: nl2brX(perParam.parameters || perParam.descParam)
                        }
                    ]
                }
            });
            
        return content.length ? {
            tag: 'details',
            content: [
                {
                    tag: 'summary',
                    content: {
                        tag: 'h2',
                        content: type.title
                    }
                },
                content
            ]
        } : null;


    });

    const bemjson = [
        {
            tag: 'h1',
            content: zone.codeZone
        },
        {
            tag: 'p',
            content: nl2brX(desc.descZone)
        },
        zoneData,
        {
            tag: 'p',
            content: [
                {
                    tag: 'a href="https://fgistp.economy.gov.ru/?show_document=true&doc_type=npa&uin=35729000030101201907272"',
                    attrs: { target: '_blank' },
                    content: 'Ссылка на оригиналы документов'
                }
            ]
        }
    ];
    const templates = bemhtml.compile();
    const html = templates.apply(bemjson);
    fs.writeFileSync(translit(`./html/Городской округ Ялта/${zone.codeZone.replace(/\//g, '_')}.html`).replace(/ /g, '_'), html, 'utf8');
});
console.log('Создание HTML успешно завершено');