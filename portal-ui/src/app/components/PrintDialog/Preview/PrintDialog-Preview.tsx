import React, { Component, createRef } from 'react';
import { action, IReactionDisposer, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Paper } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { printSettings } from '../../../stores/PrintSettings.store';
import { BORDER_WIDTH_MM, getMapImage } from '../../../services/map/map-print.service';
import { mapService } from '../../../services/map/map.service';
import { Loading } from '../../Loading/Loading';

import { PrintDialogPreviewImageContainer } from '../PreviewImageContainer/PrintDialog-PreviewImageContainer';
import { PrintDialogPreviewImage } from '../PreviewImage/PrintDialog-PreviewImage';
import { PrintDialogWindRose } from '../WindRose/PrintDialog-WindRose';
import { PrintDialogScale } from '../Scale/PrintDialog-Scale';
import { PrintDialogDate } from '../Date/PrintDialog-Date';
import { PrintDialogCopy } from '../Copy/PrintDialog-Copy';

import '!style-loader!css-loader!sass-loader!./PrintDialog-Preview.scss';

const cnPrintDialogPreview = cn('PrintDialog', 'Preview');

interface PrintDialogPreviewProps {
  open: boolean;
}

@observer
export class PrintDialogPreview extends Component<PrintDialogPreviewProps> {
  private reactionDisposer: IReactionDisposer;
  private needUpdatePreviewImageAfterUpdate = false;
  private updatingPreviewImage = false;
  private previewRef = createRef<HTMLImageElement>();
  @observable private previewDragStartX = 0;
  @observable private previewDragStartY = 0;
  @observable private previewDragX = 0;
  @observable private previewDragY = 0;
  @observable private previewImageDataUri: string;

  async componentDidMount() {
    this.reactionDisposer = reaction(
      () => {
        const { orientation, pageFormat, scale, margin } = printSettings;

        return [orientation, pageFormat, scale, margin];
      },
      async () => {
        await this.updatePreview();
      }
    );

    await this.updatePreview();
  }

  async componentDidUpdate(prevProps: PrintDialogPreviewProps) {
    if (prevProps.open !== this.props.open) {
      await this.updatePreview();
    }
  }

  componentWillUnmount() {
    this.reactionDisposer();
  }

  render() {
    const { pageFormatId, orientation, margin, windRose, date, rotation, printingInProcess } = printSettings;

    return (
      <div className={cnPrintDialogPreview()}>
        <Paper
          className={cnPrintDialogPreview({ orientation, pageFormat: pageFormatId })}
          style={{
            '--PrintDialogPreviewMarginTop': margin.top,
            '--PrintDialogPreviewMarginRight': margin.right,
            '--PrintDialogPreviewMarginBottom': margin.bottom,
            '--PrintDialogPreviewMarginLeft': margin.left,
            '--PrintDialogPreviewShiftX': this.previewDragX - this.previewDragStartX,
            '--PrintDialogPreviewShiftY': this.previewDragY - this.previewDragStartY,
            '--PrintDialogPreviewRotation': rotation,
            '--PrintDialogPreviewBorderWidth': BORDER_WIDTH_MM
          }}
          square
          elevation={3}
        >
          <PrintDialogPreviewImageContainer
            onDragStart={this.dragStartHandler}
            onDragEnd={this.dragEndHandler}
            onDrag={this.dragHandler}
          >
            {this.previewImageDataUri && (
              <>
                <PrintDialogPreviewImage src={this.previewImageDataUri} imgRef={this.previewRef} />
                <PrintDialogCopy />
              </>
            )}

            <PrintDialogScale />

            {windRose && <PrintDialogWindRose />}

            {date && <PrintDialogDate />}

            <Loading visible={printingInProcess} />
          </PrintDialogPreviewImageContainer>
        </Paper>
      </div>
    );
  }

  @action
  private setPreviewImageDataUri(dataUri: string) {
    this.previewImageDataUri = dataUri;
  }

  private async updatePreview(translateX?: number, translateY?: number) {
    if (!this.props.open) {
      return;
    }

    printSettings.setRotation(mapService.view.getRotation());

    if (this.updatingPreviewImage) {
      this.needUpdatePreviewImageAfterUpdate = true;

      return;
    }

    if (this.needUpdatePreviewImageAfterUpdate) {
      this.needUpdatePreviewImageAfterUpdate = false;
    }

    this.updatingPreviewImage = true;
    this.setPreviewImageDataUri(await getMapImage({ resolution: 72, withDesignations: false, translateX, translateY }));
    this.resetDrag();
    this.updatingPreviewImage = false;

    if (this.needUpdatePreviewImageAfterUpdate) {
      void this.updatePreview();
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
  private async dragEndHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const { clientWidth, clientHeight } = this.previewRef.current;
    const translateX = (this.previewDragX - this.previewDragStartX) / clientWidth;
    const translateY = (this.previewDragY - this.previewDragStartY) / clientHeight;

    await this.updatePreview(translateX, translateY);
  }

  @action
  private resetDrag() {
    this.previewDragStartX = 0;
    this.previewDragX = 0;
    this.previewDragStartY = 0;
    this.previewDragY = 0;
  }
}
