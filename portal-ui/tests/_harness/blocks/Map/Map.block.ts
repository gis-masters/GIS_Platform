import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../classes/Block';
import { getMapPosition } from '../../commands/map/getMapPosition';
import { workspaceHeaderBlock } from '../WorkspaceHeader/WorkspaceHeader.block';

class MapBlock extends Block {
  selectors = {
    root: '.map',
    map: '.map__map',
    scaleBar: '.map__map .ol-scale-bar'
  };

  async waitForMapPositionStable(options: { timeout?: number } = {}): Promise<void> {
    const timeout = options.timeout ?? 15_000;

    await browser.waitUntil(
      async () => {
        try {
          const url = new URL(await browser.getUrl());

          return Boolean(url.searchParams.get('center') && url.searchParams.get('zoom'));
        } catch {
          return false;
        }
      },
      { timeout, timeoutMsg: 'В URL нет позиции карты' }
    );

    await browser.waitUntil(
      async () => {
        const pos1 = await getMapPosition();
        await sleep(400);
        const pos2 = await getMapPosition();

        return (
          pos1.zoom === pos2.zoom &&
          Math.abs(pos1.center[0] - pos2.center[0]) < 1 &&
          Math.abs(pos1.center[1] - pos2.center[1]) < 1
        );
      },
      { timeout, timeoutMsg: 'Позиция карты не стабилизировалась' }
    );
  }

  async waitForReadyForProkol(): Promise<void> {
    await workspaceHeaderBlock.waitForLoading({ timeout: 15_000 });
    await sleep(900); // ожидание готовности карты/слоёв к WFS-проколу
  }

  async clickOnMap(): Promise<void> {
    const $map = await this.findBySelector('map');
    await $map.waitForClickable();
    await this.waitForReadyForProkol();
    await $map.click();
    // handleProkol асинхронный: сначала уходит в NONE (карточка закрывается), потом WFS.
    // Короткая пауза, чтобы Then не успел увидеть ещё старую открытую карточку.
    await sleep(300);
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
