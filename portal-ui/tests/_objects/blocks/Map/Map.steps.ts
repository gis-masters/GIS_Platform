import { Then, When } from '@wdio/cucumber-framework';

import { mapBlock } from './Map.block';
import { getMapPosition } from '../../commands/map/getMapPosition';

When('слой {string} не отображается на карте', async (layerName: string) => {
  await mapBlock.layerObjectNotVisibleOnMap(layerName);
});

When('слой {string} отображается на карте', async (layerName: string) => {
  await mapBlock.layerObjectVisibleOnMap(layerName);
});

When('я протыкаю карту в центре', async function () {
  await mapBlock.clickOnMap();
});

Then(
  'карта позиционируется на искомом объекте с координатами центра [{int} , {int}] и зумом {float}',
  async function (center1: number, center2: number, zoom: number) {
    const MAP_POS_FOR_OBJECT1 = { center: [center1, center2], zoom: Number(zoom) };
    const position = await getMapPosition();

    await expect(MAP_POS_FOR_OBJECT1).toEqual(position);
  }
);
