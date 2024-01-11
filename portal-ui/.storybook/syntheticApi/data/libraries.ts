import { DataEntityType } from '../../../src/app/services/data/vectorData/vectorData.models';
import { Library } from '../../../src/app/services/data/library/library.models';

export const libraries: Omit<Library, 'role'>[] = [
  {
    id: 103,
    title: 'Библиотека ЗУ',
    details: 'ЗУ библиотека',
    type: DataEntityType.LIBRARY,
    table_name: 'dl_zu',
    schemaId: 'dl_zu_schema',
    versioned: false,
    readyForFts: false,
    createdAt: '2022-06-08T16:09:19.811232'
  },
  {
    id: 6,
    title: 'Градостроительное зонирование',
    details: 'Раздел 5',
    type: DataEntityType.LIBRARY,
    table_name: 'dl_data_section5',
    schemaId: 'dl_data_section5_schema',
    versioned: false,
    readyForFts: false,
    createdAt: '2022-10-28T16:01:03.528988'
  },
  {
    id: 104,
    title: 'Документы по проектам Геоплан',
    type: DataEntityType.LIBRARY,
    table_name: 'dl_data_projects_geoplan',
    schemaId: 'dl_data_projects_geoplan_schema',
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
    schemaId: 'dl_data_section3_schema',
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
    schemaId: 'dl_data_section8_schema',
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
    schemaId: 'dl_data_section16_schema',
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
    schemaId: 'dl_data_section7_schema',
    versioned: false,
    readyForFts: false,
    createdAt: '2022-10-28T16:01:03.529090'
  }
];
