import React, { FC } from 'react';
import { ListItemIcon, ListItemText, MenuItem, Tooltip } from '@mui/material';
import { FileOpenOutlined, LinkOutlined, OpenInNewOutlined } from '@mui/icons-material';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { Relation } from '../../services/crg/schema.models';
import { MenuIconButton } from '../MenuIconButton/MenuIconButton';
import { Link } from '../Link/Link';
import { observer } from 'mobx-react';

const cnRelatedDocumentsButton = cn('RelatedDocumentsButton');

interface RelatedDocumentsButtonProps extends IClassNameProps {
  obj: Record<string, unknown>;
  relations: Relation[];
  size?: 'small' | 'medium' | 'large';
}

export const RelatedDocumentsButton: FC<RelatedDocumentsButtonProps> = observer(
  ({ className, relations, obj, size }) => (
    <Tooltip title='Связанные документы'>
      <MenuIconButton
        className={cnRelatedDocumentsButton(null, [className])}
        icon={<LinkOutlined fontSize={size} />}
        size={size}
      >
        {relations.map((relation, i) => {
          const targetProperty = relation.targetProperty || relation.property;
          const url =
            `/data-management/library/${String(relation.library)}/registry?filter=` +
            encodeURI(JSON.stringify({ [targetProperty]: { $ilike: `%${String(obj[relation.property])}%` } }));

          return (
            <Link href={url} key={i} target='_blank' variant='contents'>
              <MenuItem>
                <ListItemIcon>
                  <FileOpenOutlined />
                </ListItemIcon>
                <ListItemText>{relation.title}</ListItemText>
                &nbsp;
                <OpenInNewOutlined fontSize={size} color='action' />
              </MenuItem>
            </Link>
          );
        })}
      </MenuIconButton>
    </Tooltip>
  )
);
