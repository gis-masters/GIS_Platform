import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';

class MapBlock extends Block {
  selectors = {
    container: '.map',
    map: '.map__map',
    scaleBar: '.map__map .ol-scale-bar'
  };

  async clickOnMap(): Promise<void> {
    const $map = await this.$('map');
    await $map.waitForClickable();
    await sleep(300); // жду подгрузки объектов
    await $map.click();
  }

  async waitForMapIsClickable(): Promise<void> {
    const $map = await this.$('map');
    await $map.waitForClickable();
  }

  async moveToMap(): Promise<void> {
    const $map = await this.$('map');
    await $map.waitForDisplayed();
    await $map.moveTo();
  }

  async dragAndDropFromMapCenterToMapScaleBar(): Promise<void> {
    const $map = await this.$('map');
    await $map.moveTo();
    const $scaleBar = await this.$('scaleBar');
    await $map.dragAndDrop($scaleBar);
  }
}

export const mapBlock = new MapBlock();
