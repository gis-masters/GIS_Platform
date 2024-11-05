import React, { FC, memo, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { WorkspacePremiumOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { Certificate, getUserCertificates } from 'crypto-pro';
import { Coordinate } from 'ol/coordinate';

import { communicationService } from '../../../services/communication.service';
import { fileSignCreate } from '../../../services/cryptopro/cryptoPro.service';
import { FileInfo, isFileInfoArray } from '../../../services/data/files/files.models';
import { createFile, getFile } from '../../../services/data/files/files.service';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { updateLibraryRecord } from '../../../services/data/library/library.service';
import { PropertyType } from '../../../services/data/schema/schema.models';
import { updateFeature } from '../../../services/data/vectorData/vectorData.service';
import { extractFeatureId } from '../../../services/geoserver/featureType/featureType.util';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { services } from '../../../services/services';
import { achtung } from '../../../services/utility-dialogs.service';
import { sidebars } from '../../../stores/Sidebars.store';
import { ChooseXTableDialog } from '../../ChooseXTableDialog/ChooseXTableDialog';
import { IconButton } from '../../IconButton/IconButton';
import { Loading } from '../../Loading/Loading';
import { Toast } from '../../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./Files-Sign.scss';

const cnFiles = cn('Files');

interface FileSignState {
  dialogOpen: boolean;
  fileBlob: Blob | null;
  certificates: Certificate[];
  loading: boolean;
  setLoading(loading: boolean): void;
  setDialogOpen(dialogOpen: boolean): void;
  setFileBlob(fileBlob: Blob): void;
  setCertificates(certificates: Certificate[]): void;
}

interface FilesSignatureProps {
  id: string;
  title: string;
  propertyName?: string;
  document?: LibraryRecord;
  feature?: WfsFeature<Coordinate>;
  updateFileInfo(): Promise<void>;
}

const FilesSignFC: FC<FilesSignatureProps> = observer(
  ({ id, title, propertyName, feature, document, updateFileInfo }) => {
    const { dialogOpen, fileBlob, certificates, loading, setLoading, setDialogOpen, setFileBlob, setCertificates } =
      useLocalObservable(
        (): FileSignState => ({
          dialogOpen: false,
          fileBlob: null,
          certificates: [],
          loading: false,

          setLoading(loading: boolean): void {
            this.loading = loading;
          },
          setDialogOpen(dialogOpen: boolean): void {
            this.dialogOpen = dialogOpen;
          },
          setFileBlob(fileBlob: Blob): void {
            this.fileBlob = fileBlob;
          },
          setCertificates(certificates: Certificate[]): void {
            this.certificates = certificates;
          }
        })
      );

    const handleCloseClick = useCallback(() => {
      setDialogOpen(false);
      setLoading(false);
    }, [setDialogOpen]);

    const handleSelectClick = useCallback(
      (certName: Certificate[]) => {
        if (fileBlob && certName[0].name) {
          fileSignCreate(fileBlob, certName[0].name)
            .then(async signedFileBlob => {
              const signatureFile = new File([signedFileBlob], title + '.sig', { type: 'application/pgp-signature' });
              const newFileInfoWithSignature = await createFile(signatureFile);
              // бэк не хавает полноценный FileInfo по какой то причине(ломает список файлов), урезаем его
              const fileInfoWithSignatureForLibRecord: FileInfo = {
                id: newFileInfoWithSignature.id,
                size: newFileInfoWithSignature.size,
                title: newFileInfoWithSignature.title
              };

              if (document && propertyName) {
                const files = document[propertyName];

                // докидываем файл подписи к файлу который подписываем
                if (isFileInfoArray(files)) {
                  await updateLibraryRecord(document, {
                    [propertyName]: [...files, fileInfoWithSignatureForLibRecord]
                  });
                  void updateFileInfo();
                }
              } else if (
                feature &&
                propertyName &&
                sidebars.layerOfEditedFeature &&
                sidebars.layerOfEditedFeature.dataset &&
                sidebars.layerOfEditedFeature.tableName
              ) {
                const files = JSON.parse(String(feature.properties[propertyName])) as unknown;

                if (isFileInfoArray(files)) {
                  await updateFeature(
                    sidebars.layerOfEditedFeature.dataset,
                    sidebars.layerOfEditedFeature.tableName,
                    extractFeatureId(feature.id),
                    {
                      type: 'Feature',
                      properties: { [propertyName]: [...files, fileInfoWithSignatureForLibRecord] }
                    }
                  );

                  communicationService.featuresUpdated.emit();
                }
              }
            })
            .catch((error: unknown) => services.logger.error(error));
        } else {
          Toast.error(`Ошибка подписи: не найден ${fileBlob ? 'файл' : 'сертификат'}`);
        }

        setDialogOpen(false);
        setLoading(false);
      },
      [fileBlob, document, propertyName, title, updateFileInfo]
    );

    const handleSignClick = useCallback(async () => {
      let fileString: string = '';

      try {
        setLoading(true);
        fileString = await getFile(id);
        setLoading(false);
      } catch {
        setLoading(false);
        await achtung({
          title: 'Не удалось получить файл для подписи'
        });

        return;
      }

      try {
        const fileBlob = new Blob([fileString]);
        setFileBlob(fileBlob);
        setLoading(true);

        const certificates = await getUserCertificates();
        setCertificates(certificates);

        setLoading(false);
        setDialogOpen(true);
      } catch {
        setLoading(false);
        await achtung({
          title: 'Отсутствуют сертификаты для подписи'
        });
      }
    }, [id, setCertificates, setFileBlob, setDialogOpen]);

    const getRowId = useCallback((rowData: Certificate) => {
      return rowData.thumbprint;
    }, []);

    return (
      <>
        <ChooseXTableDialog<Certificate>
          data={certificates}
          title='Выбор сертификата'
          cols={[
            {
              field: 'name',
              title: 'Имя сертификата',
              filterable: true,
              sortable: true
            },
            {
              field: 'validFrom',
              settings: { format: 'DD.MM.YYYY HH:mm:ss' },
              type: PropertyType.DATETIME,
              title: 'Действителен от',
              filterable: true,
              sortable: true
            },
            {
              field: 'validTo',
              settings: { format: 'DD.MM.YYYY HH:MM:SS' },
              type: PropertyType.DATETIME,
              title: 'Действителен до',
              filterable: true,
              sortable: true
            }
          ]}
          defaultSort={{ asc: true, field: 'name' }}
          open={dialogOpen}
          onClose={handleCloseClick}
          onSelect={handleSelectClick}
          getRowId={getRowId}
          single
        />

        <Tooltip title={'Подписать ЭЦП'}>
          <span className={cnFiles('Wrapper')}>
            <IconButton onClick={handleSignClick} className={cnFiles('Sign')} size='small'>
              <WorkspacePremiumOutlined color='disabled' fontSize='small' />
            </IconButton>
          </span>
        </Tooltip>

        <Loading global visible={loading} />
      </>
    );
  }
);

export const FilesSign = memo(FilesSignFC);
