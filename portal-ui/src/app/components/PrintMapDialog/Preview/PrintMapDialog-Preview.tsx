import React, { Component, createRef } from 'react';
import { action, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { mapService } from '../../../services/map/map.service';
import { BORDER_WIDTH_MM, getMapImage } from '../../../services/map/map-print.service';
import { printSettings } from '../../../stores/PrintSettings.store';
import { Loading } from '../../Loading/Loading';
import { PrintMapDialogCopy } from '../Copy/PrintMapDialog-Copy';
import { PrintMapDialogDate } from '../Date/PrintMapDialog-Date';
import { PrintMapDialogLegend } from '../Legend/PrintMapDialog-Legend';
import { PrintMapDialogPreviewImage } from '../PreviewImage/PrintMapDialog-PreviewImage';
import { PrintMapDialogPreviewImageContainer } from '../PreviewImageContainer/PrintMapDialog-PreviewImageContainer';
import { PrintMapDialogScale } from '../Scale/PrintMapDialog-Scale';
import { PrintMapDialogWindRose } from '../WindRose/PrintMapDialog-WindRose';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-Preview.scss';

const cnPrintMapDialogPreview = cn('PrintMapDialog', 'Preview');

interface PrintMapDialogPreviewProps {
  open: boolean;
}

@observer
export class PrintMapDialogPreview extends Component<PrintMapDialogPreviewProps> {
  private reactionDisposer?: IReactionDisposer;
  private needUpdatePreviewImageAfterUpdate = false;
  private updatingPreviewImage = false;
  private previewRef = createRef<HTMLImageElement>();
  @observable private previewDragStartX = 0;
  @observable private previewDragStartY = 0;
  @observable private previewDragX = 0;
  @observable private previewDragY = 0;
  @observable private previewImageDataUri?: string;

  constructor(props: PrintMapDialogPreviewProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    this.reactionDisposer = reaction(
      () => {
        const { orientation, pageFormat, scale, margin, legend, showSystemLayers } = printSettings;

        return [orientation, pageFormat, scale, margin, legend.auto, showSystemLayers];
      },
      async () => {
        await this.updatePreview();
      }
    );

    await this.updatePreview();
  }

  async componentDidUpdate(prevProps: PrintMapDialogPreviewProps) {
    if (prevProps.open !== this.props.open) {
      await this.updatePreview();
    }
  }

  componentWillUnmount() {
    this.reactionDisposer?.();
  }

  render() {
    const { pageFormatId, orientation, margin, windRose, date, legend, rotation, printingInProcess } = printSettings;

    return (
      <div className={cnPrintMapDialogPreview()}>
        <Paper
          className={cnPrintMapDialogPreview({ orientation, pageFormat: pageFormatId })}
          style={{
            '--PrintMapDialogPreviewMarginTop': margin.top,
            '--PrintMapDialogPreviewMarginRight': margin.right,
            '--PrintMapDialogPreviewMarginBottom': margin.bottom,
            '--PrintMapDialogPreviewMarginLeft': margin.left,
            '--PrintMapDialogPreviewShiftX': this.previewDragX - this.previewDragStartX,
            '--PrintMapDialogPreviewShiftY': this.previewDragY - this.previewDragStartY,
            '--PrintMapDialogPreviewRotation': rotation,
            '--PrintMapDialogPreviewBorderWidth': BORDER_WIDTH_MM
          }}
          square
          elevation={3}
        >
          <Loading visible={!this.previewImageDataUri} />
          <PrintMapDialogPreviewImageContainer
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            onDrag={this.handleDrag}
          >
            {this.previewImageDataUri && (
              <>
                <PrintMapDialogPreviewImage src={this.previewImageDataUri} imgRef={this.previewRef} />
                <PrintMapDialogCopy />
              </>
            )}

            <PrintMapDialogScale />

            {windRose && <PrintMapDialogWindRose />}

            {date && <PrintMapDialogDate />}

            {legend.enabled && Boolean(legend.items.length) && <PrintMapDialogLegend />}

            <Loading visible={printingInProcess} />
          </PrintMapDialogPreviewImageContainer>
        </Paper>
      </div>
    );
  }

  @action
  private setPreviewImageDataUri(dataUri: string) {
    this.previewImageDataUri = dataUri;
  }

  private async updatePreview(translateX?: number, translateY?: number) {
    if (!this.props.open || !mapService.view) {
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
  private handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
    this.previewDragStartX = e.clientX;
    this.previewDragX = e.clientX;
    this.previewDragStartY = e.clientY;
    this.previewDragY = e.clientY;
  }

  @action.bound
  private handleDrag(e: React.DragEvent<HTMLDivElement>) {
    if (!e.clientX && !e.clientY) {
      return false;
    }
    this.previewDragX = e.clientX;
    this.previewDragY = e.clientY;
  }

  @boundMethod
  private async handleDragEnd(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    if (!this.previewRef.current) {
      return;
    }

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
