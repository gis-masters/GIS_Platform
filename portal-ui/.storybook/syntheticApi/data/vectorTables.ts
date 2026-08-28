import { DataEntityType, type RawVectorTable } from '../../../src/app/services/data/vectorData/vectorData.models';
import { Role } from '../../../src/app/services/permissions/permissions.models';
import { schemas } from './schemas';

const [projectsSchema, zoningSchema, planningSchema] = schemas;

export const vectorTables: RawVectorTable[] = [
  {
    id: 11,
    title: 'Проекты территории',
    identifier: 'projects_east',
    type: DataEntityType.TABLE,
    createdAt: '2022-02-11T10:00:00.000',
    role: Role.OWNER,
    crs: 'EPSG:3857',
    schema: projectsSchema,
    dataset: 'dataset_crimea_east',
    itemsCount: 42
  },
  {
    id: 12,
    title: 'Зонирование',
    identifier: 'zoning_east',
    type: DataEntityType.TABLE,
    createdAt: '2022-03-01T12:00:00.000',
    role: Role.OWNER,
    crs: 'EPSG:3857',
    schema: zoningSchema,
    dataset: 'dataset_crimea_east',
    itemsCount: 18
  },
  {
    id: 13,
    title: 'Документы планирования',
    identifier: 'planning_east',
    type: DataEntityType.TABLE,
    createdAt: '2022-04-15T08:30:00.000',
    role: Role.OWNER,
    crs: 'EPSG:3857',
    schema: planningSchema,
    dataset: 'dataset_crimea_east',
    itemsCount: 7
  },
  {
    id: 21,
    title: 'Проекты Симферополя',
    identifier: 'projects_simf',
    type: DataEntityType.TABLE,
    createdAt: '2021-12-17T09:00:00.000',
    role: Role.OWNER,
    crs: 'EPSG:3857',
    schema: projectsSchema,
    dataset: 'dataset_simferopol',
    itemsCount: 25
  },
  {
    id: 22,
    title: 'Зонирование Симферополя',
    identifier: 'zoning_simf',
    type: DataEntityType.TABLE,
    createdAt: '2022-01-09T14:20:00.000',
    role: Role.OWNER,
    crs: 'EPSG:3857',
    schema: zoningSchema,
    dataset: 'dataset_simferopol',
    itemsCount: 11
  },
  {
    id: 31,
    title: 'Проекты Алушты',
    identifier: 'projects_alushta',
    type: DataEntityType.TABLE,
    createdAt: '2021-08-05T10:00:00.000',
    role: Role.OWNER,
    crs: 'EPSG:3857',
    schema: projectsSchema,
    dataset: 'dataset_alushta',
    itemsCount: 9
  },
  {
    id: 32,
    title: 'Документы Алушты',
    identifier: 'planning_alushta',
    type: DataEntityType.TABLE,
    createdAt: '2021-09-12T16:45:00.000',
    role: Role.OWNER,
    crs: 'EPSG:3857',
    schema: planningSchema,
    dataset: 'dataset_alushta',
    itemsCount: 4
  },
  {
    id: 41,
    title: 'Тестовые проекты',
    identifier: 'projects_test',
    type: DataEntityType.TABLE,
    createdAt: '2023-03-22T11:30:00.000',
    role: Role.OWNER,
    crs: 'EPSG:3857',
    schema: projectsSchema,
    dataset: 'dataset_test',
    itemsCount: 3
  },
  {
    id: 42,
    title: 'Тестовое зонирование',
    identifier: 'zoning_test',
    type: DataEntityType.TABLE,
    createdAt: '2023-03-23T09:15:00.000',
    role: Role.OWNER,
    crs: 'EPSG:3857',
    schema: zoningSchema,
    dataset: 'dataset_test',
    itemsCount: 2
  },
  {
    id: 51,
    title: 'Документы раздела 3',
    identifier: 'planning_docs',
    type: DataEntityType.TABLE,
    createdAt: '2020-11-28T08:00:00.000',
    role: Role.OWNER,
    crs: 'EPSG:3857',
    schema: planningSchema,
    dataset: 'dataset_planning',
    itemsCount: 30
  },
  {
    id: 52,
    title: 'Карты зонирования',
    identifier: 'zoning_maps',
    type: DataEntityType.TABLE,
    createdAt: '2020-12-01T12:00:00.000',
    role: Role.OWNER,
    crs: 'EPSG:3857',
    schema: zoningSchema,
    dataset: 'dataset_planning',
    itemsCount: 14
  },
  {
    id: 53,
    title: 'Связанные проекты',
    identifier: 'related_projects',
    type: DataEntityType.TABLE,
    createdAt: '2021-01-10T07:40:00.000',
    role: Role.OWNER,
    crs: 'EPSG:3857',
    schema: projectsSchema,
    dataset: 'dataset_planning',
    itemsCount: 6
  }
];
