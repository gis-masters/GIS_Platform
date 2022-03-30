import React, { Component } from 'react';
import { Dialog, DialogActions } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { exportMap, printMap } from '../../services/map/map-print.service';
import { Button } from '../Button/Button';

import { PrintDialogContent } from './Content/PrintDialog-Content';
import { PrintDialogPreview } from './Preview/PrintDialog-Preview';
import { PrintDialogForm } from './Form/PrintDialog-Form';

import '!style-loader!css-loader!sass-loader!./JpegButton/PrintDialog-JpegButton.scss';

const cnPrintDialog = cn('PrintDialog');

interface PrintDialogProps {
  open: boolean;
  onClose(): void;
  directlyPrint?: boolean;
  allowJpg?: boolean;
  onPrint?(pdf: Blob): void;
}

export class PrintDialog extends Component<PrintDialogProps> {
  render() {
    const { open, onClose, directlyPrint, allowJpg } = this.props;

    return (
      <Dialog open={open} onClose={onClose} PaperProps={{ className: cnPrintDialog() }}>
        <PrintDialogContent>
          <PrintDialogPreview open={open} />
          <PrintDialogForm onSubmit={this.submitHandler} />
        </PrintDialogContent>
        <DialogActions>
          {allowJpg && (
            <Button className={cnPrintDialog('JpegButton')} onClick={this.exportHandler}>
              {directlyPrint ? 'Экспорт в JPG' : 'Выбор (JPG)'}
            </Button>
          )}
          <Button type='submit' form='printDialogForm' color='primary'>
            {directlyPrint ? 'Печать' : 'Выбор'} (PDF)
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private async submitHandler() {
    const { onClose, directlyPrint, onPrint } = this.props;
    onClose();
    const pdfBlob = await printMap(directlyPrint);
    if (onPrint) {
      onPrint(pdfBlob);
    }
  }

  @boundMethod
  private async exportHandler() {
    this.props.onClose();
    await exportMap();
  }
}
