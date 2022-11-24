import { Block, BlockModel } from '../../Block';

class Breadcrumbs extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Breadcrumbs');
  }
}

export const breadcrumbs = new Breadcrumbs();
