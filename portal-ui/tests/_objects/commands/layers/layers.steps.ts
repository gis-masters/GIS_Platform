import { DataTable } from '@cucumber/cucumber';
import { Given, Then } from '@wdio/cucumber-framework';

import { CrgLayer, CrgLayerType, NewCrgLayer } from '../../../../src/app/services/gis/layers/layers.models';
import { ScenarioScope } from '../../ScenarioScope';
import { getDatasetByTitle } from '../datasets/getDatasetByTitle';
import { getProjectByTitle } from '../projects/getProjectByTitle';
import { getVectorTableByTitle } from '../tables/getVectorTableByTitle';
import { createLayer } from './createLayer';
import { getLayer } from './getLayer';
import { getLayerSchema } from './getLayerSchema';
import { updateLayer } from './updateLayer';

const errorSchemaOrId = 'У слоя не указана схема или идентификатор';

Given(
  'в созданном проекте создан слой {string} на основе созданных набора данных и таблицы',
  async function (this: ScenarioScope, layerTitle: string) {
    const { latestProject, latestVectorTable, latestDataset } = this;

    const layer: NewCrgLayer = {
      type: CrgLayerType.VECTOR,
      title: layerTitle,
      dataset: latestDataset.identifier,
      view: '',
      tableName: latestVectorTable.identifier,
      nativeCRS: latestVectorTable.crs,
      styleName: latestVectorTable.schema.styleName,
      enabled: true
    };

    this.latestLayer = await createLayer(latestProject.id, layer);
  }
);

Given('у данного слоя включено представление {string}', async function (this: ScenarioScope, viewTitle: string) {
  const { latestLayer, latestProject } = this;

  if (!latestLayer.id) {
    throw new Error(errorSchemaOrId);
  }

  if (latestLayer.type !== CrgLayerType.VECTOR) {
    throw new Error('Слой должен быть векторным');
  }

  const schema = await getLayerSchema(latestLayer);
  const view = schema.views?.find(view => view.title === viewTitle);

  if (!view) {
    throw new Error(`Представление ${viewTitle} не найдено`);
  }

  await updateLayer(latestLayer.id, { view: view.id }, latestProject.id);
});

Given(
  'у созданного слоя настроено масштабирование: минимальное — {int}, максимальное — {int}',
  async function (this: ScenarioScope, minZoom: number, maxZoom: number) {
    const { latestLayer, latestProject } = this;

    if (!latestLayer.id) {
      throw new Error(errorSchemaOrId);
    }

    await updateLayer(latestLayer.id, { minZoom, maxZoom }, latestProject.id);
  }
);

Given('у данного слоя включен фоторежим по полю {string}', async function (this: ScenarioScope, fieldTitle: string) {
  const { latestLayer, latestProject } = this;

  if (!latestLayer.id) {
    throw new Error(errorSchemaOrId);
  }

  const schema = await getLayerSchema(latestLayer);
  const property = schema.properties?.find(({ title }) => title === fieldTitle);

  if (!property) {
    throw new Error(`Свойство ${fieldTitle} не найдено`);
  }

  await updateLayer(latestLayer.id, { photoMode: JSON.stringify([property.name]) }, latestProject.id);
});

Given('в созданном проекте существует внешний слой', async function (this: ScenarioScope, table: DataTable) {
  const { latestProject } = this;

  const data = table.raw()[1];

  const externalLayer = {
    title: data[0],
    tableName: data[1],
    type: CrgLayerType.EXTERNAL,
    dataSourceUri: data[2],
    enabled: Boolean(data[3])
  };

  this.latestLayer = await createLayer(latestProject.id, externalLayer);
});

Given('существует слой с параметрами:', async function (table: DataTable) {
  const [projectTitle, layerTitle, tableTitle, datasetTitle, enabled, viewId] = table.rows()[0];
  const dataset = await getDatasetByTitle(datasetTitle);
  const project = await getProjectByTitle(projectTitle);
  const vectorTable = await getVectorTableByTitle(dataset.identifier, tableTitle);

  const layer = {
    type: CrgLayerType.VECTOR,
    dataset: dataset.identifier,
    tableName: vectorTable.identifier,
    title: layerTitle,
    nativeCRS: vectorTable.crs,
    styleName: vectorTable.schema.styleName,
    enabled: enabled === 'включенный',
    ...(viewId ? { view: viewId } : {})
  };

  await createLayer(project.id, layer);
});

Then(
  'на сервере у данного слоя в поле {string} значение {string}',
  async function (this: ScenarioScope, fieldName: keyof CrgLayer, fieldValue: string) {
    const { latestLayer, latestProject } = this;

    if (!latestLayer.id) {
      throw new Error('У слоя не указана схема или идентификатор');
    }

    const layer = await getLayer(latestLayer.id, latestProject.id);

    await expect(layer[fieldName]).toBe(fieldValue);
  }
);
