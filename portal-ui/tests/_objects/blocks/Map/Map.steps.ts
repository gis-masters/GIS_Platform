import { Then, When } from '@wdio/cucumber-framework';

import { mapBlock } from './Map.block';
import { getMapPosition } from '../../commands/map/getMapPosition';
import { isLayerVisibleOnMap } from '../../commands/isLayerVisibleOnMap';
import { MapPage } from '../../pages/Map.page';
import { ScenarioScope } from '../../ScenarioScope';

When('слой {string} не отображается на карте', async (layerName: string) => {
  await browser.waitUntil(async () => !(await isLayerVisibleOnMap(layerName)), {
    timeout: 5000,
    interval: 1000,
    timeoutMsg: `Слой ${layerName} отображается на карте, а не должен`
  });
});

When('слой {string} отображается на карте', async (layerName: string) => {
  await browser.waitUntil(async () => await isLayerVisibleOnMap(layerName), {
    timeout: 5000,
    interval: 1000,
    timeoutMsg: `Слой ${layerName} не отображается на карте`
  });
});

When('я протыкаю карту в центре', async function () {
  await mapBlock.clickOnMap();
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
