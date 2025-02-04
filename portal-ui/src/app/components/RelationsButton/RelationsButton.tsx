import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { ListItemIcon, ListItemText, MenuItem, Tooltip } from '@mui/material';
import { FileOpenOutlined, LinkOutlined, MapOutlined, OpenInNewOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { Relation } from '../../services/data/schema/schema.models';
import { convertComplexNamesArrayToTableNamesUriFragment } from '../../services/gis/layers/layers.utils';
import { buildCql } from '../../services/util/cql/buildCql';
import { Link } from '../Link/Link';
import { MenuIconButton } from '../MenuIconButton/MenuIconButton';

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
        let url = '';

        if (relation.type === 'document') {
          url =
            `/data-management/library/${String(relation.library)}/registry?filter=` +
            encodeURI(JSON.stringify({ [targetProperty]: { $ilike: String(obj[relation.property]) } }));
        }

        if (relation.type === 'feature' && relation.layers) {
          const cqlFilter = buildCql({ [targetProperty]: String(obj[relation.property]) });
          if (relation.projectId) {
            url = `/projects/${relation.projectId}/map?queryLayers=${convertComplexNamesArrayToTableNamesUriFragment(relation.layers)}&queryFilter=${cqlFilter}`;
          }
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
