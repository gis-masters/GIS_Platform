import { Then } from '@wdio/cucumber-framework';

import { mapMapBlock } from './Map-Map.block';

Then('на карте отображаются только {string}', async (variant: string) => {
  const mapToolbar = await $('.MapToolbar');
  const selector = await $('.BasemapsSelect');
  const zoom = await $('.ol-zoom');
  const sidebarOpenBtn = await $('.LayersSidebar-Open');

  await mapMapBlock.assertSelfie(variant.split(' ').join('-'), {
    hideElements: [mapToolbar, selector, zoom, sidebarOpenBtn]
  });
});
