import React, { type FC, useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { type SelectChangeEvent } from '@mui/material/Select';
import { withBemMod } from '@bem-react/core';

import { Card } from '../../../../components/Card/Card';
import { CardRow } from '../../../../components/Card/Row/Card-Row';
import { CardRowTitle } from '../../../../components/Card/RowTitle/Card-RowTitle';
import { CardValue } from '../../../../components/Card/Value/Card-Value';
import { Select } from '../../../../components/Select/Select';
import { type CrgUser, type MinimizedCrgUser } from '../../../../services/auth/users/users.models';
import { usersService } from '../../../../services/auth/users/users.service';
import { type ContentType, type PropertyOption, type Schema } from '../../../../services/data/schema/schema.models';
import { applyContentType } from '../../../../services/data/schema/utils/applyContentType';
import { applyView } from '../../../../services/data/schema/utils/applyView';
import { isLinear, isPoint, isPolygonal } from '../../../../services/geoserver/wfs/wfs.util';
import { GeometryIcon } from '../../../GeometryIcon/GeometryIcon';
import { SchemaProperties } from '../../../SchemaProperties/SchemaProperties';
import { TagsList } from '../../../TagsList/TagsList';
import { Users } from '../../../Users/Users';
import { assertExplorerItemDataTypeSchemaTemplate } from '../../Adapter/_type/Explorer-Adapter_type_schemaTemplate';
import { ExplorerItemType } from '../../Explorer.models';
import { cnExplorerWidgets, type ExplorerWidgetsProps } from '../Explorer-Widgets.base';

const EMPTY = '~~~empty_value~~~';

type ExplorerWidgetsTypeSchemaTemplateState = {
  selectedViewId: string;
  selectedContentTypeId: string;
  createdByUser?: MinimizedCrgUser;
  modifiedByUser?: MinimizedCrgUser;

  setSelectedContentTypeId(contentTypeId: string): void;
  setSelectedViewId(viewId: string): void;
  setCreatedByUser(user?: MinimizedCrgUser): void;
  setModifiedByUser(user?: MinimizedCrgUser): void;
};

const toMinimizedUser = (user: CrgUser): MinimizedCrgUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  surname: user.surname,
  middleName: user.middleName
});

