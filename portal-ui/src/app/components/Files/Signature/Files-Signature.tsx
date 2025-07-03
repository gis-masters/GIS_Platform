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
import { verifyEcp } from '../../../services/data/files/files.service';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { services } from '../../../services/services';
import { cryptoProStore } from '../../../stores/CryptoPro.store';
import { IconButton } from '../../IconButton/IconButton';
import { Link } from '../../Link/Link';
import { MenuIconButton } from '../../MenuIconButton/MenuIconButton';
import { FilesSignDialog } from '../SignDialog/Files-SignDialog';

interface FilesSignatureProps {
  id: string;
  title: string;
  signed: boolean;
  propertyName?: string;
  document?: LibraryRecord;
  feature?: WfsFeature;
  updateFileInfo(): Promise<void>;
}

type FilesSignatureState = {
  isInfoOpen: boolean;
  fileSignDialogOpen: boolean;
  ecps: VerifyEcpResponse[];
  setInfoOpen(isOpen: boolean): void;
  setFileSignDialogOpen(fileSignDialogOpen: boolean): void;
  setVerifyEcpResponse(ecpResponse: VerifyEcpResponse[]): void;
};

const cnFiles = cn('Files');

const FilesSignatureFC: FC<FilesSignatureProps> = observer(
  ({ id, title, signed, propertyName, document, feature, updateFileInfo }) => {
    const { isInfoOpen, fileSignDialogOpen, ecps, setInfoOpen, setFileSignDialogOpen, setVerifyEcpResponse } =
      useLocalObservable(
        (): FilesSignatureState => ({
          isInfoOpen: false,
          fileSignDialogOpen: false,
          ecps: [],
          setInfoOpen(this: FilesSignatureState, isOpen: boolean) {
            this.isInfoOpen = isOpen;
          },
          setFileSignDialogOpen(fileSignDialogOpen: boolean): void {
            this.fileSignDialogOpen = fileSignDialogOpen;
          },
          setVerifyEcpResponse(this: FilesSignatureState, ecps: VerifyEcpResponse[]) {
            this.ecps = ecps;
          }
        })
      );

    const ref = useRef(null);

    const handleInfoClick = useCallback(async () => {
      setInfoOpen(true);

      try {
        setVerifyEcpResponse(await verifyEcp(id));
      } catch {
        setInfoOpen(false);
        services.logger.warn(`Не удалось выполнить проверку электронно цифровой подписи для файла: ${id}`);
      }
    }, [id, setVerifyEcpResponse, setInfoOpen]);

    const closeSignerInfo = useCallback(() => {
      setInfoOpen(false);
    }, [setInfoOpen]);

    const handleCoSignClick = useCallback(() => {
      setFileSignDialogOpen(true);
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

            <Tooltip placement='top' title={cryptoProStore.isPluginActive ? '' : 'Плагин КрипроПро не подключен'}>
              <span>
                <MenuItem disabled={!cryptoProStore.isPluginActive} onClick={handleCoSignClick}>
                  Утвердить
                </MenuItem>
              </span>
            </Tooltip>

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
              {ecps.length &&
                ecps.map((ecp, i) => (
                  <CardHeader
                    key={i}
                    avatar={<WorkspacePremiumOutlined color='success' fontSize='large' />}
                    title={`Подписано: ${ecp.signer.split(',')[0]}`}
                    subheader={
                      <Typography color={'success'}>{`Подпись${ecp?.verified ? '' : ' не'} подтверждена`}</Typography>
                    }
                    action={
                      i === 0 && (
                        <IconButton onClick={closeSignerInfo}>
                          <CloseIcon />
                        </IconButton>
                      )
                    }
                  />
                ))}
              {!ecps.length && (
                <CardContent sx={{ textAlign: 'center' }}>
                  <CircularProgress size={50} disableShrink />
                </CardContent>
              )}
            </Card>
          </Popover>

          <FilesSignDialog
            id={id}
            title={title}
            propertyName={propertyName}
            document={document}
            feature={editFeatureStore.firstFeature || feature}
            open={fileSignDialogOpen}
            onClose={setFileSignDialogOpen}
            updateFileInfo={updateFileInfo}
          />
        </>
      )
    );
  }
);

export const FilesSignature = memo(FilesSignatureFC);
