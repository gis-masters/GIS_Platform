import React, { type FC, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { Card } from '../../../../components/Card/Card';
import { CardRow } from '../../../../components/Card/Row/Card-Row';
import { CardRowTitle } from '../../../../components/Card/RowTitle/Card-RowTitle';
import { usersService } from '../../../../services/auth/users/users.service';
import { formatCrgUserFio } from '../../../../services/auth/users/users.util';
import { formatDate } from '../../../../services/util/date.util';
import { assertExplorerItemDataTypeReportTemplate } from '../../Adapter/_type/Explorer-Adapter_type_reportTemplate';
import { ExplorerItemType } from '../../Explorer.models';
import { cnExplorerWidgets, type ExplorerWidgetsProps } from '../Explorer-Widgets.base';

type ExplorerWidgetsTypeReportTemplateState = {
  authorFio: string;
  setAuthorFio(value: string): void;
};

const ExplorerWidgetsTypeReportTemplate: FC<ExplorerWidgetsProps> = observer(({ className, item }) => {
  assertExplorerItemDataTypeReportTemplate(item);
  const template = item.payload;
  const { createdBy } = template;
  const state = useLocalObservable<ExplorerWidgetsTypeReportTemplateState>(() => ({
    authorFio: '',
    setAuthorFio(value: string) {
      this.authorFio = value;
    }
  }));

  useEffect(() => {
    let cancelled = false;

    state.setAuthorFio('');

    if (!createdBy || template.system) {
      return;
    }

    void (async () => {
      try {
        const user = await usersService.getUserByEmail(createdBy);

        if (!cancelled) {
          state.setAuthorFio(formatCrgUserFio(user));
        }
      } catch {
        if (!cancelled) {
          state.setAuthorFio('');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [createdBy, state, template.system]);

  return (
    <div className={cnExplorerWidgets(null, [className])}>
      <Card>
        <CardRow
          help={
            'Технический идентификатор шаблона. Его указывают в схеме данных, чтобы связать шаблон печати с типом данных, который описывает эта схема.'
          }
        >
          <CardRowTitle>Идентификатор:</CardRowTitle>
          {template.name}
        </CardRow>
        {!template.system && (
          <>
            <CardRow>
              <CardRowTitle>Автор:</CardRowTitle>
              {state.authorFio || template.createdBy}
            </CardRow>
            <CardRow>
              <CardRowTitle>Дата создания:</CardRowTitle>
              {template.createdAt ? formatDate(template.createdAt, 'LL') : null}
            </CardRow>
          </>
        )}
      </Card>
    </div>
  );
});

export const withTypeReportTemplate = withBemMod<ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.REPORT_TEMPLATE },
  () => ExplorerWidgetsTypeReportTemplate
);
