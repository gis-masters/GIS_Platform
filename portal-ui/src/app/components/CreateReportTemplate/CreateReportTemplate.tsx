import React, { type FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { NoteAddOutlined } from '@mui/icons-material';

import { communicationService } from '../../services/communication.service';
import { PropertyType, type SimpleSchema } from '../../services/data/schema/schema.models';
import { type TemplateCreatePayload } from '../../services/report/reportTemplate/reportTemplate.models';
import { createTemplate, getTemplate } from '../../services/report/reportTemplate/reportTemplate.service';
import { FormDialog } from '../FormDialog/FormDialog';
import { IconButton } from '../IconButton/IconButton';

const CARBONE_DOCS_LINK = 'https://carbone.io/documentation.html';

const formSchema: SimpleSchema = {
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
      description: 'Уникальное системное имя шаблона',
      propertyType: PropertyType.STRING
    },
    {
      name: 'file',
      title: 'Файл шаблона',
      required: true,
      description: `Файл шаблона отчёта. Документация: ${CARBONE_DOCS_LINK}`,
      propertyType: PropertyType.INPUT_FILE
    }
  ]
};

interface CreateReportTemplateFormValue {
  name: string;
  title: string;
  file: File;
}

type CreateReportTemplateState = {
  dialogOpen: boolean;
  setDialogOpen(open: boolean): void;
};

export const CreateReportTemplate: FC = observer(() => {
  const state = useLocalObservable<CreateReportTemplateState>(() => ({
    dialogOpen: false,
    setDialogOpen(open) {
      this.dialogOpen = open;
    }
  }));

  const openDialog = useCallback(() => {
    state.setDialogOpen(true);
  }, [state]);

  const closeDialog = useCallback(() => {
    state.setDialogOpen(false);
  }, [state]);

  const create = useCallback(async ({ name, title, file }: CreateReportTemplateFormValue) => {
    const dto: TemplateCreatePayload = { name, title, printFormSchemaOverrides: null };
    const created = await createTemplate(dto, file);
    const full = await getTemplate(created.name);
    communicationService.reportTemplateUpdated.emit({ type: 'create', data: full });
  }, []);

  return (
    <>
      <Tooltip title='Создать шаблон отчёта'>
        <IconButton onClick={openDialog}>
          <NoteAddOutlined />
        </IconButton>
      </Tooltip>

      <FormDialog<CreateReportTemplateFormValue>
        open={state.dialogOpen}
        value={{}}
        schema={formSchema}
        onClose={closeDialog}
        actionFunction={create}
        actionButtonProps={{ children: 'Создать' }}
        title='Создать шаблон отчёта'
      />
    </>
  );
});
