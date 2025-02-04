import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import { KeyboardArrowDown, Warning } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { ImportResult } from '../../services/data/processes/processes.models';
import { Button } from '../Button/Button';
import { Link } from '../Link/Link';

import '!style-loader!css-loader!sass-loader!./ImportGmlResultDialog.scss';

const cnImportGmlResultDialog = cn('ImportGmlResultDialog');

interface ImportGmlResultDialogProps {
  open: boolean;
  onClose(): void;
  reports: ImportResult;
}

@observer
export class ImportGmlResultDialog extends Component<ImportGmlResultDialogProps> {
  render() {
    const { open, reports, onClose } = this.props;
    const { projectIsNew, projectId, projectName, importLayerReports = [] } = reports || {};

    return (
      <Dialog open={open} onClose={onClose} PaperProps={{ className: cnImportGmlResultDialog() }}>
        <DialogTitle>Импорт завершён</DialogTitle>
        <DialogContent>
          <DialogContentText>Данные загружены в {projectIsNew && 'новый'} проект:</DialogContentText>
          {projectId && (
            <DialogContentText>
              <Link href={`/projects/${projectId}/map`}>{projectName}</Link>
            </DialogContentText>
          )}
          <Accordion>
            <AccordionSummary expandIcon={<KeyboardArrowDown />}>
              <Typography>Отчёт по загруженным объектам</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List className={cnImportGmlResultDialog('ReportList')}>
                {importLayerReports?.map(reportItem => {
                  if (reportItem.success) {
                    return (
                      <ListItem key={reportItem.tableIdentifier}>
                        <ListItemText primary={reportItem.tableTitle} secondary={reportItem.tableIdentifier} />
                        <ListItemSecondaryAction>
                          <Chip label={reportItem.successCount} color='primary' />
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  } else if (!reportItem.success && reportItem.successCount === 0 && reportItem.reason) {
                    return (
                      <ListItem key={reportItem.schemaId}>
                        <ListItemText primary={reportItem.tableTitle} secondary={reportItem.schemaId} />
                        <ListItemSecondaryAction>
                          <Tooltip title={reportItem.reason}>
                            <Warning color='error' />
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  }
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
