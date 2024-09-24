import React, { FC } from 'react';
import { MenuItem, Tooltip } from '@mui/material';
import { WorkspacePremiumOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { filesClient } from '../../../services/data/files/files.client';
import { Link } from '../../Link/Link';
import { MenuIconButton } from '../../MenuIconButton/MenuIconButton';

interface FilesSignatureProps {
  id: string;
  title: string;
  signed: boolean;
}

const cnFiles = cn('Files');

export const FilesSignature: FC<FilesSignatureProps> = ({ id, title, signed }) =>
  signed && (
    <MenuIconButton
      className={cnFiles('Signature')}
      icon={
        <Tooltip title='Файл подписан ЭЦП'>
          <WorkspacePremiumOutlined color='success' />
        </Tooltip>
      }
    >
      <MenuItem component={Link} href={filesClient.getFileEcpUrl(id)} variant='none' download={title}>
        Скачать ЭЦП
      </MenuItem>
      <MenuItem component={Link} href={filesClient.getFileWithEcpUrl(id)} variant='none' download={title}>
        Скачать файл с ЭЦП
      </MenuItem>
    </MenuIconButton>
  );
