import React, { Component } from 'react';
import { Dialog, DialogActions } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { exportMap, printMap } from '../../services/map/map-print.service';
import { defaultPrintSettings, printSettings } from '../../stores/PrintSettings.store';
import { Button } from '../Button/Button';
import { PrintMapDialogContent } from './Content/PrintMapDialog-Content';
import { PrintMapDialogForm } from './Form/PrintMapDialog-Form';
import { PrintMapDialogPreview } from './Preview/PrintMapDialog-Preview';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog.scss';
import '!style-loader!css-loader!sass-loader!./JpegButton/PrintMapDialog-JpegButton.scss';

const cnPrintMapDialog = cn('PrintMapDialog');

export interface PrintMapDialogProps {
  open: boolean;
  allowJpg?: boolean;
  allowPdf?: boolean;
  directlyPrint?: boolean;
  format?: string;
  onPrint?(pdf: Blob): void;
  onExport?(image: string): void;
  onClose(): void;
}

export default class PrintMapDialog extends Component<PrintMapDialogProps> {
  componentDidUpdate(prevProps: PrintMapDialogProps) {
    if (!prevProps.open && this.props.open) {
      if (this.props.format) {
        printSettings.setPageFormatId(this.props.format);
      } else if (printSettings.pageFormatId === 'square') {
        printSettings.setPageFormatId(defaultPrintSettings.pageFormatId);
      }
    }
  }

  render() {
    const { open, directlyPrint, format, allowJpg, allowPdf, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose} PaperProps={{ className: cnPrintMapDialog() }}>
        <PrintMapDialogContent>
          <PrintMapDialogPreview open={open} />
          <PrintMapDialogForm format={format} onSubmit={this.handleSubmit} />
        </PrintMapDialogContent>
        <DialogActions>
          {allowJpg && (
            <Button
              className={cnPrintMapDialog('JpegButton', { secondary: allowPdf })}
              onClick={this.handleExport}
              color={allowPdf ? 'secondary' : 'primary'}
              type={allowPdf ? 'button' : 'submit'}
            >
              {directlyPrint ? 'Экспорт в JPG' : 'Выбор'}
            </Button>
          )}
          {allowPdf && (
            <Button type='submit' form='printMapDialogForm' color='primary'>
              {directlyPrint ? 'Печать' : 'Выбор'} (PDF)
            </Button>
          )}
          <Button onClick={onClose}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private async handleSubmit() {
    const { onClose, directlyPrint = false, onPrint } = this.props;
    onClose();

    const pdfBlob = await printMap(directlyPrint);

    if (onPrint) {
      onPrint(pdfBlob);
    }
  }

  @boundMethod
  private async handleExport() {
    const { onClose, directlyPrint = false, onExport } = this.props;
    onClose();

    const image = await exportMap(directlyPrint);

    if (onExport) {
      onExport(image);
    }
  }
}
