import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { FileOpenOutlined, LinkOutlined, OpenInNewOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Schema } from '../../../services/crg/schema.models';
import { LibraryRecord } from '../../../services/crg/doc-library.service';
import { Link } from '../../Link/Link';

import { LibraryDocumentActionsItem } from '../Item/LibraryDocumentActions-Item.composed';
import { ActionsItemVariant } from '../Item/LibraryDocumentActions-Item';

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
      <LibraryDocumentActionsItem
        className={cnLibraryDocumentActionsRelations()}
        title='Связанные документы'
        as={as}
        icon={<LinkOutlined />}
        submenu={schema.relations.map((relation, i) => {
          const targetProperty = relation.targetProperty || relation.property;
          const url =
            `/data-management/library/${String(relation.library)}/registry?filter=` +
            encodeURI(JSON.stringify({ [targetProperty]: { $ilike: `%${String(document[relation.property])}%` } }));

          return (
            <Link href={url} key={i} target='_blank' variant='contents'>
              <MenuItem>
                <ListItemIcon>
                  <FileOpenOutlined />
                </ListItemIcon>
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
