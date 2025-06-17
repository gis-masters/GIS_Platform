import React, { FC, memo, useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { AxiosError } from 'axios';
import { Certificate, getUserCertificates } from 'crypto-pro';

import { communicationService } from '../../../services/communication.service';
import { createSignature, getUsedCertificates } from '../../../services/cryptopro/cryptoPro.service';
import { getFileEcp, getFileHash, signFile } from '../../../services/data/files/files.service';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { PropertyType } from '../../../services/data/schema/schema.models';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { services } from '../../../services/services';
import { notFalsyFilter } from '../../../services/util/NotFalsyFilter';
import { achtung } from '../../../services/utility-dialogs.service';
import { sidebars } from '../../../stores/Sidebars.store';
import { ChooseXTableDialog } from '../../ChooseXTableDialog/ChooseXTableDialog';
import { Loading } from '../../Loading/Loading';
import { Toast } from '../../Toast/Toast';

interface FileSignState {
  certificates: Certificate[];
  loading: boolean;
  fileHash: string;
  prevSignatures: ArrayBuffer | undefined;
  disabledCertificates: Certificate[];
  setDisabledCertificates(disabledCertificates: Certificate[]): void;
  setPrevSignatures(prevSignatures: ArrayBuffer): void;
  setFileHash(fileHash: string): void;
  setLoading(loading: boolean): void;
  setCertificates(certificates: Certificate[]): void;
}

interface FilesSignatureProps {
  id: string;
  title: string;
  open: boolean;
  propertyName?: string;
  document?: LibraryRecord;
  feature?: WfsFeature;
  onClose(open: boolean): void;
  updateFileInfo(): Promise<void>;
}

const FilesSignDialogFC: FC<FilesSignatureProps> = observer(
  ({ id, title, propertyName, feature, document, open, onClose, updateFileInfo }) => {
    const {
      certificates,
      loading,
      fileHash,
      prevSignatures,
      disabledCertificates,
      setDisabledCertificates,
      setPrevSignatures,
      setFileHash,
      setLoading,
      setCertificates
    } = useLocalObservable(
      (): FileSignState => ({
        certificates: [],
        loading: false,
        fileHash: '',
        prevSignatures: undefined,
        disabledCertificates: [],
        setDisabledCertificates(disabledCertificates: Certificate[]): void {
          this.disabledCertificates = disabledCertificates;
        },
        setPrevSignatures(prevSignatures: ArrayBuffer): void {
          this.prevSignatures = prevSignatures;
        },
        setFileHash(fileHash: string): void {
          this.fileHash = fileHash;
        },
        setLoading(loading: boolean): void {
          this.loading = loading;
        },
        setCertificates(certificates: Certificate[]): void {
          this.certificates = certificates;
        }
      })
    );

    const handleCloseClick = useCallback(() => {
      onClose(false);
      setLoading(false);
    }, [onClose]);

    const handleSelectClick = useCallback(
      async (certName: Certificate[]) => {
        setLoading(true);

        if (certName[0].thumbprint) {
          try {
            const signedMessage = await createSignature(fileHash, certName[0].thumbprint, prevSignatures);

            if (!signedMessage) {
              return;
            }

            // 0xFF - Ограничивает значение диапазона от 0 до 255, чтобы соответствовать требованиям Uint8Array.
            const binaryData = Uint8Array.from(atob(signedMessage), char => char.codePointAt(0)! & 0xff);
            const fileBlob = new Blob([binaryData]);
            const signatureFile = new File([fileBlob], title + '.sig', {
              type: 'application/pgp-signature'
            });

            await signFile(id, signatureFile);

            if (document && propertyName) {
              void updateFileInfo();
            } else if (
              feature &&
              propertyName &&
              sidebars.layerOfEditedFeature &&
              sidebars.layerOfEditedFeature.dataset &&
              sidebars.layerOfEditedFeature.tableName
            ) {
              communicationService.featuresUpdated.emit();
            }
          } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            Toast.warn({ message: 'Не удалось подписать файл', details: err.message || '' });
            services.logger.error(error);
          }
        } else {
          Toast.error('Ошибка подписи: не удалось получить сертификат');
        }

        onClose(false);
        setLoading(false);
      },
      [document, propertyName, fileHash, prevSignatures, title, updateFileInfo]
    );

    useEffect(() => {
      const getInfoForSignature = async () => {
        let usedCertificates: string[] = [];
        setLoading(true);

        const hash = await getFileHash(id);
        setFileHash(hash);

        try {
          const fileSignatures = await getFileEcp(id);

          setPrevSignatures(fileSignatures);
          usedCertificates = await getUsedCertificates(hash, fileSignatures);
        } catch {
          // do nothing
        }

        try {
          const certificates = await getUserCertificates();

          setDisabledCertificates(
            certificates
              .map(cert => {
                if (usedCertificates.includes(cert.thumbprint)) {
                  return cert;
                }
              })
              .filter(notFalsyFilter)
          );

          setCertificates(certificates);
        } catch {
          setLoading(false);
          await achtung({
            title: 'Не удалось получить данные для формирования ЭЦП'
          });
        }

        setLoading(false);
      };

      if (open) {
        void getInfoForSignature();
      }
    }, [id, open]);

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
          open={open}
          onClose={handleCloseClick}
          onSelect={handleSelectClick}
          disabledItems={disabledCertificates}
          disabledItemsMessage={disabledCertificates ? 'Уже подписано эти сертификатом ' : ''}
          getRowId={getRowId}
          loading={loading}
          single
        />

        <Loading global visible={loading} />
      </>
    );
  }
);

export const FilesSignDialog = memo(FilesSignDialogFC);
