import React, { FC } from 'react';
import { ListItemIcon, ListItemText, MenuItem, Tooltip } from '@mui/material';
import { FileOpenOutlined, LinkOutlined, MapOutlined, OpenInNewOutlined } from '@mui/icons-material';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import { cqlBuild } from '../../services/util/cqlBuild';
import { Relation } from '../../services/data/schema/schema.models';
import { MenuIconButton } from '../MenuIconButton/MenuIconButton';
import { Link } from '../Link/Link';

const cnRelationsButton = cn('RelationsButton');

interface RelationsButtonProps extends IClassNameProps {
  obj: Record<string, unknown>;
  relations: Relation[];
  size?: 'small' | 'medium' | 'large';
}

export const RelationsButton: FC<RelationsButtonProps> = observer(({ className, relations, obj, size }) => (
  <Tooltip title='Связи'>
    <MenuIconButton
      className={cnRelationsButton(null, [className])}
      icon={<LinkOutlined fontSize={size} />}
      size={size}
    >
      {relations.map((relation, i) => {
        const targetProperty = relation.targetProperty || relation.property;
        let url: string;

        if (relation.type === 'document') {
          url =
            `/data-management/library/${String(relation.library)}/registry?filter=` +
            encodeURI(JSON.stringify({ [targetProperty]: { $ilike: String(obj[relation.property]) } }));
        }

        if (relation.type === 'feature') {
          const cqlFilter = cqlBuild({ [targetProperty]: String(obj[relation.property]) });
          url = `/projects/${relation.projectId}/map?queryLayers=${relation.layers.join(',')}&queryFilter=${cqlFilter}`;
        }

        return (
          <Link href={url} key={i} target='_blank' variant='contents'>
            <MenuItem>
              <ListItemIcon>{relation.type === 'document' ? <FileOpenOutlined /> : <MapOutlined />}</ListItemIcon>
              <ListItemText>{relation.title}</ListItemText>
              &nbsp;
              <OpenInNewOutlined fontSize={size} color='action' />
            </MenuItem>
          </Link>
        );
      })}
    </MenuIconButton>
  </Tooltip>
));
