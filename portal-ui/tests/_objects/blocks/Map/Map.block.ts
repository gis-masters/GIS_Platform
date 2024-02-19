import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';

class MapBlock extends Block {
  selectors = {
    container: '.map',
    map: '.map__map'
  };

  async clickOnMap(): Promise<void> {
    const $map = await this.$('map');
    await $map.waitForClickable();
    await sleep(300); // жду подгрузки объектов
    await $map.click();
  }

  async moveToMap(): Promise<void> {
    const $map = await this.$('map');
    await $map.waitForDisplayed();
    await $map.moveTo();
  }
}

export const mapBlock = new MapBlock();
