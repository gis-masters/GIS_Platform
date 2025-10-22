import React, { Component, createRef } from 'react';
import { action, type IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { mapService } from '../../../services/map/map.service';
import { BORDER_WIDTH_MM, getMapImage } from '../../../services/map/map-print.service';
import { sleep } from '../../../services/util/sleep';
import { printSettings } from '../../../stores/PrintSettings.store';
import { Loading } from '../../Loading/Loading';
import { PrintMapDialogCopy } from '../Copy/PrintMapDialog-Copy';
import { PrintMapDialogDate } from '../Date/PrintMapDialog-Date';
import { PrintMapDialogLegend } from '../Legend/PrintMapDialog-Legend';
import { PrintMapDialogPreviewImage } from '../PreviewImage/PrintMapDialog-PreviewImage';
import { PrintMapDialogPreviewImageContainer } from '../PreviewImageContainer/PrintMapDialog-PreviewImageContainer';
import { PrintMapDialogScale } from '../Scale/PrintMapDialog-Scale';
import { PrintMapDialogWindRose } from '../WindRose/PrintMapDialog-WindRose';

import './PrintMapDialog-Preview.scss';

const cnPrintMapDialogPreview = cn('PrintMapDialog', 'Preview');

interface PrintMapDialogPreviewProps {
  open: boolean;
}

@observer
export class PrintMapDialogPreview extends Component<PrintMapDialogPreviewProps> {
  private reactionDisposer?: IReactionDisposer;
  // Флаг для отложенного обновления превью
  private needUpdatePreviewImageAfterUpdate = false;
  // Флаг процесса обновления изображения
  private updatingPreviewImage = false;
  // Ссылка на элемент изображения для получения размеров
  private previewRef = createRef<HTMLImageElement>();

  @observable private previewDragStartX = 0;
  @observable private previewDragStartY = 0;
  @observable private previewDragX = 0;
  @observable private previewDragY = 0;
  @observable private lastDragTime = 0;
  @observable private previewImageDataUri?: string;

  constructor(props: PrintMapDialogPreviewProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    //  Реакция на изменении настроек
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
    // Обновление при открытии/закрытии диалога
    if (prevProps.open !== this.props.open) {
      await this.updatePreview();
    }
  }

  componentWillUnmount() {
    this.reactionDisposer?.();
    // Очищаем изображение при размонтировании, чтобы не было утечки памяти
    if (this.previewImageDataUri && this.previewImageDataUri.startsWith('data:')) {
      URL.revokeObjectURL(this.previewImageDataUri);
    }
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

          {/* Контейнер для изображения с обработчиками перетаскивания */}
          <PrintMapDialogPreviewImageContainer
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            onDrag={this.handleDrag}
          >
            {/* Отображение изображения превью если оно загружено */}
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
    if (this.previewImageDataUri && this.previewImageDataUri.startsWith('data:')) {
      URL.revokeObjectURL(this.previewImageDataUri);
    }

    this.previewImageDataUri = dataUri;
  }

  private async updatePreview(translateX?: number, translateY?: number, retryCount = 0) {
    if (!this.props.open || !mapService.view) {
      return;
    }

    // Если происходит обновление, откладываем следующее
    if (this.updatingPreviewImage) {
      this.needUpdatePreviewImageAfterUpdate = true;

      return;
    }

    this.updatingPreviewImage = true;

    try {
      printSettings.setRotation(mapService.view.getRotation());

      // Генерация изображения карты с указанными параметрами
      const dataUri = await getMapImage({
        resolution: 72,
        withDesignations: false,
        translateX,
        translateY
      });

      this.setPreviewImageDataUri(dataUri);

      // Сброс позиции перетаскивания
      this.resetDrag();
    } catch (error) {
      console.error('Error updating preview:', error);
    } finally {
      // Механизм повторных попыток при ошибках
      if (retryCount < 3) {
        await sleep(300 * (retryCount + 1));
        await this.updatePreview(translateX, translateY, retryCount + 1);
      }

      // Выполнение отложенного обновления если оно было запрошено
      if (this.needUpdatePreviewImageAfterUpdate) {
        this.needUpdatePreviewImageAfterUpdate = false;
        await this.updatePreview();
      }

      this.updatingPreviewImage = false;
    }
  }

  @action.bound
  private handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    // Скрытие стандартного изображения перетаскивания
    e.dataTransfer.setDragImage(document.createElement('div'), 0, 0);

    // Сохранение начальных координат
    this.previewDragStartX = e.clientX;
    this.previewDragX = e.clientX;
    this.previewDragStartY = e.clientY;
    this.previewDragY = e.clientY;
  }

  @action.bound
  private handleDrag(e: React.DragEvent<HTMLDivElement>) {
    // Троттлинг для оптимизации производительности
    if (this.lastDragTime && Date.now() - this.lastDragTime < 50) {
      return;
    }

    // Игнорирование событий без координат
    if (!e.clientX && !e.clientY) {
      return;
    }

    // Обновление текущих координат
    this.previewDragX = e.clientX;
    this.previewDragY = e.clientY;
    this.lastDragTime = Date.now();
  }

  @boundMethod
  private async handleDragEnd(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    if (!this.previewRef.current) {
      return;
    }

    // Расчет смещения в относительных единицах (доля от размера изображения)
    const { clientWidth, clientHeight } = this.previewRef.current;
    const translateX = (this.previewDragX - this.previewDragStartX) / clientWidth;
    const translateY = (this.previewDragY - this.previewDragStartY) / clientHeight;

    // Обновление превью с учетом смещения
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
