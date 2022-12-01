import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { FileOpenOutlined, LinkOutlined, MapOutlined, OpenInNewOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { LibraryRecord } from '../../../services/data/doc-library.service';
import { cqlBuild } from '../../../services/util/cqlBuild';
import { Schema } from '../../../services/data/schema.models';
import { Link } from '../../Link/Link';

import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';

const cnLibraryDocumentActionsRelations = cn('LibraryDocumentActions', 'Relations');

interface LibraryDocumentActionsPrintRelations {
  document: LibraryRecord;
  schema: Schema<LibraryRecord>;
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
        submenu={schema.relations.map((relation, i) => {
          const targetProperty = relation.targetProperty || relation.property;

          let url: string;

          if (relation.type === 'document') {
            url =
              `/data-management/library/${String(relation.library)}/registry?filter=` +
              encodeURI(JSON.stringify({ [targetProperty]: { $ilike: String(document[relation.property]) } }));
          }

          if (relation.type === 'feature') {
            const cqlFilter = cqlBuild({ [targetProperty]: String(document[relation.property]) });
            url = `/projects/${relation.projectId}/map?queryLayers=${relation.layers.join(
              ','
            )}&queryFilter=${cqlFilter}`;
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
