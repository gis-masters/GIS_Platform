import React, { type FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Delete, DeleteOutline, DownloadOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { doConfirm } from '../../services/answer-modals.service';
import { communicationService } from '../../services/communication.service';
import { type TemplateInfo } from '../../services/report/reportTemplate/reportTemplate.models';
import { deleteTemplate, downloadTemplate } from '../../services/report/reportTemplate/reportTemplate.service';
import { saveAsBlob } from '../../services/util/FileSaver';
import { IconButton } from '../IconButton/IconButton';

const cnReportTemplateActions = cn('ReportTemplateActions');

interface ReportTemplateActionsProps {
  template: TemplateInfo;
}

type ReportTemplateActionsState = {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen(open: boolean): void;
};

export const ReportTemplateActions: FC<ReportTemplateActionsProps> = observer(({ template }) => {
  const state = useLocalObservable<ReportTemplateActionsState>(() => ({
    deleteDialogOpen: false,
    setDeleteDialogOpen(open) {
      this.deleteDialogOpen = open;
    }
  }));

  const handleDownload = useCallback(async () => {
    const blob = await downloadTemplate(template.name);
    saveAsBlob(template.name, blob);
  }, [template]);

  const deleteDisabled = template.system;

  const handleDelete = useCallback(async () => {
    state.setDeleteDialogOpen(true);

    const confirmed = await doConfirm({
      title: 'Подтверждение удаления',
      message: `Вы действительно хотите удалить шаблон отчёта "${template.title}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена'
    });

    if (confirmed) {
      await deleteTemplate(template.name);
      communicationService.reportTemplateUpdated.emit({ type: 'delete', data: template });
    }

    state.setDeleteDialogOpen(false);
  }, [state, template]);

  return (
    <div className={cnReportTemplateActions()}>
      <Tooltip title='Скачать файл шаблона'>
        <IconButton onClick={handleDownload}>
          <DownloadOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title={deleteDisabled ? 'Системный шаблон нельзя удалить' : 'Удалить'}>
        <span>
          <IconButton onClick={handleDelete} color='error' disabled={deleteDisabled}>
            {state.deleteDialogOpen ? <Delete /> : <DeleteOutline />}
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
});
