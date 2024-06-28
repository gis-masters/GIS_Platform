import { Block } from '../../Block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

class EditFeatureGeometryBlock extends Block {
  selectors = {
    container: '.EditFeatureGeometry',
    coord: '.EditFeatureGeometry-Coord',
    coordInput: '.EditFeatureGeometry-CoordInput'
  };

  async changeFormInputValue(fieldNumber: number, fieldType: 'X' | 'Y', value: string): Promise<void> {
    const $formInput = await this.getFormInputByNumberAndType(fieldNumber, fieldType);
    await $formInput.clearValue();
    await $formInput.setValue(value);
  }

  async getFormInputByNumberAndType(fieldNumber: number, fieldType: 'X' | 'Y'): Promise<MuiInputBlock> {
    const $coords = await this.$$('coord');
    const $coord = $coords[fieldNumber - 1];
    const $coordInputs = await $coord.$$(this.selectors.coordInput);
    const $coordInput = $coordInputs[fieldType === 'X' ? 0 : 1];

    return new MuiInputBlock($coordInput);
  }
}

export const editFeatureGeometryBlock = new EditFeatureGeometryBlock();
