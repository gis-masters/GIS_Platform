import { DataEntityType } from '../../../src/app/services/data/data.service';
import { DocumentLibrary } from '../../../src/app/services/data/doc-library.service';

export const libraries: Omit<DocumentLibrary, 'role'>[] = [
  {
    id: 106,
    title: '13. Дела о застроенных или подлежащих застройке земельных участках',
    details: 'тест раздел 13 дела о земельных участках',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section13_schema',
    schemaId: 'dl_data_section13_schema',
    createdAt: '2022-10-28T16:01:03.528768'
  },
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
    id: 14,
    title: 'Дела о застроенных или подлежащих застройке земельных участках',
    details: 'Раздел13',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section13',
    schemaId: 'dl_data_section13',
    createdAt: '2022-10-28T16:01:03.528995'
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
    id: 3,
    title:
      'Документы территориального планирования двух и более субъектов РФ, документы тер. планирования субъектов РФ',
    details: 'Раздел2',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section2',
    schemaId: 'dl_data_section2',
    createdAt: '2022-10-28T16:01:03.529015'
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
    id: 2,
    title: 'Документы территориального планирования РФ',
    details: 'Раздел1',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section1',
    schemaId: 'dl_data_section1',
    createdAt: '2022-10-28T16:01:03.529028'
  },
  {
    id: 11,
    title: 'Зоны с особыми условиями использования территории',
    details: 'Раздел10',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section10',
    schemaId: 'dl_data_section10',
    createdAt: '2022-10-28T16:01:03.529035'
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
    id: 18,
    title: 'Информационные модели объектов капитального строительства',
    details: 'Раздел17',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section17',
    schemaId: 'dl_data_section17',
    createdAt: '2022-10-28T16:01:03.529054'
  },
  {
    id: 19,
    title: 'Иные сведения, документы, материалы"',
    details: 'Раздел18',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section18',
    schemaId: 'dl_data_section18',
    createdAt: '2022-10-28T16:01:03.529061'
  },
  {
    id: 10,
    title: 'Искусственные земельные участки',
    details: 'Раздел9',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section9',
    schemaId: 'dl_data_section9_schema',
    createdAt: '2022-10-28T16:01:03.529066'
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
    id: 5,
    title: 'Нормативы градостроительного проектирования',
    details: 'Раздел4',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section4',
    schemaId: 'dl_data_section4',
    createdAt: '2022-10-28T16:01:03.529078'
  },
  {
    id: 16,
    title: 'Особо охраняемые природные территории',
    details: 'Раздел15',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section15',
    schemaId: 'dl_data_section15_schema',
    createdAt: '2022-10-28T16:01:03.529084'
  },
  {
    id: 8,
    title: 'Планировка территории',
    details: 'Раздел7',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section7',
    schemaId: 'dl_data_section7_schema',
    createdAt: '2022-10-28T16:01:03.529090'
  },
  {
    id: 12,
    title: 'План наземных и подземных коммуникаций',
    details: 'Раздел11',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section11',
    schemaId: 'dl_data_section11_schema',
    createdAt: '2022-10-28T16:01:03.529095'
  },
  {
    id: 7,
    title: 'Правила благоустройства территории',
    details: 'Раздел6',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section6',
    schemaId: 'dl_data_section6',
    createdAt: '2022-10-28T16:01:03.529101'
  },
  {
    id: 15,
    title: 'Программы реализации документов территориального планирования',
    details: 'Раздел14',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section14',
    schemaId: 'dl_data_section14',
    createdAt: '2022-10-28T16:01:03.529107'
  },
  {
    id: 13,
    title: 'Резервирование земель и изъятие земельных участков',
    details: 'Раздел12',
    type: DataEntityType.LIBRARY,
    identifier: 'dl_data_section12',
    schemaId: 'dl_data_section12_schema',
    createdAt: '2022-10-28T16:01:03.529113'
  }
];
