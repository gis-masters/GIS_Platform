import { Block } from '../../classes/Block';

class PhotoModePreviewerBlock extends Block {
  selectors = {
    root: '.Carousel',
    photosCount: '.swiper-pagination-total'
  };

  async photosCountChecking(count: number): Promise<void> {
    const $photosCount = await this.findBySelector('photosCount');
    const $count = await $photosCount.getText();

    if (Number($count) !== count) {
      throw new Error(`Количество фотографий ${Number($count)} не соответсвует проверяемому значению`);
    }
  }
}

export const photModePreviewerBlock = new PhotoModePreviewerBlock();
