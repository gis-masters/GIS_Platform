import { DataEntityType } from '../../../src/app/services/data/vectorData/vectorData.models';
import { LibraryRaw } from '../../../src/app/services/data/library/library.models';
import { schemas } from './schemas';
import { OldSchema } from '../../../src/app/services/data/schema/schemaOld.models';

function getSchema(schemaName: string): OldSchema {
  const schema = schemas.find(({ name }) => name === schemaName);
  if (!schema) {
    console.log(`Не найдена схема: ${schemaName}`);

    return schemas[0];
  }

  return schema;
}

export const libraries: Omit<LibraryRaw, 'role'>[] = [
  {
    id: 6,
    title: 'Градостроительное зонирование',
    details: 'Раздел 5',
    type: DataEntityType.LIBRARY,
    table_name: 'dl_data_section5',
    schema: getSchema('dl_data_section5_schema'),
    versioned: false,
    readyForFts: false,
    createdAt: '2022-10-28T16:01:03.528988'
  },
  {
    id: 104,
    title: 'Документы по проектам Геоплан',
    type: DataEntityType.LIBRARY,
    table_name: 'dl_data_projects_geoplan',
    schema: getSchema('dl_data_projects_geoplan_schema'),
    versioned: false,
    readyForFts: false,
    createdAt: '2022-10-28T16:01:03.529002'
  },
  {
    id: 4,
    title: 'Документы территориального планирования муниципальных образований',
    details: 'Раздел3',
    type: DataEntityType.LIBRARY,
    table_name: 'dl_data_section3',
    schema: getSchema('dl_data_section3_schema'),
    versioned: false,
    readyForFts: false,
    createdAt: '2022-10-28T16:01:03.529022'
  },
  {
    id: 9,
    title: 'Инженерные изыскания',
    details: 'Раздел8',
    type: DataEntityType.LIBRARY,
    table_name: 'dl_data_section8',
    schema: getSchema('dl_data_section8_schema'),
    versioned: false,
    readyForFts: false,
    createdAt: '2022-10-28T16:01:03.529048'
  },
  {
    id: 17,
    title: 'Лесничества',
    details: 'Раздел16',
    type: DataEntityType.LIBRARY,
    table_name: 'dl_data_section16',
    schema: getSchema('dl_data_section16_schema'),
    versioned: false,
    readyForFts: false,
    createdAt: '2022-10-28T16:01:03.529072'
  },
  {
    id: 8,
    title: 'Планировка территории',
    details: 'Раздел7',
    type: DataEntityType.LIBRARY,
    table_name: 'dl_data_section7',
    schema: getSchema('dl_data_section7_schema'),
    versioned: false,
    readyForFts: false,
    createdAt: '2022-10-28T16:01:03.529090'
  }
];
