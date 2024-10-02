import React, { FC, memo, useCallback, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  MenuItem,
  Popover,
  Tooltip,
  Typography
} from '@mui/material';
import { WorkspacePremiumOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { cn } from '@bem-react/classname';

import { VerifyEcpResponse } from '../../../../server-types/common-contracts';
import { filesClient } from '../../../services/data/files/files.client';
import { getEcpInfo } from '../../../services/data/files/files.service';
import { IconButton } from '../../IconButton/IconButton';
import { Link } from '../../Link/Link';
import { MenuIconButton } from '../../MenuIconButton/MenuIconButton';
import { Toast } from '../../Toast/Toast';

interface FilesSignatureProps {
  id: string;
  title: string;
  signed: boolean;
}

type FilesSignatureState = {
  isInfoOpen: boolean;
  ecp: VerifyEcpResponse | null;
  setInfoOpen(isOpen: boolean): void;
  setEcp(ecp: VerifyEcpResponse): void;
};

const cnFiles = cn('Files');

const FilesSignatureFC: FC<FilesSignatureProps> = observer(({ id, title, signed }) => {
  const { isInfoOpen, ecp, setInfoOpen, setEcp } = useLocalObservable(
    (): FilesSignatureState => ({
      isInfoOpen: false,
      setInfoOpen(this: FilesSignatureState, isOpen: boolean) {
        this.isInfoOpen = isOpen;
      },
      ecp: null,
      setEcp(this: FilesSignatureState, ecp: VerifyEcpResponse) {
        this.ecp = ecp;
      }
    })
  );

  const ref = useRef(null);

  const handleInfoClick = useCallback(async () => {
    setInfoOpen(true);

    try {
      setEcp(await getEcpInfo(id));
    } catch {
      setInfoOpen(false);
      Toast.warn({ message: 'Ошибка получения информации об электронно цифровой подписи' });
    }
  }, [id, setEcp, setInfoOpen]);

  const closeSignerInfo = useCallback(() => {
    setInfoOpen(false);
  }, [setInfoOpen]);

  return (
    signed && (
      <>
        <MenuIconButton
          className={cnFiles('Signature')}
          icon={
            <Tooltip title='Файл подписан ЭЦП'>
              <WorkspacePremiumOutlined color='success' ref={ref} />
            </Tooltip>
          }
        >
          {signed && <MenuItem onClick={handleInfoClick}>Информация</MenuItem>}
          <Divider />
          <MenuItem component={Link} href={filesClient.getFileEcpUrl(id)} variant='none' download={title}>
            Скачать ЭЦП
          </MenuItem>
          <MenuItem component={Link} href={filesClient.getFileWithEcpUrl(id)} variant='none' download={title}>
            Скачать файл с ЭЦП
          </MenuItem>
        </MenuIconButton>
        <Popover
          open={isInfoOpen}
          anchorEl={ref?.current}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          onClose={closeSignerInfo}
        >
          <Card sx={{ width: 300, minHeight: 80 }}>
            {!!ecp && (
              <CardHeader
                avatar={<WorkspacePremiumOutlined color='success' fontSize='large' />}
                title={`Подписано: ${ecp.signer.split(',')[0]}`}
                subheader={
                  <Typography color={'success'}>{`Подпись${ecp?.verified ? '' : ' не'} подтверждена`}</Typography>
                }
                action={
                  <IconButton onClick={closeSignerInfo}>
                    <CloseIcon />
                  </IconButton>
                }
              />
            )}
            {!ecp && (
              <CardContent sx={{ textAlign: 'center' }}>
                <CircularProgress size={50} disableShrink />
              </CardContent>
            )}
          </Card>
        </Popover>
      </>
    )
  );
});

export const FilesSignature = memo(FilesSignatureFC);
