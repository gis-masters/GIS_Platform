import React, { Component, FormEvent, ChangeEvent, CSSProperties, createRef } from 'react';
import { action, IReactionDisposer, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, Paper } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { printSettings, resolutions, pageFormats, Orientation, scales } from '../../stores/PrintSettings.store';
import { getMapImage, printMap } from '../../services/map/map-print.service';
import { Form, FormField, FormLabel, FormControl } from '../Form/Form';
import { Loading } from '../Loading/Loading';
import { Select } from '../Select/Select';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./PrintDialog.scss';

const cnPrintDialog = cn('PrintDialog');

interface PrintDialogProps {
  open: boolean;
  onClose: () => void;
}

@observer
export class PrintDialog extends Component<PrintDialogProps> {
  private reactionDisposer: IReactionDisposer;
  private needUpdatePreviewImageAfterUpdate = false;
  private updatingPreviewImage = false;
  private previewRef = createRef<HTMLImageElement>();
  @observable private previewImageDataUri: string;
  @observable private previewDragStartX = 0;
  @observable private previewDragStartY = 0;
  @observable private previewDragX = 0;
  @observable private previewDragY = 0;

  componentDidMount() {
    this.reactionDisposer = reaction(
      () => {
        const { orientation, pageFormat, scale, margin } = printSettings;

        return [orientation, pageFormat, scale, margin, this.props.open];
      },
      () => {
        this.updatePreview();
      }
    );
  }

  componentWillUnmount() {
    this.reactionDisposer();
  }

  render() {
    const { open, onClose } = this.props;
    const { orientation, margin, pageFormat } = printSettings;

    return (
      <Dialog open={open} onClose={onClose} PaperProps={{ className: cnPrintDialog() }}>
        <DialogContent>
          <Paper
            className={cnPrintDialog('Preview', { orientation, pageFormat: pageFormat.id })}
            style={
              {
                '--PrintDialogPreviewMarginTop': margin.top,
                '--PrintDialogPreviewMarginRight': margin.right,
                '--PrintDialogPreviewMarginBottom': margin.bottom,
                '--PrintDialogPreviewMarginLeft': margin.left,
                '--PrintDialogPreviewShiftX': this.previewDragX - this.previewDragStartX,
                '--PrintDialogPreviewShiftY': this.previewDragY - this.previewDragStartY
              } as CSSProperties
            }
            square
            elevation={3}
            >
            <div
              className={cnPrintDialog('PreviewImageContainer')}
              onDragStart={this.dragStartHandler}
              onDragEnd={this.dragEndHandler}
              onDrag={this.dragHandler}
              draggable
            >
              {this.previewImageDataUri && (
                <img
                  className={cnPrintDialog('PreviewImage')}
                  src={this.previewImageDataUri}
                  draggable={false}
                  ref={this.previewRef}
                  alt=''
                />
              )}
              <Loading visible={printSettings.printingInProcess} />
            </div>
          </Paper>
          <Form className={cnPrintDialog('Form')} onSubmit={this.submitHandler} id='printDialogForm'>
            <FormField>
              <FormLabel htmlFor='printSettingsPageFormat'>Формат:</FormLabel>
              <FormControl>
                <Select
                  id='printSettingsPageFormat'
                  options={pageFormats.map(({ id, name }) => ({ value: id, children: name }))}
                  onChange={this.handleFormatChange}
                  value={printSettings.pageFormat.id}
                />
              </FormControl>
            </FormField>

            <FormField>
              <FormLabel htmlFor='printSettingsScale'>Масштаб:</FormLabel>
              <FormControl>
                <Select
                  id='printSettingsScale'
                  options={scales.map(scale => ({ value: scale, children: '1 : ' + scale }))}
                  onChange={this.handleScaleChange}
                  value={printSettings.scale}
                />
              </FormControl>
            </FormField>

            <FormField>
              <FormLabel htmlFor='printSettingsResolution'>Разрешение:</FormLabel>
              <FormControl>
                <Select
                  id='printSettingsResolution'
                  options={resolutions.map(resolution => ({ value: resolution, children: resolution + ' dpi' }))}
                  onChange={this.handleResolutionChange}
                  value={printSettings.resolution}
                />
              </FormControl>
            </FormField>

            <FormField>
              <FormLabel htmlFor='printSettingsOrientation'>Ориентация:</FormLabel>
              <FormControl>
                <Select
                  id='printSettingsOrientation'
                  options={[
                    {
                      value: 'l',
                      children: 'Ландшафтная'
                    },
                    {
                      value: 'p',
                      children: 'Портретная'
                    }
                  ]}
                  onChange={this.handleOrientationChange}
                  value={printSettings.orientation}
                />
              </FormControl>
            </FormField>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button type='submit' form='printDialogForm' color='primary'>
            Печать
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    printMap();
    this.props.onClose();
  }

  @boundMethod
  private handleFormatChange(e: ChangeEvent<{ name?: string; value: unknown }>) {
    printSettings.setPageFormat(e.target.value as string);
  }

  @action.bound
  private handleResolutionChange(e: ChangeEvent<{ name?: string; value: unknown }>) {
    printSettings.resolution = Number(e.target.value);
  }

  @action.bound
  private handleScaleChange(e: ChangeEvent<{ name?: string; value: unknown }>) {
    printSettings.scale = Number(e.target.value);
  }

  @action
  private handleOrientationChange(e: ChangeEvent<{ name?: string; value: unknown }>) {
    printSettings.orientation = e.target.value as Orientation;
  }

  @action
  private setPreviewImageDataUri(dataUri: string) {
    this.previewImageDataUri = dataUri;
  }

  private async updatePreview(translateX?: number, translateY?: number) {
    if (!this.props.open) {
      return;
    }

    if (this.updatingPreviewImage) {
      this.needUpdatePreviewImageAfterUpdate = true;
      return;
    }

    if (this.needUpdatePreviewImageAfterUpdate) {
      this.needUpdatePreviewImageAfterUpdate = false;
    }

    this.updatingPreviewImage = true;
    this.setPreviewImageDataUri(await getMapImage(60, translateX, translateY));
    this.resetDrag();
    this.updatingPreviewImage = false;

    if (this.needUpdatePreviewImageAfterUpdate) {
      this.updatePreview();
    }
  }

  @action.bound
  private dragStartHandler(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
    this.previewDragStartX = e.clientX;
    this.previewDragX = e.clientX;
    this.previewDragStartY = e.clientY;
    this.previewDragY = e.clientY;
  }

  @action.bound
  private dragHandler(e: React.DragEvent<HTMLDivElement>) {
    if (!e.clientX && !e.clientY) {
      return false;
    }
    this.previewDragX = e.clientX;
    this.previewDragY = e.clientY;
  }

  @boundMethod
  private dragEndHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const { clientWidth, clientHeight } = this.previewRef.current;
    const translateX = (this.previewDragX - this.previewDragStartX) / clientWidth;
    const translateY = (this.previewDragY - this.previewDragStartY) / clientHeight;

    this.updatePreview(translateX, translateY);
  }

  @action
  private resetDrag() {
    this.previewDragStartX = 0;
    this.previewDragX = 0;
    this.previewDragStartY = 0;
    this.previewDragY = 0;
  }
}
