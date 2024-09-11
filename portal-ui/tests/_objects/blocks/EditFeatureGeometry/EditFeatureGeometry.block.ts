import { Block } from '../../Block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

class EditFeatureGeometryBlock extends Block {
  selectors = {
    container: '.EditFeatureGeometry',
    view: '.EditFeatureGeometry-View',
    coord: '.EditFeatureGeometry-Coord',
    coordInput: '.EditFeatureGeometry-CoordInput',
    warningIcon: '.MuiSvgIcon-colorWarning',
    geometryForm: '.EditFeatureGeometry-Form'
  };

  async getEditFormCoordsIndexes(): Promise<string[]> {
    const $geometryForm = await this.$('geometryForm');
    const $$coords = await $geometryForm.$$('.EditFeatureGeometry-CoordNumber');

    const indexes: string[] = [];
    for (const $coord of $$coords) {
      indexes.push(await $coord.getText());
    }

    return indexes;
  }

  async getViewFormCoordsIndexes(): Promise<string[]> {
    const $viewForm = await this.$('view');
    const $$coords = await $viewForm.$$('.EditFeatureGeometry-ViewGroupIndexCell');

    const indexes: string[] = [];
    for (const $coord of $$coords) {
      indexes.push(await $coord.getText());
    }

    return indexes;
  }

  async changeFormInputValue(fieldNumber: number, value: string): Promise<void> {
    const $formInput = await this.getFormInputByNumber(fieldNumber);
    await $formInput.clearValue();
    await $formInput.setValue(value);
  }

  async getFormInputByNumber(fieldNumber: number): Promise<MuiInputBlock> {
    const $$coords = await this.$$('coord');

    return new MuiInputBlock($$coords[fieldNumber - 1]);
  }

  async hasWarningInInput(fieldNumber: number): Promise<boolean> {
    const inputRoot = await this.getFormInputByNumber(fieldNumber);

    return await inputRoot.hasWarningIcon();
  }
}

export const editFeatureGeometryBlock = new EditFeatureGeometryBlock();
