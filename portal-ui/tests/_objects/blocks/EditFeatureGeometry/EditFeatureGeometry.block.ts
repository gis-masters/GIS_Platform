import { Block } from '../../Block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

class EditFeatureGeometryBlock extends Block {
  selectors = {
    container: '.EditFeatureGeometry',
    view: '.EditFeatureGeometry-View',
    coord: '.EditFeatureGeometry-Coord',
    coordInputX: '.EditFeatureGeometry-CoordInput_d_x',
    coordInputY: '.EditFeatureGeometry-CoordInput_d_y',
    warningIcon: '.MuiSvgIcon-colorWarning',
    geometryForm: '.EditFeatureGeometry-Form',
    groupFooter: '.EditFeatureGeometry-GroupFooter',
    coordInput: '.EditFeatureGeometry-Form .EditFeatureGeometry-CoordInput',
    geometryFixBtn: '.EditFeatureGeometryValidationError-Button'
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

  async changeFormInputValue(fieldNumber: number, value: number, coordinate: 'x' | 'y' = 'x'): Promise<void> {
    const $$coords = await this.$$('coord');
    const coordElement = $$coords[fieldNumber - 1];
    const selector = coordinate === 'x' ? this.selectors.coordInputX : this.selectors.coordInputY;
    const $input = await coordElement.$(selector);
    const inputBlock = new MuiInputBlock($input);
    await inputBlock.clearValue();
    await inputBlock.setValue(value.toString());
  }

  async addNodeClick(): Promise<void> {
    const $$groupFooter = await this.$$('groupFooter');
    const $firstGroupFooter = $$groupFooter[0];

    const $addCoord = await $firstGroupFooter.$('.EditFeatureGeometry-AddNode');
    await $addCoord.click();
  }

  async geometryFixBtnClick(): Promise<void> {
    const $geometryFixBtn = await this.$('geometryFixBtn');

    await $geometryFixBtn.click();
  }

  async changeCoordinates(fieldNumber: number, x: number, y: number): Promise<void> {
    await this.changeFormInputValue(fieldNumber, x, 'x');
    await this.changeFormInputValue(fieldNumber, y, 'y');
  }

  async getFormInputByNumber(fieldNumber: number): Promise<MuiInputBlock> {
    const $$coords = await this.$$('coord');

    return new MuiInputBlock($$coords[fieldNumber - 1]);
  }

  async hasWarningInInput(fieldNumber: number): Promise<boolean> {
    const inputRoot = await this.getFormInputByNumber(fieldNumber);

    return await inputRoot.hasWarningIcon();
  }

  async selectFirstInput(): Promise<void> {
    const $$coordInput = await this.$$('coordInput');

    await $$coordInput[0].waitForClickable();
    await $$coordInput[0].click();
  }
}

export const editFeatureGeometryBlock = new EditFeatureGeometryBlock();
