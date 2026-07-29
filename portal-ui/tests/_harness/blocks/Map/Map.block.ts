import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../classes/Block';
import { workspaceHeaderBlock } from '../WorkspaceHeader/WorkspaceHeader.block';

class MapBlock extends Block {
  selectors = {
    root: '.map',
    map: '.map__map',
    scaleBar: '.map__map .ol-scale-bar'
  };

  async waitForReadyForProkol(): Promise<void> {
    await workspaceHeaderBlock.waitForLoading({ timeout: 15_000 });
    await sleep(900); // ожидание готовности карты
  }

  async clickOnMap(): Promise<void> {
    const $map = await this.findBySelector('map');
    await $map.waitForClickable();
    await this.waitForReadyForProkol();
    await $map.click();
  }

  async waitForMapIsClickable(): Promise<void> {
    const $map = await this.findBySelector('map');
    await $map.waitForClickable();
  }

  async moveToMap(): Promise<void> {
    const $map = await this.findBySelector('map');
    await $map.waitForDisplayed();
    await $map.moveTo();
  }

  async dragAndDropFromMapCenterToMapScaleBar(): Promise<void> {
    const $map = await this.findBySelector('map');
    await $map.moveTo();
    const $scaleBar = await this.findBySelector('scaleBar');
    await $map.dragAndDrop($scaleBar);
  }
}

export const mapBlock = new MapBlock();
