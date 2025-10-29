import { Block } from '../../Block';
import { extractValues } from '../../commands/extractText';
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
    coordInput: '.EditFeatureGeometry-Form .EditFeatureGeometry-CoordInput input',
    geometryFixBtn: '.EditFeatureGeometryValidationError-Button',
    addGeometryBtn: '.EditFeatureGeometry-AddGeometry',
    copyCoordsBtn: '.EditFeatureGeometry-CopyCoords',
    deleteBtn: '.EditFeatureGeometry-DelButton',
    deleteCoordBtn: '.EditFeatureGeometry-CoordDel',
    draw: '.EditFeatureGeometry-Draw',
    asTextBtn: '.EditFeatureGeometry-AsText'
  };

  async getEditFormCoordsIndexes(): Promise<string[]> {
    const $geometryForm = await this.findBySelector('geometryForm');
    const $$coords = await $geometryForm.$$('.EditFeatureGeometry-CoordNumber').getElements();

    const indexes: string[] = [];
    for (const $coord of $$coords) {
      indexes.push(await $coord.getText());
    }

    return indexes;
  }

  async getViewFormCoordsIndexes(): Promise<string[]> {
    const $viewForm = await this.findBySelector('view');
    const $$coords = await $viewForm.$$('.EditFeatureGeometry-ViewGroupIndexCell').getElements();

    const indexes: string[] = [];
    for (const $coord of $$coords) {
      indexes.push(await $coord.getText());
    }

    return indexes;
  }

  async changeFormInputValue(fieldNumber: number, value: number, coordinate: 'x' | 'y' = 'x'): Promise<void> {
    const $$coords = await this.findAllBySelector('coord');
    const coordElement = $$coords[fieldNumber - 1];
    const selector = coordinate === 'x' ? this.selectors.coordInputX : this.selectors.coordInputY;
    const $input = await coordElement.$(selector).getElement();
    const inputBlock = new MuiInputBlock($input);
    await inputBlock.clearValue();
    await inputBlock.setValue(value.toString());
  }

  async addNodeClick(): Promise<void> {
    const $$groupFooter = await this.findAllBySelector('groupFooter');
    const $firstGroupFooter = $$groupFooter[0];
    const $addCoord = await $firstGroupFooter.$('.EditFeatureGeometry-AddNode').getElement();
    await $addCoord.click();
  }

  async geometryFixBtnClick(): Promise<void> {
    const $geometryFixBtn = await this.findBySelector('geometryFixBtn');
    await $geometryFixBtn.click();
  }

  async changeCoordinates(fieldNumber: number, x: number, y: number): Promise<void> {
    await this.changeFormInputValue(fieldNumber, x, 'x');
    await this.changeFormInputValue(fieldNumber, y, 'y');
  }

  async getFormInputByNumber(fieldNumber: number): Promise<MuiInputBlock> {
    const $$coords = await this.findAllBySelector('coord');

    return new MuiInputBlock($$coords[fieldNumber - 1]);
  }

  async hasWarningInInput(fieldNumber: number): Promise<boolean> {
    const inputRoot = await this.getFormInputByNumber(fieldNumber);

    return await inputRoot.hasWarningIcon();
  }

  async selectFirstInput(): Promise<void> {
    const $$coordInput = await this.findAllBySelector('coordInput');
    await $$coordInput[0].waitForClickable();
    await $$coordInput[0].click();
  }

  async clickGeometryAsTextButton(): Promise<void> {
    const $asText = await this.findBySelector('asTextBtn');
    await $asText.waitForDisplayed();
    await $asText.click();
    await browser.pause(400); // анимация открытия диалога
  }

  async clickAddGeometryButton(): Promise<void> {
    const $addGeometryBtn = await this.findBySelector('addGeometryBtn');
    await $addGeometryBtn.waitForDisplayed();
    await $addGeometryBtn.click();
  }

  async hoverCopyCoordsButton(): Promise<void> {
    const $copyCoordsBtn = await this.findBySelector('copyCoordsBtn');
    await $copyCoordsBtn.waitForDisplayed();
    await $copyCoordsBtn.moveTo();
  }

  // FIXME: разобраться, почему с clickDeleteGroupButton один и тот же селектор
  async clickDeletePolygonButton(): Promise<void> {
    const $deletePolygonBtn = await this.findBySelector('deleteBtn');
    await $deletePolygonBtn.waitForDisplayed();
    await $deletePolygonBtn.click();
  }

  async clickDeleteGroupButton(): Promise<void> {
    const $deleteGroupBtn = await this.findBySelector('deleteBtn');
    await $deleteGroupBtn.waitForDisplayed();
    await $deleteGroupBtn.click();
  }

  async clickDeleteCoordButton(): Promise<void> {
    const $deleteCoordBtn = await this.findBySelector('deleteCoordBtn');
    await $deleteCoordBtn.waitForDisplayed();
    await $deleteCoordBtn.click();
  }

  async clickEditOnMap(): Promise<void> {
    const $draw = await this.findBySelector('draw');
    await $draw.waitForDisplayed();
    await $draw.click();
  }

  async getGeometryInEditMode(): Promise<string[]> {
    const $showAsTextBtn = await this.findBySelector('asTextBtn');
    await $showAsTextBtn.scrollIntoView();
    const $$inputs = await this.findAllBySelector('coordInput');

    return await extractValues([...$$inputs]);
  }
}

export const editFeatureGeometryBlock = new EditFeatureGeometryBlock();
