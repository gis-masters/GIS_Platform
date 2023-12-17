import React, { Component } from 'react';
import { Dialog, DialogActions } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { exportMap, printMap } from '../../services/map/map-print.service';
import { Button } from '../Button/Button';

import { PrintMapDialogContent } from './Content/PrintMapDialog-Content';
import { PrintMapDialogPreview } from './Preview/PrintMapDialog-Preview';
import { PrintMapDialogForm } from './Form/PrintMapDialog-Form';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog.scss';
import '!style-loader!css-loader!sass-loader!./JpegButton/PrintMapDialog-JpegButton.scss';
import { printSettings } from '../../stores/PrintSettings.store';

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
    if (!prevProps.open && this.props.open && this.props.format) {
      printSettings.setPageFormatId(this.props.format);
    }
  }

  render() {
    const { open, onClose, directlyPrint, format, allowJpg, allowPdf } = this.props;

    return (
      <Dialog open={open} onClose={onClose} PaperProps={{ className: cnPrintMapDialog() }}>
        <PrintMapDialogContent>
          <PrintMapDialogPreview open={open} />
          <PrintMapDialogForm format={format} onSubmit={this.submitHandler} />
        </PrintMapDialogContent>
        <DialogActions>
          {allowJpg && (
            <Button
              className={cnPrintMapDialog('JpegButton', { secondary: allowPdf })}
              onClick={this.exportHandler}
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
  private async submitHandler() {
    const { onClose, directlyPrint = false, onPrint } = this.props;
    onClose();

    const pdfBlob = await printMap(directlyPrint);

    if (onPrint) {
      onPrint(pdfBlob);
    }
  }

  @boundMethod
  private async exportHandler() {
    const { onClose, directlyPrint = false, onExport } = this.props;
    onClose();

    const image = await exportMap(directlyPrint);

    if (onExport) {
      onExport(image);
    }
  }
}
