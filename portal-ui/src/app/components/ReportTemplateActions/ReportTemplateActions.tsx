import React, { type FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Delete, DeleteOutline, DownloadOutlined, EditOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { doConfirm } from '../../services/answer-modals.service';
import { PropertyType, type SimpleSchema } from '../../services/data/schema/schema.models';
import { type TemplateInfo } from '../../services/reportTemplate/reportTemplate.models';
import { deleteTemplate, downloadTemplate, updateTemplate } from '../../services/reportTemplate/reportTemplate.service';
import { saveAsBlob } from '../../services/util/FileSaver';
import { currentUser } from '../../stores/CurrentUser.store';
import { FormDialog } from '../FormDialog/FormDialog';
import { IconButton } from '../IconButton/IconButton';

const cnReportTemplateActions = cn('ReportTemplateActions');

const CARBONE_DOCS_LINK = 'https://carbone.io/documentation.html';

const editReportTemplateSchema: SimpleSchema = {
  properties: [
    {
      name: 'title',
      title: 'Название',
      required: true,
      description: 'Отображаемое название шаблона отчёта',
      propertyType: PropertyType.STRING
    },
    {
      name: 'name',
      title: 'Идентификатор',
      required: true,
      readOnly: true,
      description: 'Уникальное системное имя шаблона',
      propertyType: PropertyType.STRING,
      regex: '^[a-z0-9_-]+$',
      regexErrorMessage: 'Только латиница в нижнем регистре, цифры, символы _ и -'
    },
    {
      name: 'file',
      title: 'Файл шаблона',
      required: false,
      description: `Необязательно: если файл не выбран, сохраняется текущий файл на сервере. Документация: ${CARBONE_DOCS_LINK}`,
      propertyType: PropertyType.INPUT_FILE
    }
  ]
};

interface EditReportTemplateFormValue {
  name: string;
  title: string;
  file?: File;
}

interface ReportTemplateActionsProps {
  template: TemplateInfo;
}

type ReportTemplateActionsState = {
  deleteDialogOpen: boolean;
  editDialogOpen: boolean;
  setDeleteDialogOpen(open: boolean): void;
  setEditDialogOpen(open: boolean): void;
};

export const ReportTemplateActions: FC<ReportTemplateActionsProps> = observer(({ template }) => {
  const state = useLocalObservable<ReportTemplateActionsState>(() => ({
    deleteDialogOpen: false,
    editDialogOpen: false,
    setDeleteDialogOpen(open) {
      this.deleteDialogOpen = open;
    },
    setEditDialogOpen(open) {
      this.editDialogOpen = open;
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
      await deleteTemplate(template);
    }

    state.setDeleteDialogOpen(false);
  }, [state, template]);

  const openEditDialog = useCallback(() => {
    state.setEditDialogOpen(true);
  }, [state]);

  const closeEditDialog = useCallback(() => {
    state.setEditDialogOpen(false);
  }, [state]);

  const handleEditSubmit = useCallback(
    async ({ title, file }: EditReportTemplateFormValue) => {
      await updateTemplate(template.name, {
        title,
        ...(file && file.size > 0 ? { file } : {})
      });
    },
    [template.name]
  );

  return (
    <div className={cnReportTemplateActions()}>
      <Tooltip title='Скачать файл шаблона'>
        <IconButton className={cnReportTemplateActions('Download')} onClick={handleDownload}>
          <DownloadOutlined />
        </IconButton>
      </Tooltip>
      {currentUser.isAdmin && (
        <>
          <Tooltip title={template.system ? 'Системный шаблон нельзя изменить' : 'Редактировать'}>
            <span>
              <IconButton
                className={cnReportTemplateActions('Edit')}
                onClick={openEditDialog}
                disabled={template.system}
              >
                <EditOutlined />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={template.system ? 'Системный шаблон нельзя удалить' : 'Удалить'}>
            <span>
              <IconButton
                className={cnReportTemplateActions('Delete')}
                onClick={handleDelete}
                color='error'
                disabled={deleteDisabled}
              >
                {state.deleteDialogOpen ? <Delete /> : <DeleteOutline />}
              </IconButton>
            </span>
          </Tooltip>
          <FormDialog<EditReportTemplateFormValue>
            key={`edit-report-template-${template.name}-${String(state.editDialogOpen)}`}
            open={state.editDialogOpen}
            value={{ name: template.name, title: template.title }}
            schema={editReportTemplateSchema}
            onClose={closeEditDialog}
            actionFunction={handleEditSubmit}
            actionButtonProps={{ children: 'Сохранить' }}
            title='Редактировать шаблон отчёта'
          />
        </>
      )}
    </div>
  );
});
