import { DataEntityType, type Dataset } from '../../../src/app/services/data/vectorData/vectorData.models';
import { Role } from '../../../src/app/services/permissions/permissions.models';

export const datasets: Dataset[] = [
  {
    id: 1,
    title: 'Восток Крыма',
    identifier: 'dataset_crimea_east',
    details: 'Векторные данные восточного Крыма',
    type: DataEntityType.DATASET,
    createdAt: '2022-02-10T08:35:38.539',
    itemsCount: 3,
    role: Role.OWNER
  },
  {
    id: 2,
    title: 'г.о. Симферополь',
    identifier: 'dataset_simferopol',
    details: 'Данные городского округа Симферополь',
    type: DataEntityType.DATASET,
    createdAt: '2021-12-16T13:19:32.012',
    itemsCount: 2,
    role: Role.OWNER
  },
  {
    id: 3,
    title: 'г.о. Алушта',
    identifier: 'dataset_alushta',
    details: 'Градостроительные данные Алушты',
    type: DataEntityType.DATASET,
    createdAt: '2021-08-04T09:12:00.000',
    itemsCount: 2,
    role: Role.OWNER
  },
  {
    id: 4,
    title: 'Тестовый набор',
    identifier: 'dataset_test',
    type: DataEntityType.DATASET,
    createdAt: '2023-03-21T11:00:00.000',
    itemsCount: 2,
    role: Role.OWNER
  },
  {
    id: 5,
    title: 'Документы территориального планирования',
    identifier: 'dataset_planning',
    details: 'Раздел 3 ГИСОГД',
    type: DataEntityType.DATASET,
    createdAt: '2020-11-27T20:23:50.965',
    itemsCount: 3,
    role: Role.OWNER
  },
  {
    id: 6,
    title: 'Запад Крыма',
    identifier: 'dataset_crimea_west',
    type: DataEntityType.DATASET,
    createdAt: '2020-09-14T10:00:00.000',
    itemsCount: 0,
    role: Role.OWNER
  },
  {
    id: 7,
    title: 'Север Крыма',
    identifier: 'dataset_crimea_north',
    type: DataEntityType.DATASET,
    createdAt: '2020-07-02T10:00:00.000',
    itemsCount: 0,
    role: Role.OWNER
  },
  {
    id: 8,
    title: 'Юг Крыма',
    identifier: 'dataset_crimea_south',
    type: DataEntityType.DATASET,
    createdAt: '2020-05-18T10:00:00.000',
    itemsCount: 0,
    role: Role.OWNER
  },
  {
    id: 9,
    title: 'Степной Крым',
    identifier: 'dataset_crimea_steppe',
    type: DataEntityType.DATASET,
    createdAt: '2020-03-09T10:00:00.000',
    itemsCount: 0,
    role: Role.OWNER
  },
  {
    id: 10,
    title: 'Предгорный Крым',
    identifier: 'dataset_crimea_foothills',
    type: DataEntityType.DATASET,
    createdAt: '2019-12-21T10:00:00.000',
    itemsCount: 0,
    role: Role.OWNER
  },
  {
    id: 11,
    title: 'Присивашье',
    identifier: 'dataset_sivash',
    type: DataEntityType.DATASET,
    createdAt: '2019-08-11T10:00:00.000',
    itemsCount: 0,
    role: Role.OWNER
  },
  {
    id: 12,
    title: 'Тарханкут',
    identifier: 'dataset_tarkhankut',
    type: DataEntityType.DATASET,
    createdAt: '2019-04-05T10:00:00.000',
    itemsCount: 0,
    role: Role.OWNER
  },
  {
    id: 13,
    title: 'Керченский полуостров',
    identifier: 'dataset_kerch_peninsula',
    type: DataEntityType.DATASET,
    createdAt: '2018-11-16T10:00:00.000',
    itemsCount: 0,
    role: Role.OWNER
  }
];