export const ExplorerWidgetsTypeSchemaTemplate: FC<ExplorerWidgetsProps> = observer(({ className, item }) => {
  assertExplorerItemDataTypeSchemaTemplate(item);

  const schemaTemplate = item.payload;
  const schema = schemaTemplate.classRule;
  const { tags } = schema;
  const { createdBy, modifiedBy } = schemaTemplate;

  const state = useLocalObservable<ExplorerWidgetsTypeSchemaTemplateState>(() => ({
    selectedViewId: EMPTY,
    selectedContentTypeId: EMPTY,
    createdByUser: undefined,
    modifiedByUser: undefined,

    setSelectedContentTypeId(contentTypeId) {
      this.selectedContentTypeId = contentTypeId;
      this.selectedViewId = EMPTY;
    },

    setSelectedViewId(viewId) {
      this.selectedViewId = viewId;
      this.selectedContentTypeId = EMPTY;
    },

    setCreatedByUser(user) {
      this.createdByUser = user;
    },

    setModifiedByUser(user) {
      this.modifiedByUser = user;
    }
  }));

  useEffect(() => {
    let cancelled = false;

    state.setCreatedByUser();

    if (!createdBy) {
      return;
    }

    void (async () => {
      try {
        const user = await usersService.getUserByEmail(createdBy);

        if (!cancelled) {
          state.setCreatedByUser(toMinimizedUser(user));
        }
      } catch {
        if (!cancelled) {
          state.setCreatedByUser();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [createdBy, state]);

  useEffect(() => {
    let cancelled = false;

    state.setModifiedByUser();

    if (!modifiedBy) {
      return;
    }

    void (async () => {
      try {
        const user = await usersService.getUserByEmail(modifiedBy);

        if (!cancelled) {
          state.setModifiedByUser(toMinimizedUser(user));
        }
      } catch {
        if (!cancelled) {
          state.setModifiedByUser();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [modifiedBy, state]);

  const getOptions = (types?: ContentType[]): PropertyOption[] => {
    if (!types) {
      return [];
    }

    return types.map(el => {
      return {
        title: el.title || el.id,
        value: el.id
      };
    });
  };

  const viewsOptions: PropertyOption[] = [
    {
      title: 'Без представления',
      value: EMPTY
    },
    ...getOptions(schema.views)
  ];

  const contentTypesOptions: PropertyOption[] = [
    {
      title: 'Все свойства',
      value: EMPTY
    },
    ...getOptions(schema.contentTypes)
  ];

  const getGeometryType = (): string => {
    const geometryType = schema.geometryType;

    if (isLinear(geometryType)) {
      return 'линейный';
    } else if (isPoint(geometryType)) {
      return 'точечный';
    } else if (isPolygonal(geometryType)) {
      return 'полигональный';
    }

    return 'неопределенный тип геометрии';
  };

  const handleViewChange = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      if (typeof event.target.value !== 'string') {
        throw new TypeError('Некорректное значение поля');
      }

      state.setSelectedViewId(event.target.value);
    },
    [state]
  );

  const handleContentTypeChange = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      if (typeof event.target.value !== 'string') {
        throw new TypeError('Некорректное значение поля');
      }

      state.setSelectedContentTypeId(event.target.value);
    },
    [state]
  );

  const getSchemaWithAppliedType = (): Schema => {
    if (state.selectedViewId !== EMPTY) {
      return applyView(schema, state.selectedViewId);
    }

    if (state.selectedContentTypeId !== EMPTY) {
      return applyContentType(schema, state.selectedContentTypeId);
    }

    return schema;
  };

  const schemaWithAppliedType = getSchemaWithAppliedType();

  return (
    <div className={cnExplorerWidgets(null, [className])}>
      <Card>
        <CardRow>
          <CardRowTitle>Идентификатор:</CardRowTitle>
          {schema.name}
        </CardRow>

        <CardRow>
          <CardRowTitle>Только для чтения:</CardRowTitle>
          {schema.readOnly ? 'да' : 'нет'}
        </CardRow>

        {schema.styleName && (
          <CardRow>
            <CardRowTitle>Стиль:</CardRowTitle>
            {schema.styleName}
          </CardRow>
        )}

        {schema.geometryType && (
          <CardRow>
            <CardRowTitle>Тип геометрии:</CardRowTitle>
            <Tooltip title={getGeometryType()}>
              <span>
                <CardValue>
                  <GeometryIcon colorized size='small' geometryType={schema.geometryType} />
                </CardValue>
              </span>
            </Tooltip>
          </CardRow>
        )}

        {!!schema.views?.length && (
          <CardRow>
            <CardRowTitle>Представление:</CardRowTitle>
            <CardValue>
              <Select options={viewsOptions} onChange={handleViewChange} value={state.selectedViewId} />
            </CardValue>
          </CardRow>
        )}

        {!!schema.contentTypes?.length && (
          <CardRow>
            <CardRowTitle>Тип документа:</CardRowTitle>
            <Select
              options={contentTypesOptions}
              onChange={handleContentTypeChange}
              value={state.selectedContentTypeId}
            />
          </CardRow>
        )}

        {!!tags?.length && (
          <CardRow>
            <CardRowTitle>
              Тэги: <TagsList tags={tags} />
            </CardRowTitle>
          </CardRow>
        )}

        {createdBy && (
          <CardRow>
            <CardRowTitle>Владелец:</CardRowTitle>
            {state.createdByUser ? <Users value={[state.createdByUser]} /> : createdBy}
          </CardRow>
        )}

        {schemaTemplate.system && (
          <CardRow>
            <CardRowTitle>Системная схема:</CardRowTitle>
            да
          </CardRow>
        )}

        {modifiedBy && (
          <CardRow>
            <CardRowTitle>Изменил:</CardRowTitle>
            {state.modifiedByUser ? <Users value={[state.modifiedByUser]} /> : modifiedBy}
          </CardRow>
        )}

        <CardRow alignBlock>
          <CardRowTitle>Свойства:</CardRowTitle>
          <CardValue block>
            <SchemaProperties readonly schema={schemaWithAppliedType} />
          </CardValue>
        </CardRow>
      </Card>
    </div>
  );
});

export const withTypeSchemaTemplate = withBemMod<ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.SCHEMA_TEMPLATE },
  () => ExplorerWidgetsTypeSchemaTemplate
);
