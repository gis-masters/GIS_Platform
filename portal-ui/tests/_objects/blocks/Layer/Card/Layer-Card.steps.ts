import { DataTable } from '@cucumber/cucumber';
import { Then, When } from '@wdio/cucumber-framework';

import { layerCardBlock } from './Layer-Card.block';

When(
  'в списке слоев панели слоёв я нажимаю на иконку включения отображения пункта с названием {string}',
  async (layerName: string) => {
    await layerCardBlock.clickVisibilityBtn(layerName);
  }
);

When('в панели слоёв я разворачиваю пункт с названием {string}', async (layerName: string) => {
  await layerCardBlock.clickOpenBtn(layerName);
});

When('в списке слоёв отображается только пункт {string}', async (layerName: string) => {
  const layersCardsText = await layerCardBlock.getLayersCardsNames();

  await expect(layersCardsText).toEqual([layerName]);
});

Then('в списке слоев панели слоёв отображаются пункты:', async (expectedNames: DataTable) => {
  const currentNames = await layerCardBlock.getLayersCardsNames();

  await expect(expectedNames.raw()[0]).toEqual(currentNames);
});

Then('в списке слоев панели слоёв отображается пункт {string}', async (layerName: string) => {
  const currentNames = await layerCardBlock.getLayersCardsNames();

  await expect(currentNames.includes(layerName)).toBeTruthy();
});

Then('в списке слоев панели слоёв не отображается пункт {string}', async (expectedName: string) => {
  const layerCardExisting = await layerCardBlock.isLayerCardExist(expectedName);

  await expect(layerCardExisting).toBeFalsy();
});

Then('список слоёв пуст', async () => {
  const layersCardsNames = await layerCardBlock.getLayersCardsNames();

  await expect(layersCardsNames.length).toEqual(0);
});

Then('в списке слоёв в пункте {string} отображается иконка ошибки', async (layerName: string) => {
  const errorIcon = await layerCardBlock.isLayerCardErrorIconExist(layerName);

  await expect(errorIcon).toEqual(true);
});
