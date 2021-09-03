import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
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
} from '@material-ui/core';

import { KeyboardArrowDown, Warning } from '@material-ui/icons';
import { CrgProject } from '../../services/crg/projects.models';
import { Button } from '../Button/Button';
import { TableReport } from '../ImportGml/ImportGml';
import { Link } from '../Link/Link';

import '!style-loader!css-loader!sass-loader!./ImportGmlResultDialog.scss';

const cnImportGmlResultDialog = cn('ImportGmlResultDialog');

interface ImportGmlResultDialogProps {
  open: boolean;
  onClose(): void;
  projectIsNew: boolean;
  project?: CrgProject;
  reports: TableReport[];
}

export class ImportGmlResultDialog extends Component<ImportGmlResultDialogProps> {
  render() {
    const { open, reports, onClose, projectIsNew, project } = this.props;

    if (!project || !reports) {
      return null;
    }

    return (
      <Dialog open={open} onClose={onClose} PaperProps={{ className: cnImportGmlResultDialog() }}>
        <DialogTitle>Импорт завершён</DialogTitle>
        <DialogContent>
          <DialogContentText>Данные загружены в {projectIsNew && 'новый'} проект:</DialogContentText>
          <DialogContentText>
            <Link url={`/projects/${project.id}/map`}>{project.name}</Link>
          </DialogContentText>
          <Accordion>
            <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls='panel1a-content' id='panel1a-header'>
              <Typography>Отчёт по загруженным объектам</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List className={cnImportGmlResultDialog('ReportList')}>
                {reports.map(reportItem => {
                  if (reportItem.success) {
                    return (
                      <ListItem key={reportItem.tableIdentifier}>
                        <ListItemText primary={reportItem.tableTitle} secondary={reportItem.tableIdentifier} />
                        <ListItemSecondaryAction>
                          <Chip label={reportItem.successCount} color='primary' />
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  } else if (!reportItem.success && reportItem.successCount == 0 && reportItem.reason) {
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
