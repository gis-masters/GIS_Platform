import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { FileOpenOutlined, LinkOutlined, MapOutlined, OpenInNewOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { LibraryRecord } from '../../../services/data/library/library.models';
import { Schema } from '../../../services/data/schema/schema.models';
import { convertComplexNamesArrayToTableNamesUriFragment } from '../../../services/gis/layers/layers.utils';
import { buildCql } from '../../../services/util/cql/buildCql';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Link } from '../../Link/Link';

const cnLibraryDocumentActionsRelations = cn('LibraryDocumentActions', 'Relations');

interface LibraryDocumentActionsPrintRelations {
  document: LibraryRecord;
  schema: Schema;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsRelations extends Component<LibraryDocumentActionsPrintRelations> {
  render() {
    const { as, schema, document } = this.props;

    return (
      <ActionsItem
        className={cnLibraryDocumentActionsRelations()}
        title='Связи'
        as={as}
        icon={<LinkOutlined />}
        submenu={schema.relations?.map((relation, i) => {
          const targetProperty = relation.targetProperty || relation.property;

          let url: string = '';

          if (relation.type === 'document') {
            if (!relation.library) {
              throw new Error('Ошибка схемы: relations установлен некорректно');
            }
            url =
              `/data-management/library/${relation.library}/registry?filter=` +
              encodeURI(JSON.stringify({ [targetProperty]: { $ilike: String(document[relation.property]) } }));
          }

          if (relation.type === 'feature') {
            if (!relation.projectId || !relation.layers) {
              throw new Error('Ошибка схемы: relations установлен некорректно');
            }

            const cqlFilter = buildCql({ [targetProperty]: String(document[relation.property]) });
            url = `/projects/${relation.projectId}/map?queryLayers=${convertComplexNamesArrayToTableNamesUriFragment(relation.layers)}&queryFilter=${cqlFilter}`;
          }

          if (!url) {
            return null;
          }

          return (
            <Link href={url} key={i} target='_blank' variant='contents'>
              <MenuItem>
                <ListItemIcon>{relation.type === 'document' ? <FileOpenOutlined /> : <MapOutlined />}</ListItemIcon>
                <ListItemText>{relation.title}</ListItemText>
                &nbsp;
                <OpenInNewOutlined fontSize='small' color='action' />
              </MenuItem>
            </Link>
          );
        })}
      />
    );
  }
}
