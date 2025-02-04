import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';

import { PrintTemplate } from '../../../services/print/templates/PrintTemplate';
import { Button } from '../../Button/Button';
import { PrintActionTemplate } from '../Template/PrintAction-Template';

const cnPrintActionDialog = cn('PrintAction', 'Dialog');

interface PrintActionDialogProps<T> {
  entity: T;
  templates: PrintTemplate<T>[];
  open: boolean;
  onClose(): void;
}

@observer
export class PrintActionDialog<T> extends Component<PrintActionDialogProps<T>> {
  render() {
    const { entity, templates, open, onClose } = this.props;

    return (
      <Dialog PaperProps={{ className: cnPrintActionDialog() }} open={open} onClose={onClose}>
        <DialogTitle>Выберите шаблон печати</DialogTitle>
        <DialogContent>
          {templates.map(template => (
            <PrintActionTemplate entity={entity} template={template} onPrint={onClose} key={template.name} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
