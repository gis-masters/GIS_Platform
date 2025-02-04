import { Block } from '../../Block';

class PhotoModePreviewerBlock extends Block {
  selectors = {
    container: '.Carousel',
    photosCount: '.swiper-pagination-total'
  };

  async photosCountChecking(count: number): Promise<void> {
    const $photosCount = await this.$('photosCount');
    const $count = await $photosCount.getText();

    if (Number($count) !== count) {
      throw new Error(`Количество фотографий ${Number($count)} не соответсвует проверяемому значению`);
    }
  }
}

export const photModePreviewerBlock = new PhotoModePreviewerBlock();
