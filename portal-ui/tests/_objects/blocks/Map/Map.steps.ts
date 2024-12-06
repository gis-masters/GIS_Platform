import { Then, When } from '@wdio/cucumber-framework';

import { sleep } from '../../../../src/app/services/util/sleep';
import { getMapPosition } from '../../commands/map/getMapPosition';
import { MapPage } from '../../pages/Map.page';
import { ScenarioScope } from '../../ScenarioScope';
import { mapBlock } from './Map.block';

When('я протыкаю карту в центре', async function () {
  await mapBlock.clickOnMap();
});

When('я выделяю область с центра карты к шкале отображения масштаба', async function () {
  await mapBlock.dragAndDropFromMapCenterToMapScaleBar();
  await sleep(300); // анимация выдвижения FeaturesSidebarTeaser
});

When('я жду когда карта станет кликабельной', async function () {
  await mapBlock.waitForMapIsClickable();
});

When(
  'я перехожу на карту к объекту с id:{string} в созданном слое по ссылке с зумом {int} и центром {int},{int}',
  async function (this: ScenarioScope, id: string, zoom: number, center1: number, center2: number) {
    const { latestDataset, latestVectorTable, latestProject } = this;
    const mapPage = new MapPage(latestProject.id);
    await mapPage.openWithPositionToFeatures(
      latestProject.id,
      latestDataset.identifier,
      latestVectorTable.identifier,
      [id],
      { zoom, center: [center1, center2] }
    );
    await mapBlock.waitForVisible();
  }
);

Then(
  'карта позиционируется на искомом объекте с координатами центра [{int} , {int}] и зумом {float}',
  async function (center1: number, center2: number, zoom: number) {
    const MAP_POS_FOR_OBJECT1 = { center: [center1, center2], zoom: Number(zoom) };
    const position = await getMapPosition();

    await expect(MAP_POS_FOR_OBJECT1).toEqual(position);
  }
);
