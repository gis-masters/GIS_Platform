import React, { Component } from 'react';
import { Dialog, DialogActions } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { exportMap, printMap } from '../../services/map/map-print.service';
import { Button } from '../Button/Button';

import { PrintMapDialogContent } from './Content/PrintMapDialog-Content';
import { PrintMapDialogPreview } from './Preview/PrintMapDialog-Preview';
import { PrintMapDialogForm } from './Form/PrintMapDialog-Form';

import '!style-loader!css-loader!sass-loader!./JpegButton/PrintMapDialog-JpegButton.scss';

const cnPrintMapDialog = cn('PrintMapDialog');

interface PrintMapDialogProps {
  open: boolean;
  onClose(): void;
  directlyPrint?: boolean;
  allowJpg?: boolean;
  onPrint?(pdf: Blob): void;
}

export class PrintMapDialog extends Component<PrintMapDialogProps> {
  render() {
    const { open, onClose, directlyPrint, allowJpg } = this.props;

    return (
      <Dialog open={open} onClose={onClose} PaperProps={{ className: cnPrintMapDialog() }}>
        <PrintMapDialogContent>
          <PrintMapDialogPreview open={open} />
          <PrintMapDialogForm onSubmit={this.submitHandler} />
        </PrintMapDialogContent>
        <DialogActions>
          {allowJpg && (
            <Button className={cnPrintMapDialog('JpegButton')} onClick={this.exportHandler}>
              {directlyPrint ? 'Экспорт в JPG' : 'Выбор (JPG)'}
            </Button>
          )}
          <Button type='submit' form='printMapDialogForm' color='primary'>
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
