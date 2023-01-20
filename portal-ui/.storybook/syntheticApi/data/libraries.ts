import { DataEntityType } from '../../../src/app/services/data/data.service';
import { DocumentLibrary } from '../../../src/app/services/data/doc-library.service';

export const libraries: Omit<DocumentLibrary, 'role'>[] = [
  {
    id: 103,
    title: 'Библиотека ЗУ',
    details: 'ЗУ библиотека',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_zu',
    schemaId: 'dl_zu_schema',
    createdAt: '2022-06-08T16:09:19.811232'
  },
  {
    id: 6,
    title: 'Градостроительное зонирование',
    details: 'Раздел 5',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section5',
    schemaId: 'dl_data_section5_schema',
    createdAt: '2022-10-28T16:01:03.528988'
  },
  {
    id: 104,
    title: 'Документы по проектам Геоплан',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_projects_geoplan',
    schemaId: 'dl_data_projects_geoplan_schema',
    createdAt: '2022-10-28T16:01:03.529002'
  },
  {
    id: 4,
    title: 'Документы территориального планирования муниципальных образований',
    details: 'Раздел3',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section3',
    schemaId: 'dl_data_section3_schema',
    createdAt: '2022-10-28T16:01:03.529022'
  },
  {
    id: 9,
    title: 'Инженерные изыскания',
    details: 'Раздел8',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section8',
    schemaId: 'dl_data_section8_schema',
    createdAt: '2022-10-28T16:01:03.529048'
  },
  {
    id: 17,
    title: 'Лесничества',
    details: 'Раздел16',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section16',
    schemaId: 'dl_data_section16_schema',
    createdAt: '2022-10-28T16:01:03.529072'
  },
  {
    id: 8,
    title: 'Планировка территории',
    details: 'Раздел7',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section7',
    schemaId: 'dl_data_section7_schema',
    createdAt: '2022-10-28T16:01:03.529090'
  }
];
